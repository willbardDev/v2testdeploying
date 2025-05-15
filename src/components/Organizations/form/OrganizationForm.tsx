'use client';
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  ListItem,
  ListItemAvatar,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import * as yup from 'yup';
import { CorporateFareOutlined, InfoRounded, ListOutlined } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
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
import { useLanguage } from '@/app/[lang]/contexts/LanguageContext';
import { Organization } from '@/types/auth-types';
import organizationServices from '../organizationServices';

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
    const dictionary = useDictionary();
    const lang = useLanguage();

    const { enqueueSnackbar } = useSnackbar();
    const { configAuth, authUser, checkPermission, checkOrganizationPermission } = useJumboAuth();
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
        name: yup
            .string()
            .required(dictionary.organizations.form.errors.validation.name.required)
            .min(3, dictionary.organizations.form.errors.validation.name.min)
            .max(100, dictionary.organizations.form.errors.validation.name.max),
        email: yup
            .string()
            .email(dictionary.organizations.form.errors.validation.email.invalid)
            .nullable(),
        phone: yup
            .string()
            .required(dictionary.organizations.form.errors.validation.phone.required)
            .matches(
            /^\+?[0-9]{10,15}$/,
            dictionary.organizations.form.errors.validation.phone.invalid
            ),
        tin: yup.string().nullable(),
        recording_start_date: yup
            .string()
            .required(dictionary.organizations.form.errors.validation.recordingStart.required),
        address: yup.string().nullable(),
        website: yup
            .string()
            .matches(
            /^$|((https?):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            dictionary.organizations.form.errors.validation.website.invalid
            )
            .nullable(),
        country_code: yup
            .string()
            .required(dictionary.organizations.form.errors.validation.country.required),
        currency_code: yup
            .string()
            .required(dictionary.organizations.form.errors.validation.currency.required),
        vat_registered: yup.boolean(),
        vrn: yup.string().when('vat_registered', {
            is: true,
            then: (schema) =>
            schema.required(dictionary.organizations.form.errors.validation.vrn.required),
            otherwise: (schema) => schema.nullable(),
        }),
        vat_percentage: yup.number().when('vat_registered', {
            is: true,
            then: (schema) =>
            schema
                .positive(dictionary.organizations.form.errors.validation.vatPercentage.min)
                .max(100, dictionary.organizations.form.errors.validation.vatPercentage.max)
                .required(dictionary.organizations.form.errors.validation.vatPercentage.required),
            otherwise: (schema) => schema.positive().optional(),
        }),
        symbol_path: yup.string().nullable(),
        main_color: yup
            .string()
            .matches(
                /^#([0-9A-Fa-f]{3}){1,2}$/i,
                dictionary.organizations.form.errors.validation.colors.invalid
            )
            .default(theme.palette.primary.main),
        light_color: yup
            .string()
            .matches(
                /^#([0-9A-Fa-f]{3}){1,2}$/i,
                dictionary.organizations.form.errors.validation.colors.invalid
            )
            .default('#bec5da'),
        dark_color: yup
            .string()
            .matches(
                /^#([0-9A-Fa-f]{3}){1,2}$/i,
                dictionary.organizations.form.errors.validation.colors.invalid
            )
            .default(theme.palette.primary.dark),
        contrast_text: yup
            .string()
            .matches(
                /^#([0-9A-Fa-f]{3}){1,2}$/i,
                dictionary.organizations.form.errors.validation.colors.invalid
            )
            .default(theme.palette.primary.contrastText),
        tagline: yup
            .string()
            .max(50, dictionary.organizations.form.errors.validation.tagline.max)
            .nullable(),
    });

    const {
        handleSubmit,
        register,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
        id: organization?.id,
        name: organization?.name || '',
        email: organization?.email ?? null,
        phone: organization?.phone || '',
        tin: organization?.tin ?? null,
        recording_start_date: organization?.recording_start_date || '',
        address: organization ? organization.address : null,
        vat_registered: organization?.settings?.vat_registered
            ? organization.settings.vat_registered
            : false,
        vrn: organization?.settings?.vrn ? organization.settings.vrn : null,
        vat_percentage: organization?.settings?.vat_percentage
            ? organization.settings.vat_percentage
            : 18,
        symbol_path: organization?.settings?.symbol_path
            ? organization.settings.symbol_path
            : null,
        main_color: organization?.settings?.main_color
            ? organization.settings.main_color
            : theme.palette.primary.main,
        light_color: organization?.settings?.light_color
            ? organization.settings.light_color
            : '#bec5da',
        dark_color: organization?.settings?.dark_color
            ? organization.settings.dark_color
            : theme.palette.primary.dark,
        contrast_text: organization?.settings?.contrast_text
            ? organization.settings.contrast_text
            : theme.palette.primary.contrastText,
        tagline: organization?.settings?.tagline ? organization.settings.tagline : null,
        country_code: organization?.country_code,
        currency_code: selectedCurrency?.code,
        },
    });

    const addOrganization = useMutation<any, Error, FormValues>({
        mutationFn: organizationServices.create,
        onSuccess: (data) => {
        if (configAuth) {
            configAuth({
            token: data.token,
            currentOrganization: data.newOrganization,
            currentUser: data.authUser,
            });
        }
        router.push(`/${lang}/organizations/profile/${data.newOrganization.organization.id}`);
        enqueueSnackbar(
            dictionary.organizations.form.messages.createSuccess,
            { variant: 'success' }
        );
        },
        onError: (error: any) => {
        if (error?.response?.data?.validation_errors) {
            Object.entries(error.response.data.validation_errors).forEach(
            ([fieldName, messages]) => {
                setError(fieldName as keyof FormValues, {
                type: 'manual',
                message: (messages as string[]).join('<br/>'),
                });
            }
            );
        } else if (error?.response?.data?.message) {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
        },
    });

    const updateOrganization = useMutation<any, Error, FormValues>({
        mutationFn: organizationServices.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['organizationDetails'] });
            enqueueSnackbar(
                dictionary.organizations.form.messages.updateSuccess,
                { variant: 'success' }
            );
            router.push(`/${lang}/organizations`);
        },
        onError: (error: any) => {
            if (error?.response?.data?.validation_errors) {
                Object.entries(error.response.data.validation_errors).forEach(
                ([fieldName, messages]) => {
                    setError(fieldName as keyof FormValues, {
                    type: 'manual',
                    message: (messages as string[]).join('<br/>'),
                    });
                }
                );
            } else if (error?.response?.data?.message) {
                enqueueSnackbar(error.response.data.message, { variant: 'error' });
            }
        },
    });

    const saveMutation = React.useMemo(() => {
        return organization ? updateOrganization.mutate : addOrganization.mutate;
    }, [updateOrganization, addOrganization]);

    useEffect(() => {
        if (organization) {
            const organizationCountry = allCountries.find(
                (country) => country.code === organization.country_code
            );
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
        router.push(`/${lang}/dashboard`);
        }
    }, [authUser, organization]);

    const saveHandler: SubmitHandler<FormValues> = (formData) => {
        saveMutation(formData);
    };

  return (
    <React.Fragment>
      {(addOrganization.isPending || updateOrganization.isPending) && (
        <BackdropSpinner message={dictionary.organizations.form.messages.loading} />
      )}
      <JumboCardQuick
        title={
          <Typography variant={'h4'}>
            <CorporateFareOutlined />{' '}
            {dictionary.organizations.form.labels.basicInfo}
          </Typography>
        }
        action={
          <Span>
            {organization && (
              <Link href={`/${lang}/organizations/profile/${organization.id}`} passHref>
                <IconButton>
                  <Tooltip
                    title={dictionary.organizations.form.buttons.viewProfile}
                    disableInteractive
                  >
                    <InfoRounded />
                  </Tooltip>
                </IconButton>
              </Link>
            )}
            <Link href={`/${lang}/organizations`} passHref>
              <IconButton>
                <Tooltip
                  title={dictionary.organizations.form.buttons.viewList}
                  disableInteractive
                >
                  <ListOutlined />
                </Tooltip>
                </IconButton>
            </Link>
          </Span>
        }
      >
        <form onSubmit={handleSubmit(saveHandler)} autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.name}
                placeholder={dictionary.organizations.form.placeholders.name}
                size="small"
                autoComplete="off"
                error={!!errors?.name}
                helperText={errors?.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.email}
                placeholder={dictionary.organizations.form.placeholders.email}
                size="small"
                autoComplete="off"
                error={!!errors?.email}
                helperText={errors?.email?.message}
                {...register('email')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.phone}
                placeholder={dictionary.organizations.form.placeholders.phone}
                size="small"
                autoComplete="off"
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
                {...register('phone')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.website}
                placeholder={dictionary.organizations.form.placeholders.website}
                size="small"
                error={!!errors?.website}
                helperText={errors?.website?.message}
                {...register('website')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <DatePicker
                label={dictionary.organizations.form.labels.recordingStart}
                defaultValue={
                  organization ? dayjs(organization.recording_start_date) : null
                }
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    error: !!errors?.recording_start_date,
                    helperText:
                      errors?.recording_start_date?.message ||
                      dictionary.organizations.form.helpText.recordingStart,
                  },
                }}
                onChange={(newValue) => {
                  setValue(
                    'recording_start_date',
                    newValue ? newValue.toISOString() : '',
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    }
                  );
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.tin}
                placeholder={dictionary.organizations.form.placeholders.tin}
                size="small"
                autoComplete="off"
                error={!!errors?.tin}
                helperText={
                  errors?.tin?.message || dictionary.organizations.form.helpText.tin
                }
                {...register('tin')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                id="checkbox-countries"
                options={allCountries.sort((a, b) => a.name.localeCompare(b.name))}
                isOptionEqualToValue={(option, value) => option.code === value?.code}
                value={selectedCountry}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={dictionary.organizations.form.labels.country}
                    size="small"
                    autoComplete="off"
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
                  setValue(
                    'currency_code',
                    newValue ? newValue.currency.code : '',
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                  setSelectedCurrency(newValue?.currency || null);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                id="checkbox-currencies"
                options={CURRENCIES.sort((a, b) => a.name.localeCompare(b.name))}
                isOptionEqualToValue={(option, value) => option.code === value?.code}
                getOptionLabel={(option) => `${option.name_plural} (${option.code})`}
                value={selectedCurrency}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={dictionary.organizations.form.labels.currency}
                    size="small"
                    autoComplete="off"
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
            <Grid size={{ xs: 12, lg: 4 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.address}
                placeholder={dictionary.organizations.form.placeholders.address}
                size="small"
                multiline={true}
                minRows={2}
                {...register('address')}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ m: 1, mt: 3 }}>
              <Typography variant="body1">
                {dictionary.organizations.form.labels.vatSection}
              </Typography>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Typography variant="body1">
                {dictionary.organizations.form.labels.vatRegistered}
              </Typography>
              <Checkbox
                checked={!!watch('vat_registered')}
                size="small"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setValue('vat_registered', checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.vrn}
                placeholder={dictionary.organizations.form.placeholders.vrn}
                size="small"
                error={!!errors?.vrn}
                helperText={
                  errors?.vrn?.message || dictionary.organizations.form.helpText.vrn
                }
                {...register('vrn')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label={dictionary.organizations.form.labels.vatPercentage}
                placeholder={dictionary.organizations.form.placeholders.vatPercentage}
                size="small"
                error={!!errors?.vat_percentage}
                helperText={errors?.vat_percentage?.message}
                InputProps={{
                  endAdornment: '%',
                }}
                {...register('vat_percentage')}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ m: 1, mt: 3 }}>
              <Typography variant="body1">
                {dictionary.organizations.form.labels.brandingSection}
              </Typography>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Input type="file" id="logo" error={!!errors?.logo} {...register('logo')} />
              {!errors?.logo ? (
                <InputLabel sx={{ mb: 1 }} id="logo-label" htmlFor={'logo'}>
                  {dictionary.organizations.form.labels.logo}
                </InputLabel>
              ) : (
                <FormHelperText error={!!errors?.logo}>
                  {errors?.logo?.message}
                </FormHelperText>
              )}
              <FormHelperText>
                {dictionary.organizations.form.messages.imageGuide}
              </FormHelperText>
              {organization?.logo_path && (
                <ListItem
                  alignItems="flex-start"
                  sx={{ p: (theme) => theme.spacing(1, 3) }}
                >
                  <ListItemAvatar
                    sx={{ mr: 2, overflow: 'hidden', borderRadius: 2 }}
                  >
                    <img
                      width={'140'}
                      height={'105'}
                      style={{ verticalAlign: 'middle' }}
                      alt={`${organization.name} logo`}
                      src={organization.logo_path}
                    />
                  </ListItemAvatar>
                </ListItem>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Input
                type="file"
                id="organization_symbol"
                error={!!errors?.organization_symbol}
                {...register('organization_symbol')}
              />
              {!errors?.organization_symbol ? (
                <InputLabel
                  sx={{ mb: 1 }}
                  id="symbol-label"
                  htmlFor={'organization_symbol'}
                >
                  {dictionary.organizations.form.labels.symbol}
                </InputLabel>
              ) : (
                <FormHelperText error={!!errors?.organization_symbol}>
                  {errors?.organization_symbol?.message}
                </FormHelperText>
              )}
              <FormHelperText>
                {dictionary.organizations.form.messages.imageGuide}
              </FormHelperText>
              {organization?.settings?.symbol_path && (
                <ListItem
                  alignItems="flex-start"
                  sx={{ p: (theme) => theme.spacing(1, 3) }}
                >
                  <ListItemAvatar
                    sx={{ mr: 2, overflow: 'hidden', borderRadius: 2 }}
                  >
                    <img
                      width={'140'}
                      height={'105'}
                      style={{ verticalAlign: 'middle' }}
                      alt={`${organization.name} symbol`}
                      src={organization.settings.symbol_path}
                    />
                  </ListItemAvatar>
                </ListItem>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Div sx={{ mt: 1, mb: 1 }}>
                    <InputLabel sx={{ mb: 1 }} id="main-color-label" htmlFor={'main_color'}>
                      {dictionary.organizations.form.labels.mainColor}
                    </InputLabel>
                    <Input
                        fullWidth
                        type="color"
                        id="main_color"
                        value={watch('main_color') || theme.palette.primary.main}
                        onChange={(e) => {
                            setValue('main_color', e.target.value, {
                            shouldValidate: true
                            });
                        }}
                        error={!!errors?.main_color}
                    />
                    {errors?.main_color && (
                        <FormHelperText error>
                            {errors.main_color.message}
                        </FormHelperText>
                    )}
                    <FormHelperText>
                         {dictionary.organizations.form.messages.colorGuide}
                    </FormHelperText>
                </Div>
                <Div sx={{ mt: 1, mb: 1 }}>
                    <InputLabel sx={{ mb: 1 }} id="light-color-label" htmlFor={'light_color'}>
                        {dictionary.organizations.form.labels.lightColor}
                    </InputLabel>
                    <Input
                        fullWidth
                        type="color"
                        id="light_color"
                        value={watch('light_color') || '#bec5da'}
                        onChange={(e) => {
                            setValue('light_color', e.target.value, {
                            shouldValidate: true
                            });
                        }}
                        error={!!errors?.light_color}
                    />
                    {errors?.light_color && (
                        <FormHelperText error>
                            {errors.light_color.message}
                        </FormHelperText>
                    )}
                    <FormHelperText>
                       {dictionary.organizations.form.messages.colorGuide}
                    </FormHelperText>
                </Div>
                <Div sx={{ mt: 1, mb: 1 }}>
                    <InputLabel sx={{ mb: 1 }} id="dark-color-label" htmlFor={'dark_color'}>
                        {dictionary.organizations.form.labels.darkColor}
                    </InputLabel>
                    <Input
                        fullWidth
                        type="color"
                        id="dark_color"
                        value={watch('dark_color') || theme.palette.primary.dark}
                        onChange={(e) => {
                            setValue('dark_color', e.target.value, {
                            shouldValidate: true
                            });
                        }}
                        error={!!errors?.dark_color}
                    />
                    {errors?.dark_color && (
                        <FormHelperText error>
                            {errors.dark_color.message}
                        </FormHelperText>
                    )}
                    <FormHelperText>
                        {dictionary.organizations.form.messages.colorGuide}
                    </FormHelperText>
                </Div>
                <Div sx={{ mt: 1, mb: 1 }}>
                    <InputLabel sx={{ mb: 1 }} id="contrast-text-label" htmlFor={'contrast_text'}>
                        {dictionary.organizations.form.labels.contrastText}
                    </InputLabel>
                    <Input
                        fullWidth
                        type="color"
                        id="contrast_text"
                        value={watch('contrast_text') || theme.palette.primary.contrastText}
                        onChange={(e) => {
                            setValue('contrast_text', e.target.value, {
                            shouldValidate: true
                            });
                        }}
                        error={!!errors?.contrast_text}
                    />
                    {errors?.contrast_text && (
                        <FormHelperText error>
                            {errors.contrast_text.message}
                        </FormHelperText>
                    )}
                    <FormHelperText>
                         {dictionary.organizations.form.messages.colorGuide}
                    </FormHelperText>
                </Div>
                <Div sx={{ mt: 3, mb: 1 }}>
                    <TextField
                        fullWidth
                        label={dictionary.organizations.form.labels.tagline}
                        placeholder={dictionary.organizations.form.placeholders.tagline}
                        size="small"
                        error={!!errors?.tagline}
                        helperText={errors?.tagline?.message}
                        {...register('tagline')}
                    />
                </Div>
                </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{ mb: 3, display: 'flex' }}
                  loading={addOrganization.isPending || updateOrganization.isPending}
                >
                  {dictionary.organizations.form.buttons.submit}
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