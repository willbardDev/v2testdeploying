'use client';
import React from 'react';
import { JumboDdPopover } from '@jumbo/components';
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
  CircularProgress
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

export const AuthUserPopover = ({ dictionary }) => {
  const { theme } = useJumboTheme();
  const authContext = useJumboAuth();

  if (!authContext) {
    console.error('Auth context not available');
    return null;
  }

  const { setAuthValues, authData, authOrganization } = authContext;

  const logout = React.useCallback(() => {
    (async () => {
      await signOut({
        callbackUrl: 'http://localhost:3000/en-US/auth/signin',
      });
      setAuthValues({ authToken: null, authUser: null, authOrganization: null });
    })();
  }, [setAuthValues]);

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
          <Typography noWrap variant={'h5'}>{user.name}</Typography>
          <Typography noWrap variant={'body1'} color='text.secondary'>
            {user.email}
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Chip 
              label={organization.name} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Stack>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton>
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