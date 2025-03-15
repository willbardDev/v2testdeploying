'use client';
import { Link } from '@/components/NextLink';
import { SignupForm } from '@/components/SignupForm';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import { Facebook, Google, Twitter } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  alpha,
  Card,
  CardContent,
  CardMedia,
  Fab,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';

export function Signup1() {
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
        <Link underline='none' href='#' sx={{ display: 'inline-flex' }}>
          <Image
            height={35}
            width={110}
            src={`${ASSET_IMAGES}/logo.png`}
            alt='Jumbo React'
          />
        </Link>
      </Div>
      <Card sx={{ maxWidth: '100%', width: 360, mb: 4 }}>
        <Div sx={{ position: 'relative', height: '200px' }}>
          <CardMedia
            component='img'
            alt='green iguana'
            height='200'
            image={getAssetPath(`${ASSET_IMAGES}/colin-watts.jpg`, '640x428')}
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
              sx={{ color: 'common.white', fontSize: '1.5rem', mb: 0 }}
            >
              Sign up
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Fab
            color='secondary'
            aria-label='add'
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              transform: 'translateY(-50%)',
            }}
          >
            <AddIcon />
          </Fab>
          {/* go to signup form */}
          <SignupForm />
          <Typography textAlign={'center'} variant={'body1'} mb={1}>
            Have an account?{' '}
            <Link underline='none' href={'/auth/login-1'}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <Typography variant={'body1'} mb={2}>
        Or sign up with
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
          aria-label='Twitter'
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
          aria-label='Twitter'
        >
          <Google fontSize='small' />
        </IconButton>
      </Stack>
    </Div>
  );
}
