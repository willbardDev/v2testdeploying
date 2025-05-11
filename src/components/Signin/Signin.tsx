'use client';

import { LoginForm } from '@/components/LoginForm';
import { Link } from '@/components/NextLink';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import { Facebook, Google, Twitter } from '@mui/icons-material';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  alpha,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import React from 'react';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';
import { useLanguage } from '@/app/[lang]/contexts/LanguageContext';

export const Signin = () => {
  const dictionary = useDictionary();
  const lang = useLanguage();

  return (
    <Div
      sx={{
        width: 720,
        maxWidth: '100%',
        margin: 'auto',
        p: 4,
      }}
    >
      <Card
        sx={{
          display: 'flex',
          minWidth: 0,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <CardContent
          sx={{
            flex: '0 1 300px',
            position: 'relative',
            background: `#0267a0 url(${getAssetPath(
              `${ASSET_IMAGES}/widgets/keith-luke.jpg`,
              '640x428'
            )}) no-repeat center`,
            backgroundSize: 'cover',
            '&::after': {
              display: 'inline-block',
              position: 'absolute',
              content: `''`,
              inset: 0,
              backgroundColor: alpha('#0267a0', 0.65),
            },
          }}
        >
          <Div
            sx={{
              display: 'flex',
              minWidth: 0,
              flex: 1,
              flexDirection: 'column',
              color: 'common.white',
              position: 'relative',
              zIndex: 1,
              height: '100%',
            }}
          >
            <Div sx={{ mb: 2 }}>
              <Typography
                variant={'h3'}
                color={'inherit'}
                fontWeight={500}
                mb={3}
              >
                {dictionary.signin.header}
              </Typography>
              <Typography variant={'body1'}>
                <Link
                  underline='none'
                  href={`/${lang}/auth/forgot-password`}
                  color={'inherit'}
                >
                  {dictionary.signin.forgotPassword.text}
                </Link>
              </Typography>
            </Div>

            <Div sx={{ mt: 'auto' }}>
              <Link underline='none' href='#' sx={{ display: 'inline-flex' }}>
                <Image
                  height={35}
                  width={110}
                  src={`${ASSET_IMAGES}/logos/proserp-white.png`}
                  alt='ProsERP'
                />
              </Link>
            </Div>
          </Div>
        </CardContent>
        <CardContent sx={{ flex: 1, p: 4 }}>
          <LoginForm />
          <React.Fragment>
            <Typography variant={'body1'} mb={2}>
              {dictionary.signin.accountPrompt.text}{' '}
              <Link underline='none' href={`/${lang}/auth/signup`}>
                {dictionary.signin.accountPrompt.action}
              </Link>
            </Typography>
            <Typography variant={'body2'} mb={2}>
              {dictionary.signin.socialLogin.prefix}
            </Typography>
            <Stack direction='row' alignItems='center' spacing={1} mb={1}>
              <IconButton
                sx={{
                  bgcolor: '#385196',
                  color: 'common.white',
                  p: (theme) => theme.spacing(1.25),
                  '&:hover': {
                    backgroundColor: '#385196',
                  },
                }}
                aria-label={`${dictionary.signin.socialLogin.prefix} ${dictionary.signin.socialLogin.options.facebook}`}
              >
                <Facebook fontSize='small' />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#00a8ff',
                  color: 'common.white',
                  p: (theme) => theme.spacing(1.25),
                  '&:hover': {
                    backgroundColor: '#00a8ff',
                  },
                }}
                aria-label={`${dictionary.signin.socialLogin.prefix} ${dictionary.signin.socialLogin.options.twitter}`}
              >
                <Twitter fontSize='small' />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#23272b',
                  color: 'common.white',
                  p: (theme) => theme.spacing(1.25),
                  '&:hover': {
                    backgroundColor: '#23272b',
                  },
                }}
                aria-label={`${dictionary.signin.socialLogin.prefix} ${dictionary.signin.socialLogin.options.google}`}
              >
                <Google fontSize='small' />
              </IconButton>
            </Stack>
          </React.Fragment>
        </CardContent>
      </Card>
    </Div>
  );
};