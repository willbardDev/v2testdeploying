import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  MoreVert, 
  Verified, 
  PersonOff, 
  PersonAdd,
  MailOutline 
} from '@mui/icons-material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { 
  DeactivateUserResponse, 
  ReactivateUserResponse, 
  UserManager, 
  VerifyUserResponse 
} from './UserManagementType';
import userManagementServices from './user-management-services';

type Props = {
  user: UserManager;
};

export default function UserManagementListItemActions({ user }: Props) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const { mutate: verifyUser, isPending: isVerifying } = useMutation<VerifyUserResponse>({
    mutationFn: () => userManagementServices.verify(user.email),
    onSuccess: (res) => {
      enqueueSnackbar(res.message || 'User verified successfully', { 
        variant: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Verification failed', 
        { variant: 'error' }
      );
    },
  });

  const { mutate: deactivateUser, isPending: isDeactivating } = useMutation<DeactivateUserResponse>({
    mutationFn: () => userManagementServices.deactivate(user.id),
    onSuccess: (res) => {
      enqueueSnackbar(res.message || 'User deactivated successfully', { 
        variant: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Deactivation failed', 
        { variant: 'error' }
      );
    },
  });

  const { mutate: reactivateUser, isPending: isReactivating } = useMutation<ReactivateUserResponse>({
    mutationFn: () => userManagementServices.reactivate(user.id),
    onSuccess: (res) => {
      enqueueSnackbar(res.message || 'User reactivated successfully', { 
        variant: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Reactivation failed', 
        { variant: 'error' }
      );
    },
  });

  const handleAction = (action: () => void) => {
    handleCloseMenu();
    action();
  };

  return (
    <>
      <IconButton 
        onClick={handleOpenMenu}
        aria-label="user actions"
        aria-controls={open ? 'user-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVert />
      </IconButton>
      
      <Menu 
        id="user-actions-menu"
        anchorEl={anchorEl} 
        open={open} 
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {!user.is_verified && (
          <MenuItem
            onClick={() => handleAction(() => verifyUser())}
            disabled={isVerifying}
          >
            <ListItemIcon>
              {isVerifying ? (
                <CircularProgress size={20} />
              ) : (
                <Verified fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={isVerifying ? 'Verifying...' : 'Verify Email'} 
            />
          </MenuItem>
        )}

        {user.is_active ? (
          <MenuItem
            onClick={() => handleAction(() => deactivateUser())}
            disabled={isDeactivating}
          >
            <ListItemIcon>
              {isDeactivating ? (
                <CircularProgress size={20} />
              ) : (
                <PersonOff fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={isDeactivating ? 'Deactivating...' : 'Deactivate User'} 
            />
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => handleAction(() => reactivateUser())}
            disabled={isReactivating}
          >
            <ListItemIcon>
              {isReactivating ? (
                <CircularProgress size={20} />
              ) : (
                <PersonAdd fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={isReactivating ? 'Reactivating...' : 'Reactivate User'} 
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}