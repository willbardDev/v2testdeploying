import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Verified, PersonOff, PersonAdd } from '@mui/icons-material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { DeactivateUserResponse, ReactivateUserResponse, UserManager, VerifyUserResponse } from './UserManagementType'; // Adjust path if needed
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

const { mutate: verifyUser } = useMutation<VerifyUserResponse>({
  mutationFn: () => userManagementServices.verify(user.email),
  onSuccess: (res) => {
    enqueueSnackbar(res.message || 'User verified successfully', { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onError: (error: any) => {
    enqueueSnackbar(error?.response?.data?.message || 'Verify failed', { variant: 'error' });
  },
});


 const { mutate: deactivateUser } = useMutation<DeactivateUserResponse>({
  mutationFn: () => userManagementServices.deactivate(user.id),
  onSuccess: (res) => {
    enqueueSnackbar(res.message || 'User deactivated', { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onError: (error: any) => {
    enqueueSnackbar(error?.response?.data?.message || 'Deactivation failed', { variant: 'error' });
  },
});


 const { mutate: reactivateUser } = useMutation<ReactivateUserResponse>({
  mutationFn: () => userManagementServices.reactivate(user.id),
  onSuccess: (res) => {
    enqueueSnackbar(res.message || 'User reactivated', { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onError: (error: any) => {
    enqueueSnackbar(error?.response?.data?.message || 'Reactivation failed', { variant: 'error' });
  },
});

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {!user.is_verified && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              verifyUser();
            }}
          >
            <ListItemIcon>
              <Verified fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Verify Email" />
          </MenuItem>
        )}

        {user.is_active ? (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              deactivateUser();
            }}
          >
            <ListItemIcon>
              <PersonOff fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Deactivate User" />
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              reactivateUser();
            }}
          >
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Reactivate User" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
