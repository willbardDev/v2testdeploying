'use client';

import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from '@jumbo/vendors/react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, CircularProgress, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';
import * as yup from 'yup';
import { Link } from '../NextLink';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useLanguage } from '@/app/[lang]/contexts/LanguageContext';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';
import organizationServices from '../Organizations/organizationServices';

const LoginForm = () => {
  const lang = useLanguage();
  const dictionary = useDictionary();

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setAuthValues, configAuth } = useJumboAuth();
  const router = useRouter();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const validationSchema = yup.object().shape({
    email: yup.string()
      .email(dictionary.signin.form.errors.email.invalid)
      .required(dictionary.signin.form.errors.email.required),
    password: yup.string().required(dictionary.signin.form.errors.password.required),
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const signInResponse = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: `/${lang}/dashboard`,
      });

      if (signInResponse?.error) {
        throw new Error(signInResponse.error);
      }

      const session = await getSession();

      if (!session?.organization_id) {
        // No organization_id: set auth user but skip organization loading
        configAuth({
          currentUser: {
            user: session.user,
            permissions: session.permissions,
          },
          currentOrganization: {
            permissions: session.auth_permissions,
          },
        });

        setAuthValues({
          authUser: {
            user: session.user,
            permissions: session.permissions,
          },
          authOrganization: {
            permissions: session.auth_permissions,
          },
          isAuthenticated: true,
          isLoading: false,
        }, { persist: true });

        router.push(`/${lang}/organizations`);
      } else {
        // organization_id exists: load full organization context
        const orgResponse = await organizationServices.loadOrganization({
          organization_id: session.organization_id,
        });

        configAuth({
          currentUser: orgResponse?.data?.authUser,
          currentOrganization: orgResponse?.data?.authOrganization,
        });

        setAuthValues({
          authUser: orgResponse?.data?.authUser,
          authOrganization: orgResponse?.data?.authOrganization,
          isAuthenticated: true,
          isLoading: false,
        }, { persist: true });

        router.push(`/${lang}/dashboard`);
      }

    } catch (error) {
      enqueueSnackbar(
        dictionary.signin.form.messages.loginError,
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={() => {}}
    >
      <Stack spacing={3} mb={3}>
        <Typography variant="h4" mb={2}>
          {dictionary.signin.form.title}
        </Typography>
        <JumboInput
          fullWidth
          fieldName={'email'}
          label={dictionary.signin.form.fields.email.label}
          placeholder={dictionary.signin.form.fields.email.placeholder}
        />
        <JumboOutlinedInput
          fieldName={'password'}
          label={dictionary.signin.form.fields.password.label}
          placeholder={dictionary.signin.form.fields.password.placeholder}
          type={values.showPassword ? 'text' : 'password'}
          margin='none'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label={values.showPassword ? 'Hide password' : 'Show password'}
                onClick={handleClickShowPassword}
                edge='end'
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />

        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <JumboCheckbox
            fieldName='rememberMe'
            label={dictionary.signin.form.fields.rememberMe}
            defaultChecked
          />
          <Typography textAlign={'right'} variant={'body1'}>
            <Link underline='none' href={`/${lang}/auth/forgot-password`}>
              {dictionary.signin.forgotPassword.text}
            </Link>
          </Typography>
        </Stack>
        <Button
          fullWidth
          type='submit'
          variant='contained'
          size='large'
          disabled={loading}
        >
          {loading ? <CircularProgress size={24}/> : dictionary.signin.form.submit}
        </Button>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };