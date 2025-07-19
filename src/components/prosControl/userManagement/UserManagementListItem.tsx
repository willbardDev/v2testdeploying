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
import UserManagementListItemActions from './UserManagementListItemAction';

type Props = {
  user: UserManager;
};

const UserManagementListItem: React.FC<Props> = ({ user }) => {
  const queryClient = useQueryClient();
  const { checkOrganizationPermission } = useJumboAuth();
  const canManage = checkOrganizationPermission([PERMISSIONS.USERS_MANAGE]);


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

        {canManage && <UserManagementListItemActions user={user} />}
      </Stack>
    </Card>

  );
};

export default UserManagementListItem;
