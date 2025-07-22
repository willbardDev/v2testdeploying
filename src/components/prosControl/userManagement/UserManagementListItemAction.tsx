import { 
  Verified, 
  PersonOff, 
  PersonAdd,
  MoreHorizOutlined,
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
import VerifyUserFormDialog from './VerifyUserFormDialog';
import { User } from './UserManagementType';
import BlockIcon from '@mui/icons-material/Block';
import ReplayIcon from '@mui/icons-material/Replay';


    interface ApiResponse {
      message?: string;
      data?: any;
    }

    const UserManagementListItemAction = ({ user, onUserUpdated }: { user: User, onUserUpdated?: () => void }) => {
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

        
      const menuItems: MenuItemProps[] = [
  ...(user.is_active
    ? [
        {
          icon: <BlockIcon sx={{ color: '#EF5350' }} />, // red
          title: 'DeActivate',
          action: 'deactivate',
        },
      ]
    : [
        {
          icon: <ReplayIcon sx={{ color: '#5E35B1' }} />, // purple
          title: 'Activate',
          action: 'reactivate',
        },
      ]),
];
        const handleItemAction = (menuItem: MenuItemProps) => {
        switch (menuItem.action) {
          case 'deactivate':
            showDialog({
              title: 'Confirm User Deactivation',
              content: 'Are you sure you want to deactivate this user?',
              variant: 'confirm',
              onYes: () => {
                hideDialog();
                deactivateUser(); // assume this is a mutation with loading/snackbar
              },
              onNo: () => hideDialog(),
            });
            break;

          case 'reactivate':
            showDialog({
              title: 'Confirm User Reactivation',
              content: 'Are you sure you want to reactivate this user?',
              variant: 'confirm',
              onYes: () => {
                hideDialog();
                reactivateUser(); // same assumption
              },
              onNo: () => hideDialog(),
            });
            break;

          default:
            console.warn(`Unhandled action: ${menuItem.action}`);
            break;
        }
      };

  return (
    <>
         <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            fullWidth
            maxWidth="sm"
            fullScreen={belowLargeScreen}
          >
            <VerifyUserFormDialog
              open={openEditDialog} // ✅ Only if the inner dialog needs it
              user={user}
              setOpenDialog={setOpenEditDialog}
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