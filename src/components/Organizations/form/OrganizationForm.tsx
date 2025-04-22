'use client'
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Checkbox, Divider, FormHelperText, Grid, IconButton, Input, InputLabel, ListItem, ListItemAvatar, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import * as yup from "yup";
import { CorporateFareOutlined, InfoRounded, ListOutlined } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import organizationServices from '@/lib/services/organizationServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackdropSpinner } from '@/shared/ProgressIndicators/BackdropSpinner';
import { Div, Span } from '@jumbo/shared';
import Link from 'next/link';
import { COUNTRIES } from '@jumbo/utilities/constants/countries';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PROS_CONTROL_PERMISSIONS } from '@jumbo/utilities/constants/prosControlPermissions';
import { PERMISSIONS } from '@jumbo/utilities/constants/permissions';
import { CURRENCIES } from '@jumbo/utilities/constants/currencies';
import JumboCardQuick from '@jumbo/components/JumboCardQuick';
import { useRouter } from 'next/navigation';
import { useBasicAuth } from '@/app/auth-providers/BasicAuth/hooks';

interface Organization {
  id?: string;
  name?: string;
  email?: string | null;
  phone?: string;
  tin?: string | null;
  recording_start_date?: string;
  address?: string | null;
  country_code?: string;
  logo_path?: string;
  settings?: {
    vat_registered?: boolean;
    vrn?: string | null;
    vat_percentage?: number;
    symbol_path?: string | null;
    main_color?: string;
    light_color?: string;
    dark_color?: string;
    contrast_text?: string;
    tagline?: string | null;
  };
  [key: string]: any;
}

interface Country {
  code: string;
  name: string;
  currency: Currency;
  [key: string]: any;
}

interface Currency {
  code: string;
  name: string;
  name_plural: string;
  symbol: string;
  [key: string]: any;
}

interface OrganizationFormProps {
  organization?: Organization | null;
}

interface FormValues {
    id?: string;
    name: string;
    email?: string | null;
    phone: string;
    tin?: string | null;
    recording_start_date: string;
    address?: string | null;
    vat_registered: boolean;
    vrn?: string | null;
    vat_percentage?: number;
    symbol_path?: string | null;
    main_color: string;
    light_color: string;
    dark_color: string;
    contrast_text: string;
    tagline?: string | null;
    country_code: string;
    currency_code: string;
    website?: string | null;
    logo?: FileList | null;
    organization_symbol?: FileList | null;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization = null }) => {
  const { enqueueSnackbar } = useSnackbar();
  const configAuth = useBasicAuth();
  const { authUser, checkPermission, checkOrganizationPermission } = useJumboAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  
  const allCountries = Object.values(COUNTRIES).map((country: any) => country as Country);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const canCreateOrganization = checkPermission([PROS_CONTROL_PERMISSIONS.ORGANIZATIONS_MANAGE]);
  const canEditOrganization = canCreateOrganization || (organization && checkOrganizationPermission([PERMISSIONS.ORGANIZATION_UPDATE]));

  const validationSchema = yup.object({
    id: yup.string().optional(),
    name: yup.string().required('Organization Name is required'),
    email: yup.string().email('Enter a valid email').nullable(),
    phone: yup
      .string()
      .required('Phone Number is required')
      .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    tin: yup.string().nullable(),
    recording_start_date: yup.string().required('Recording start date is required'),
    address: yup.string().nullable(),
    website: yup
      .string()
      .matches(
        /^$|((https?):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter a correct URL!'
      )
      .nullable(),
    country_code: yup.string().required('Organization Country is required'),
    currency_code: yup.string().required("Currency code is required"),
    vat_registered: yup.boolean(),
    vrn: yup.string().when('vat_registered', {
      is: true,
      then: (schema) => schema.required('VRN is required when VAT registered'),
      otherwise: (schema) => schema.nullable()
    }),
    vat_percentage: yup.number().when('vat_registered', {
      is: true,
      then: (schema) => schema
        .positive('VAT percentage is required')
        .max(100, 'VAT percentage must be less than or equal to 100')
        .required('VAT percentage is required'),
      otherwise: (schema) => schema.positive().optional()
    }),
    symbol_path: yup.string().nullable(),
    main_color: yup.string().required('Main color is required'),
    light_color: yup.string().required('Light color is required'),
    dark_color: yup.string().required('Dark color is required'),
    contrast_text: yup.string().required('Contrast text is required'),
    tagline: yup.string().max(50, 'Tagline must be at most 50 characters').nullable(),
    logo: yup.mixed().optional(),
    organization_symbol: yup.mixed().optional()
  });

  const { handleSubmit, register, setValue, watch, setError, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
        id: organization?.id,
        name: organization?.name || '',
        email: organization?.email ?? null,
        phone: organization?.phone || '',
        tin: organization?.tin ?? null,
        recording_start_date: organization?.recording_start_date || '',
        address: organization ? organization.address :  null,
        vat_registered : organization?.settings?.vat_registered ? organization.settings.vat_registered : false,
        vrn : organization?.settings?.vrn ? organization.settings.vrn : null,
        vat_percentage : organization?.settings?.vat_percentage ? organization.settings.vat_percentage : 18,
        symbol_path: organization?.settings?.symbol_path  ? organization.settings.symbol_path : null,
        main_color: organization?.settings?.main_color ? organization.settings?.main_color : theme.palette.primary.main,
        light_color: organization?.settings?.light_color ? organization.settings?.light_color : '#bec5da',
        dark_color: organization?.settings?.dark_color  ? organization.settings.dark_color : theme.palette.primary.dark,
        contrast_text: organization?.settings?.contrast_text ? organization.settings?.contrast_text : theme.palette.primary.contrastText,
        tagline : organization?.settings?.tagline ? organization.settings.tagline : null,
        country_code: organization?.country_code,
        currency_code: selectedCurrency?.code
    }
  });

  const addOrganization = useMutation<any, Error, FormValues>({
    mutationFn: organizationServices.create,
    onSuccess: (data) => {
    //   if (configAuth) {
    //     configAuth({ 
    //       token: data.token, 
    //       currentOrganization: data.newOrganization, 
    //       currentUser: data.authUser 
    //     });
    //   }
      router.push(`/organizations/profile/${data.newOrganization.organization.id}`);
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error: any) => {
      if (error?.response?.data?.validation_errors) {
        Object.entries(error.response.data.validation_errors).forEach(([fieldName, messages]) => {
          setError(fieldName as keyof FormValues, {
            type: 'manual',
            message: (messages as string[]).join('<br/>')
          });
        });
      } else if (error?.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    }
  });
  
  const updateOrganization = useMutation<any, Error, FormValues>({
    mutationFn: organizationServices.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizationDetails'] });
      router.push('/organizations');
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error: any) => {
      if (error?.response?.data?.validation_errors) {
        Object.entries(error.response.data.validation_errors).forEach(([fieldName, messages]) => {
          setError(fieldName as keyof FormValues, {
            type: 'manual',
            message: (messages as string[]).join('<br/>')
          });
        });
      } else if (error?.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    }
  });

  const saveMutation = React.useMemo(() => {
    return organization ? updateOrganization.mutate : addOrganization.mutate
  },[updateOrganization,addOrganization]);

  useEffect(() => {
    if (organization) {
      const organizationCountry = allCountries.find(country => country.code === organization.country_code);
      setSelectedCountry(organizationCountry || null);
      if (organizationCountry?.currency) {
        setSelectedCurrency(organizationCountry.currency);
      }
    }
  }, [organization]);

  useEffect(() => {
    if (selectedCurrency) {
      setValue('currency_code', selectedCurrency.code);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (!canEditOrganization) {
      router.push('/');
    }
  }, [authUser, organization]);

  return (
        <React.Fragment>
            {addOrganization.isPending && <BackdropSpinner message={"Please wait while we are setting up your organization..."} />}
            <JumboCardQuick
                title={
                    <Typography variant={"h4"}>
                        <CorporateFareOutlined />{' Organization Information'}
                    </Typography>
                }
                action={
                    <Span>
                        {organization && (
                            <Link href={`/organizations/profile/${organization.id}`} passHref>
                                <IconButton>
                                    <Tooltip title={`${organization.name} profile`} disableInteractive>
                                        <InfoRounded />
                                    </Tooltip>
                                </IconButton>
                            </Link>
                        )}
                        <Link href={'/organizations'} passHref>
                            <IconButton>
                                <Tooltip title={'Organizations List'} disableInteractive>
                                    <ListOutlined />
                                </Tooltip>
                            </IconButton>
                        </Link>
                    </Span>
                }
            >
                <form  autoComplete='off'>

                </form>
            </JumboCardQuick>
        </React.Fragment>
  );
};

export default OrganizationForm;