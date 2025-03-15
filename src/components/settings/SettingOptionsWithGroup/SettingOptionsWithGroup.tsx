'use client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { settingOptions } from '../data';

const SettingOptionsWithGroup = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [title, setTitle] = React.useState('Public Profile');

  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const route = pathname.split('/');
  const path = route[route.length - 1];
  const open = Boolean(anchorEl);
  const id = open ? 'setting-popover' : undefined;
  React.useEffect(() => {
    settingOptions.forEach((group) => {
      group.data.forEach((item) => {
        if (pathname.includes(item.slug)) {
          setTitle(item.name);
        }
      });
    });
  }, [pathname]);
  return (
    <>
      <Typography variant='h3' mb={0}>
        {title}
        <IconButton onClick={handleClick} sx={{ ml: 1 }}>
          <ExpandMoreIcon />
        </IconButton>
      </Typography>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ maxHeight: '60vh' }}
      >
        <List disablePadding sx={{ width: 300 }}>
          {settingOptions.map((group, index) => (
            <React.Fragment key={index}>
              <ListSubheader sx={{ fontSize: 16 }}>{group.label}</ListSubheader>
              {group.data.map((item) => (
                <ListItem
                  key={item.slug}
                  onClick={() => router.push(`/user/settings/${item.slug}`)}
                  disablePadding
                >
                  <ListItemButton selected={item.slug === path}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </>
  );
};

export { SettingOptionsWithGroup };
