'use client';

import { LoginForm } from '@/components/LoginForm';
import { Link } from '@/components/NextLink';
import { ASSET_AVATARS, ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import { Facebook, Google, Twitter } from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import Image from 'next/image';

export const Signin1 = () => {
  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: 'inline-flex' }}>
        <Image
          height={35}
          width={110}
          src={`${ASSET_IMAGES}/logos/logo.png`}
          alt='Jumbo React'
        />
      </Div>
      <Card sx={{ maxWidth: '100%', width: 360, mb: 4 }}>
        <Div sx={{ position: 'relative', height: '200px' }}>
          <CardMedia
            component='img'
            alt='green iguana'
            height='200'
            image={`${ASSET_IMAGES}/colin-watts.jpg`}
          />
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={'h2'}
              sx={{
                color: 'common.white',
                fontSize: '1.5rem',
                mb: 0,
              }}
            >
              {'Sign In'}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Avatar
            alt='Remy Sharp'
            src={getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`)}
            sx={{
              width: 56,
              height: 56,
              marginLeft: 'auto',
              boxShadow: shadows[3],
              transform: 'translateY(-50%)',
            }}
          />
          <LoginForm />
          <Typography textAlign={'center'} variant={'body1'} mb={1}>
            {`Don't have an account?`}{' '}
            <Link underline='none' href={'/auth/signup-1'}>
              {'Sign up now'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <Typography variant={'body1'} mb={2}>
        {'Or sign up with'}
      </Typography>
      <Stack direction='row' alignItems='center' spacing={1}>
        <IconButton
          sx={{
            bgcolor: '#385196',
            color: 'common.white',
            p: (theme) => theme.spacing(1.25),

            '&:hover': {
              backgroundColor: '#385196',
            },
          }}
          aria-label='Facebook'
        >
          <Facebook fontSize={'small'} />
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
          aria-label='Twitter'
        >
          <Twitter fontSize={'small'} />
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
          aria-label='Twitter'
        >
          <Google fontSize='small' />
        </IconButton>
      </Stack>
    </Div>
  );
};
