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
import { Link } from '../NextLink';
import { validationSchema } from './validation';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useLanguage } from '@/app/[lang]/contexts/LanguageContext';

const LoginForm = () => {
  const lang = useLanguage();

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setAuthValues, configAuth, refreshAuth } = useJumboAuth();
  const router = useRouter();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: `/${lang}/dashboard`,
      });
  
      if (response?.error) {
        throw new Error(response.error);
      }
  
      const session = await getSession();

      configAuth({
        token: session.accessToken,
        currentUser: { 
          user: session.user,
          organization_roles: session.organization_roles,
          permissions: session.permissions,
        },
        currentOrganization: { 
          organization: {
            id: session.organization_id,
            name: session.organization_name,
            active_subscriptions: session.active_subscriptions
          },
          permissions: session.auth_permissions,
        },
      });
      
      setAuthValues({
        authUser: { 
          user: session.user,
          organization_roles: session.organization_roles,
          permissions: session.permissions,
        },
        authToken: session.accessToken,
        authOrganization: { 
          organization: {
            id: session.organization_id,
            name: session.organization_name,
            active_subscriptions: session.active_subscriptions
          },
          permissions: session.auth_permissions,
        },
        isAuthenticated: true,
        isLoading: false,
      }, { persist: true });
  
      router.push(`/${lang}/dashboard`);

      refreshAuth();
    } catch (error) {
      enqueueSnackbar(error.message || 'Invalid email or password', { 
        variant: 'error' 
      });
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
        <JumboInput
          fullWidth
          fieldName={'email'}
          label={'Email'}
        />
        <JumboOutlinedInput
          fieldName={'password'}
          label={'Password'}
          type={values.showPassword ? 'text' : 'password'}
          margin='none'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
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
            label={'Remember Me'}
            defaultChecked
          />
          <Typography textAlign={'right'} variant={'body1'}>
            <Link underline='none' href={'/auth/forgot-password'}>
              {'Forgot your password?'}
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
          {loading ? <CircularProgress/> : 'Login'}
        </Button>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };