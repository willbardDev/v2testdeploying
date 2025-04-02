import { JumboDdPopover } from '@jumbo/components';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div } from '@jumbo/shared';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
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
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react'; // Import useSession from next-auth/react
import React from 'react';

const AuthUserPopover = ({session}:any) => {
  const { theme } = useJumboTheme();

  const logout = React.useCallback(() => {
    (async () => {
      await signOut({
        callbackUrl: 'http://localhost:3000/en-US/auth/login-1',
      });
    })();
  }, []);

  // Ensure that session.user is not undefined
  const user = session?.user;

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={''} // Assuming the user object has a profile_pic field
            sizes={'small'}
            sx={{ boxShadow: 23, cursor: 'pointer' }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            p: theme => theme.spacing(2.5),
          }}
        >
          <Avatar
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography noWrap={true} variant={'h5'}>{user?.name}</Typography>
          <Typography noWrap={true} variant={'body1'} color='text.secondary'>
            {user?.email}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RepeatOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                // onClick={() => navigate('/samples/content-layout')}
                primary='Switch Organization'
                sx={{ my: 0 }}
              />
            </ListItemButton>
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary='Logout' sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
