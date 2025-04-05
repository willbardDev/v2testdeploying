'use client';
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from '@jumbo/vendors/react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Link } from '../NextLink';
import { validationSchema } from './validation';
import axios from '@/lib/config';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

const LoginForm = () => {
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { setAuthValues } = useJumboAuth();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      // 1. Get CSRF token
      await axios.get('/sanctum/csrf-cookie');
      
      // 2. Perform login
      const loginResponse = await axios.post('/login', {
        email: data.email,
        password: data.password,
      });

      // 3. Prepare auth data
      const authData = {
        authToken: loginResponse.data.token, // Changed from token to authToken
        authUser: loginResponse.data.authUser,
        authOrganization: loginResponse.data.authOrganization,
        isAuthenticated: true,
        isLoading: false,
      };

      // 4. Store auth data using setAuthValues
      setAuthValues(authData);

      // 5. Sign in with NextAuth
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      // 6. Redirect to dashboard
      router.push('/dashboard');
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
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };