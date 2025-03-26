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

const LoginForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const router = useRouter();
  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      accessToken: 'ksdjfweirjsljLKDJfksdjfew',
    });

    if (response?.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      enqueueSnackbar('invalid email or password!', {
        variant: 'error',
      });
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
          //defaultValue='demo@example.com'
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
          //defaultValue={'zab#723'}
        />

        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <JumboCheckbox
            fieldName='rememberMe'
            label={'Remeber Me'}
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
          loading={loading}
        >
          {'Login'}
        </Button>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
