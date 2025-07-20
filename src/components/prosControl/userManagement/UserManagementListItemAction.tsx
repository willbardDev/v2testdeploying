import { 
  Verified, 
  PersonOff, 
  PersonAdd,
  MoreHorizOutlined,
  DeleteOutlined,
  EditOutlined
} from '@mui/icons-material';
import { Dialog, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItemProps } from '@jumbo/types';
import { JumboDdMenu } from '@jumbo/components';
import userManagementServices from './user-management-services';
import { UserManager } from './UserManagementType';
import VerifyUserFormDialog from './VerifyUserFormDialog';

interface ApiResponse {
  message?: string;
  data?: any;
}

const UserManagementListItemAction = ({ user, onUserUpdated }: { user: UserManager, onUserUpdated?: () => void }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showDialog, hideDialog } = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleApiError = (error: any, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        defaultMessage;
    enqueueSnackbar(errorMessage, { variant: 'error' });
  };

  // User status mutations
  const { mutate: verifyUser } = useMutation<ApiResponse, unknown, void>({
    mutationFn: () => userManagementServices.verify({ email: user.email }),
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserUpdated?.();
    },
    onError: (error) => {
      handleApiError(error, 'Verification failed');
    },
  });

  const { mutate: deactivateUser } = useMutation<ApiResponse, unknown, void>({
    mutationFn: () => userManagementServices.deactivate(user.id),
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User deactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserUpdated?.();
    },
    onError: (error) => {
      handleApiError(error, 'Deactivation failed');
    },
  });

  const { mutate: reactivateUser } = useMutation<ApiResponse, unknown, void>({
    mutationFn: () => userManagementServices.reactivate(user.id),
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User reactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserUpdated?.();
    },
    onError: (error) => {
      handleApiError(error, 'Reactivation failed');
    },
  });

  const { mutate: deleteUser } = useMutation<ApiResponse, unknown, void>({
    mutationFn: () => userManagementServices.delete(user.id),
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User deleted successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserUpdated?.();
    },
    onError: (error) => {
      handleApiError(error, 'Deletion failed');
    },
  });

  const menuItems: MenuItemProps[] = [
    { icon: <EditOutlined />, title: 'Edit', action: 'edit' },
    ...(!user.is_verified ? [{ 
      icon: <Verified />, 
      title: 'Verify', 
      action: 'verify' 
    }] : []),
    ...(user.is_active ? [{
      icon: <PersonOff color="warning" />,
      title: 'Deactivate',
      action: 'deactivate'
    }] : [{
      icon: <PersonAdd color="success" />,
      title: 'Reactivate',
      action: 'reactivate'
    }]),
    { 
      icon: <DeleteOutlined color="error" />, 
      title: 'Delete', 
      action: 'delete' 
    },
  ];

  const handleItemAction = (menuItem: MenuItemProps) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'verify':
        verifyUser();
        break;
      case 'deactivate':
        showDialog({
          title: 'Confirm User Deactivation',
          content: 'Are you sure you want to deactivate this user?',
          onYes: () => {
            hideDialog();
            deactivateUser();
          },
          onNo: () => hideDialog(),
          variant: 'confirm',
        });
        break;
      case 'reactivate':
        reactivateUser();
        break;
      case 'delete':
        showDialog({
          title: 'Confirm User Deletion',
          content: 'Are you sure you want to permanently delete this user?',
          onYes: () => {
            hideDialog();
            deleteUser();
          },
          onNo: () => hideDialog(),
          variant: 'confirm',
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog
        open={openEditDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={belowLargeScreen}
      >
        <VerifyUserFormDialog
          user={user}
          setOpenDialog={setOpenEditDialog}
          onUserUpdated={onUserUpdated}
        />
      </Dialog>
      <JumboDdMenu
        icon={
          <Tooltip title="User Actions">
            <MoreHorizOutlined fontSize="small" />
          </Tooltip>
        }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </>
  );
};

export default UserManagementListItemAction;