import React from 'react';
import {
  Card,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { UserManager } from './UserManagementType';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import userManagementServices from './user-management-services';

type Props = {
  user: UserManager;
};

const UserManagementListItem: React.FC<Props> = ({ user }) => {
  const queryClient = useQueryClient();
  const { checkOrganizationPermission } = useJumboAuth();
  const canManage = checkOrganizationPermission([PERMISSIONS.USERS_MANAGE]);

  const { mutate: verifyUser } = useMutation({
    mutationFn: () => userManagementServices.verify(user.email),
    onSuccess: () => {
      enqueueSnackbar('User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Verification failed', { variant: 'error' });
    },
  });

  const { mutate: deactivateUser } = useMutation({
    mutationFn: () => userManagementServices.deactivate(user.id),
    onSuccess: () => {
      enqueueSnackbar('User deactivated', { variant: 'warning' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to deactivate user', { variant: 'error' });
    },
  });

  const { mutate: reactivateUser } = useMutation({
    mutationFn: () => userManagementServices.reactivate(user.id),
    onSuccess: () => {
      enqueueSnackbar('User reactivated', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to reactivate user', { variant: 'error' });
    },
  });

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="subtitle1">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>

          <Stack direction="row" spacing={1} mt={1}>
            <Chip
              size="small"
              label={user.is_verified ? 'Verified' : 'Not Verified'}
              color={user.is_verified ? 'success' : 'default'}
              icon={user.is_verified ? <VerifiedIcon /> : undefined}
            />
            <Chip
              size="small"
              label={user.is_active ? 'Active' : 'Inactive'}
              color={user.is_active ? 'primary' : 'warning'}
            />
          </Stack>
        </Stack>

        {canManage && (
          <Stack direction="row" spacing={1}>
            {!user.is_verified && (
              <Tooltip title="Verify User">
                <IconButton color="primary" onClick={() => verifyUser()}>
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}

            {user.is_active ? (
              <Tooltip title="Deactivate User">
                <IconButton color="warning" onClick={() => deactivateUser()}>
                  <BlockIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Reactivate User">
                <IconButton color="success" onClick={() => reactivateUser()}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default UserManagementListItem;
