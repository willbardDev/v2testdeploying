'use client';

import React from 'react';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div } from '@jumbo/shared';
import LogoutIcon from '@mui/icons-material/Logout';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { signOut } from 'next-auth/react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/app/[lang]/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

const JumboDdPopover = dynamic(() =>
  import('@jumbo/components').then((mod) => mod.JumboDdPopover),
  { ssr: false }
);

export const AuthUserPopover = ({ dictionary }) => {
  const router = useRouter();
  const lang = useLanguage();
  const { theme } = useJumboTheme();
  const authContext = useJumboAuth();

  if (!authContext) {
    console.error('Auth context not available');
    return null;
  }

  const { setAuthValues, authData, authOrganization, resetAuth } = authContext;

  const logout = React.useCallback(() => {
    (async () => {
      await signOut({
        callbackUrl: `http://localhost:3000/${lang}/auth/signin`,
      });
      resetAuth();
    })();
  }, [setAuthValues, lang]);

  const switchOrganization = React.useCallback(() => {
    router.push(`/${lang}/organizations`);
  }, [router, lang]);

  const user = authData?.authUser?.user;
  const organization = authOrganization?.organization;

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={user.avatar}
            sizes={'small'}
            sx={{ boxShadow: 23, cursor: 'pointer' }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme => theme.spacing(2.5),
        }}>
          <Avatar src={user.avatar} sx={{ width: 60, height: 60, mb: 2 }} />
          <Typography noWrap variant={'h5'}>{user?.name}</Typography>
          <Typography noWrap variant={'body1'} color='text.secondary'>
            {user.email}
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Chip 
              label={organization?.name} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Stack>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton onClick={switchOrganization}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RepeatOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={dictionary.commons.switchOrganization}
                sx={{ my: 0 }}
              />
            </ListItemButton>
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={dictionary.commons.logout} sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};