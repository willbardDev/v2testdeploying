'use client'
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Checkbox, Divider, FormHelperText, Grid, IconButton, Input, InputLabel, ListItem, ListItemAvatar, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import * as yup from "yup";
import { CorporateFareOutlined, InfoRounded, ListOutlined } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import organizationServices from '@/lib/services/organizationServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackdropSpinner } from '@/shared/ProgressIndicators/BackdropSpinner';
import { Div, Span } from '@jumbo/shared';
import Link from 'next/link';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import JumboCardQuick from '@jumbo/components/JumboCardQuick';
import { useRouter } from 'next/navigation';
import { COUNTRIES } from '@/utilities/constants/countries';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { CURRENCIES } from '@/utilities/constants/currencies';
import { PROS_CONTROL_PERMISSIONS } from '@/utilities/constants/prosControlPermissions';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';

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
  const { configAuth, authUser, checkPermission, checkOrganizationPermission } = useJumboAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
    const dictionary = useDictionary();

    console.log(dictionary)
  
  
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
      if (configAuth) {
        configAuth({ 
          token: data.token, 
          currentOrganization: data.newOrganization, 
          currentUser: data.authUser 
        });
      }
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

  const saveHandler: SubmitHandler<FormValues> = (formData) => {
    saveMutation(formData);
  };

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
              <form onSubmit={handleSubmit(saveHandler)} autoComplete='off'>
                <Grid container spacing={2}>
                      <Grid size={{xs: 12, md: 4}}>
                          <TextField
                              fullWidth
                              label="Name"
                              size='small'
                              autoComplete='off'
                              error={!!errors?.name}
                              helperText={errors?.name?.message}
                              {...register('name')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <TextField
                              fullWidth
                              label="Email"
                              size="small"
                              autoComplete='off'
                              error={!!errors?.email}
                              helperText={errors?.email?.message}
                              {...register('email')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <TextField
                              fullWidth
                              label="Phone"
                              size="small"
                              autoComplete='off'
                              error={!!errors?.phone}
                              helperText={errors?.phone?.message}
                              {...register('phone')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <TextField
                              fullWidth
                              label="Website"
                              size="small"
                              error={!!errors?.website}
                              helperText={errors?.website?.message}
                              {...register('website')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4, lg: 4}}>
                          <DatePicker
                              label="Recording Start"
                              defaultValue={organization ? dayjs(organization.recording_start_date) : null}
                              slotProps={{
                                  textField: {
                                      size: 'small',
                                      fullWidth: true,
                                      error: !!errors?.recording_start_date,
                                      helperText: errors?.recording_start_date?.message
                                  }
                              }}
                              onChange={(newValue) => {
                                  setValue('recording_start_date', newValue ? newValue.toISOString() : "", {
                                      shouldDirty: true,
                                      shouldValidate: true
                                  });
                              }}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4, lg: 4}}>
                          <TextField
                              fullWidth
                              label="Tax Identification Number"
                              size="small"
                              autoComplete='off'
                              error={!!errors?.tin}
                              helperText={errors?.tin?.message}
                              {...register('tin')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <Autocomplete
                              id="checkbox-countries"
                              options={allCountries.sort((a, b) => a.name.localeCompare(b.name))}
                              isOptionEqualToValue={(option, value) => option.code === value?.code}
                              value={selectedCountry}
                              getOptionLabel={(option) => `${option.name} (${option.code})`}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Country"
                                      size="small"
                                      autoComplete='off'
                                      fullWidth
                                      error={!!errors.country_code}
                                      helperText={errors.country_code?.message}
                                  />
                              )}
                              onChange={(e, newValue) => {
                                  setSelectedCountry(newValue);
                                  setValue('country_code', newValue ? newValue.code : '', {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                  });
                                  setValue('currency_code', newValue ? newValue.currency.code : '', {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                  });
                                  setSelectedCurrency(newValue?.currency || null);
                              }}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <Autocomplete
                              id="checkbox-currencies"
                              options={CURRENCIES.sort((a, b) => a.name.localeCompare(b.name))}
                              isOptionEqualToValue={(option, value) => option.code === value?.code}
                              getOptionLabel={(option) => `${option.name_plural} (${option.code})`}
                              value={selectedCurrency}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Currency"
                                      size="small"
                                      autoComplete='off'
                                      fullWidth
                                      error={!!errors.currency_code}
                                      helperText={errors.currency_code?.message}
                                  />
                              )}
                              onChange={(e, newValue) => {
                                  setSelectedCurrency(newValue);
                                  setValue('currency_code', newValue ? newValue.code : '', {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                  });
                              }}
                          />
                      </Grid>
                      <Grid size={{xs: 12, lg: 4}}>
                          <TextField
                              fullWidth
                              label="Address"
                              size="small"
                              multiline={true}
                              minRows={2}
                              {...register('address')}
                          />
                      </Grid>
                      <Grid size={{xs: 12}} sx={{m: 1, mt: 3}}>
                          <Typography variant='body1'>
                              VAT Settings
                          </Typography>
                          <Divider/>
                      </Grid>
                      <Grid size={{xs: 12, md: 4, lg: 3}}>
                          <Typography variant='body1'>VAT Registered?</Typography>
                          <Checkbox
                              checked={!!watch('vat_registered')}
                              size='small'
                              onChange={(e) => {
                                  const checked = e.target.checked;
                                  setValue('vat_registered', checked, {
                                      shouldDirty: true,
                                      shouldValidate: true
                                  });
                              }} 
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 3}}>
                          <TextField
                              fullWidth
                              label="VRN"
                              size="small"
                              error={!!errors?.vrn}
                              helperText={errors?.vrn?.message}
                              {...register('vrn')}
                          />
                      </Grid>
                      <Grid size={{xs: 12, md: 2}}>
                          <TextField
                              fullWidth
                              label="VAT Percentage"
                              size="small"
                              error={!!errors?.vat_percentage}
                              helperText={errors?.vat_percentage?.message}
                              InputProps={{ 
                                  endAdornment: `%`
                              }}
                              {...register('vat_percentage')}
                          />
                      </Grid>

                      <Grid size={{xs: 12}} sx={{m: 1, mt: 3}}>
                          <Typography variant='body1'>
                              Identity and Branding
                          </Typography>
                          <Divider/>
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <Input
                              type="file"
                              id="logo"
                              error={!!errors?.logo}
                              {...register("logo")}
                          />
                          {!errors?.logo ? (
                              <InputLabel sx={{ mb: 1 }} id="logo-label" htmlFor={'logo'}>Organization Logo</InputLabel>
                          ) : (
                              <FormHelperText error={!!errors?.logo}>{errors?.logo?.message}</FormHelperText>
                          )}
                          {organization?.logo_path && (
                              <ListItem alignItems='flex-start' sx={{ p: theme => theme.spacing(1, 3) }}>
                                  <ListItemAvatar sx={{ mr: 2, overflow: "hidden", borderRadius: 2 }}>
                                      <img 
                                          width={"140"} 
                                          height={"105"} 
                                          style={{ verticalAlign: 'middle' }} 
                                          alt={`${organization.name} logo`}
                                          src={organization.logo_path}
                                      />
                                  </ListItemAvatar>
                              </ListItem>
                          )}
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <Input
                              type="file"
                              id="organization_symbol"
                              error={!!errors?.organization_symbol}
                              {...register("organization_symbol")}
                          />
                          {!errors?.organization_symbol ? (
                              <InputLabel sx={{ mb: 1 }} id="symbol-label" htmlFor={'organization_symbol'}>Organization Symbol</InputLabel>
                          ) : (
                              <FormHelperText error={!!errors?.organization_symbol}>{errors?.organization_symbol?.message}</FormHelperText>
                          )}
                          {organization?.settings?.symbol_path && (
                              <ListItem alignItems='flex-start' sx={{ p: theme => theme.spacing(1, 3) }}>
                                  <ListItemAvatar sx={{ mr: 2, overflow: "hidden", borderRadius: 2 }}>
                                      <img 
                                          width={"140"} 
                                          height={"105"} 
                                          style={{ verticalAlign: 'middle' }} 
                                          alt={`${organization.name} symbol`}
                                          src={organization.settings.symbol_path}
                                      />
                                  </ListItemAvatar>
                              </ListItem>
                          )}
                      </Grid>
                      <Grid size={{xs: 12, md: 4}}>
                          <Div sx={{ mt: 1, mb: 1 }}>
                              <InputLabel sx={{ mb: 1 }} id="main-color-label" htmlFor={'main_color'}>Main Color</InputLabel>
                              <Input
                                  fullWidth
                                  type="color"
                                  id="main_color"
                                  value={watch('main_color')}
                                  onChange={(e) => {
                                      setValue('main_color', e.target.value);
                                  }}
                              />
                          </Div>
                          <Div sx={{ mt: 1, mb: 1 }}>
                              <InputLabel sx={{ mb: 1 }} id="light-color-label" htmlFor={'light_color'}>Light Color</InputLabel>
                              <Input
                                  fullWidth
                                  type="color"
                                  id="light_color"
                                  value={watch('light_color')}
                                  onChange={(e) => {
                                      setValue('light_color', e.target.value);
                                  }}
                              />
                          </Div>
                          <Div sx={{ mt: 1, mb: 1 }}>
                              <InputLabel sx={{ mb: 1 }} id="dark-color-label" htmlFor={'dark_color'}>Dark Color</InputLabel>
                              <Input
                                  fullWidth
                                  type="color"
                                  id="dark_color"
                                  value={watch('dark_color')}
                                  onChange={(e) => {
                                      setValue('dark_color', e.target.value);
                                  }}
                              />
                          </Div>
                          <Div sx={{ mt: 1, mb: 1 }}>
                              <InputLabel sx={{ mb: 1 }} id="contrast-text-color-label" htmlFor={'contrast_text'}>Contrast Text Color</InputLabel>
                              <Input
                                  fullWidth
                                  type="color"
                                  id="contrast_text"
                                  value={watch('contrast_text')}
                                  onChange={(e) => {
                                      setValue('contrast_text', e.target.value);
                                  }}
                              />
                          </Div>
                          <Div sx={{ mt: 3, mb: 1 }}>
                              <TextField
                                  fullWidth
                                  label="Tagline"
                                  size="small"
                                  error={!!errors?.tagline}
                                  helperText={errors?.tagline?.message}
                                  {...register('tagline')}
                              />
                          </Div>
                      </Grid>
                      <Grid size={{xs: 12}}>
                          <Box display={'flex'} justifyContent={'flex-end'}>
                              <LoadingButton
                                  type="submit"
                                  variant="contained"
                                  size="small"
                                  sx={{ mb: 3, display: 'flex' }}
                                  loading={addOrganization.isPending || updateOrganization.isPending}
                              >
                                  Submit
                              </LoadingButton>
                          </Box>
                      </Grid>
                </Grid>
              </form>
            </JumboCardQuick>
        </React.Fragment>
  );
};

export default OrganizationForm;