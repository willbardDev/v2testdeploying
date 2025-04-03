import { getDictionary } from '@/app/[lang]/dictionaries';
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
} from '@mui/material';
import { signOut } from 'next-auth/react';
import React from 'react';

interface AuthUserPopoverProps {
  session: any;
  lang: string;
  dictionary: {
    commons: {
      switchOrganization: string;
      logout: string;
    };
  };
}

const AuthUserPopover = ({ session, lang, dictionary }: AuthUserPopoverProps) => {
  const { theme } = useJumboTheme();

  const logout = React.useCallback(() => {
    (async () => {
      await signOut({
        callbackUrl: 'http://localhost:3000/en-US/auth/login-1',
      });
    })();
  }, []);

  const user = session?.user;

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={''}
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

export { AuthUserPopover };
