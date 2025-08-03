'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListItemButton from "@mui/material/ListItemButton";
import { ListItemIcon, ListItemText } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from '@/hooks/useTranslation';
import { SIDEBAR_VIEWS } from '@jumbo/utilities/constants';
import { deviceType } from '@/utilities/helpers/user-agent-helpers';
import { useJumboLayout } from '../JumboLayout/hooks';

const menuBefore = {
  left: 0,
  top: 0,
  content: `''`,
  position: 'absolute',
  display: 'inline-block',
  width: '4px',
  height: '100%',
  backgroundColor: 'transparent',
};

const JumboNavItem = ({ item, isNested, translate }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { sidebarOptions, setSidebarOptions } = useJumboLayout();
  const isMobile = deviceType() === 'mobile';

  const isMiniAndClosed = React.useMemo(() => {
    return sidebarOptions?.view === SIDEBAR_VIEWS.MINI && !sidebarOptions?.open;
  }, [sidebarOptions.view, sidebarOptions.open]);

  const label = React.useMemo(() => {
    return translate ? t(item.label) : item.label;
  }, [item, translate, t]);

  if (!item) return null;

  return (
    <ListItemButton
      component={"li"}
      sx={{
        p: 0,
        overflow: 'hidden',
        borderRadius: isMiniAndClosed ? '50%' : '0 24px 24px 0',
        margin: isMiniAndClosed ? '0 auto' : '0',
        ...(isMiniAndClosed ? { width: 40, height: 40, justifyContent: 'center' } : {}),
        ...(!isMiniAndClosed ? { '&::before': menuBefore } : {}),
        '&:hover': {
            color: theme => theme.jumboComponents.JumboNavbar.nav.action?.hover,
            backgroundColor: theme => theme.jumboComponents.JumboNavbar.nav.background.hover,
          ...(!isMiniAndClosed ? {
            '&::before': {
              ...menuBefore,
              backgroundColor: theme => theme.jumboComponents.JumboNavbar.nav.tick.hover,
            }
          } : {})
        },
        ...(pathname === item.uri ? {
          color: theme => theme.jumboComponents.JumboNavbar.nav.action?.active,
          backgroundColor: theme => theme.jumboComponents.JumboNavbar.nav.background.active,
          ...(!isMiniAndClosed ? {
            '&::before': {
              ...menuBefore,
              backgroundColor: theme => theme.jumboComponents.JumboNavbar.nav.tick.active,
            }
          } : {})
        } : {}),
      }}
    >
      <Link
        href={item.uri}
        onClick={() => setSidebarOptions({ open: !isMobile })}
        target={item.target}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          color: 'inherit',
          padding: isMiniAndClosed ? 0 : '8px 30px',
          textDecoration: 'none',
          justifyContent: isMiniAndClosed ? 'center' : 'flex-start',
        }}
      >
        <ListItemIcon sx={{ minWidth: isMiniAndClosed ? 20 : 32, color: 'inherit' }}>
          {isNested ? (
            <CircleIcon sx={{ fontSize: 6, ml: 1 }} />
          ) : (
            item.icon
          )}
        </ListItemIcon>
        {!isMiniAndClosed && (
          <ListItemText
            primary={label}
            sx={{
              m: 0,
              '& .MuiTypography-root': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            }}
          />
        )}
      </Link>
    </ListItemButton>
  );
};

export default JumboNavItem;
