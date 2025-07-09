import { Link } from '@jumbo/shared';
import { NavbarItem } from '@jumbo/types';
import CircleIcon from '@mui/icons-material/Circle';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Theme,
} from '@mui/material';
import { useJumboNavItemSx, useJumboNavbar } from '../../hooks';
import { Icon } from '@jumbo/components/Icon';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackdropSpinner } from '@/shared/ProgressIndicators/BackdropSpinner';

type JumboNavItemProps = {
  item: NavbarItem | undefined;
  isNested: boolean;
};

function JumboNavItem({ item, isNested }: JumboNavItemProps) {
  const navSx: SxProps<Theme> = useJumboNavItemSx(item?.path ?? '');
  const { miniAndClosed } = useJumboNavbar();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!item) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (item?.path && item.path !== pathname) {
      e.preventDefault();
      setIsLoading(true);
      router.push(item.path);
    }
  };

  // Reset loading state when route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      <ListItemButton 
        component={'li'} 
        sx={{ 
          ...navSx,
          position: 'relative',
          '&.Mui-disabled': {
            opacity: 0.7,
          }
        }}
        onClick={handleClick}
        disabled={isLoading}
      >
        <Link
          underline={'none'}
          href={item.path}
          {...(item.target ? { target: item.target } : {})}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            color: 'inherit',
            p: (theme: Theme) =>
              !miniAndClosed
                ? theme.spacing(1, 3.75)
                : 0,
            ...(miniAndClosed ? { justifyContent: 'center' } : {}),
          }}
          aria-disabled={isLoading}
        >
          <ListItemIcon
            sx={{ 
              minWidth: miniAndClosed ? 20 : 32, 
              color: 'inherit',
              ...(isLoading && {
                color: (theme) => theme.palette.action.disabled,
              }),
            }}
          >
            {isNested ? (
              <CircleIcon sx={{ fontSize: 6, ml: 1 }} />
            ) : (
              <Icon name={item.icon} sx={{ fontSize: 20 }} />
            )}
          </ListItemIcon>
          {!miniAndClosed && (
            <ListItemText
              primary={item.label}
              sx={{
                m: 0,
                '& .MuiTypography-root': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  ...(isLoading && {
                    color: (theme) => theme.palette.text.disabled,
                  }),
                },
              }}
            />
          )}
        </Link>
      </ListItemButton>
      {isLoading && <BackdropSpinner message="Wait" isRouterTransfer={true}/>}
    </>
  );
}

export { JumboNavItem };