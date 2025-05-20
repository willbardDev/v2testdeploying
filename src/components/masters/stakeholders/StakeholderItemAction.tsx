import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import stakeholderServices from './stakeholder-services';
import StakeholderDialogForm from './StakeholderDialogForm';
import { LoadingButton } from '@mui/lab';
import { MenuItemProps } from '@jumbo/types';
import { Stakeholder } from './StakeholderType';
import { JumboDdMenu } from '@jumbo/components';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface StakeholderItemActionProps {
  stakeholder: Stakeholder;
}

interface DeleteResponse {
  message: string;
}

const StakeholderItemAction: React.FC<StakeholderItemActionProps> = ({ stakeholder }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Screen handling constants
  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const queryClient = useQueryClient();

  const { mutate: deleteStakeholder, isPending } = useMutation<DeleteResponse, Error, number>({
    mutationFn: (id: number) => stakeholderServices.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stakeholders'] });
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete stakeholder', {
        variant: 'error',
      });
      queryClient.invalidateQueries({ queryKey: ['stakeholders'] });
    },
  });

  const menuItems: MenuItemProps[] = [
    { icon: <EditOutlined />, title: 'Edit', action: 'edit' },
    { icon: <DeleteOutlined color='error' />, title: 'Delete', action: 'delete' }
  ];

  const handleItemAction = (menuItem: MenuItemProps) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        setOpenDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Dialog for Edit */}
      <Dialog
        open={openEditDialog}
        scroll={'paper'}
        fullWidth
        fullScreen={belowLargeScreen}
        maxWidth='md'
      >
        <StakeholderDialogForm stakeholder={stakeholder} toggleOpen={setOpenEditDialog} />
      </Dialog>

      <JumboDdMenu
        icon={
          <Tooltip title='Actions'>
            <MoreHorizOutlined />
          </Tooltip>
        }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
      
      {/* Dialog for delete confirmation */}
      <Dialog open={openDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{stakeholder.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            onClick={() => deleteStakeholder(stakeholder.id)}
            color="primary"
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StakeholderItemAction;