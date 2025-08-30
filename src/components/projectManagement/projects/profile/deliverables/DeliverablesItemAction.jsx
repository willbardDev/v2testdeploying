import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Dialog,Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import projectsServices from '../../projectsServices';
import { useJumboTheme } from '@jumbo/hooks';
import DeliverablesForm from './DeliverablesForm';

const DeliverablesItemAction = ({ deliverable}) => {
    const [openEditDialog,setOpenEditDialog] = useState(false);
    const {showDialog,hideDialog} = useJumboDialog();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: deleteDeliverable } = useMutation(projectsServices.deleteDeliverable, {
        onSuccess: (data) => {
        queryClient.invalidateQueries(['projectDeliverableGroups']);
        enqueueSnackbar(data.message, {
            variant: 'success',
        });
        },
        onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const menuItems = [
        {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
        {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this Deliverable?',
            onYes: () =>{ 
                hideDialog();
                deleteDeliverable(deliverable.id)
            },
            onNo: () => hideDialog(),
            variant:'confirm'
        });
        break;
        default:
        break;
    }
  }

  return (
    <>
        <Dialog
            open={openEditDialog}
            fullWidth  
            fullScreen={belowLargeScreen}
            maxWidth={'md'} 
            scroll={belowLargeScreen ? 'body' : 'paper'}
        >
            <DeliverablesForm deliverable={deliverable} setOpenDialog={setOpenEditDialog} />
        </Dialog>
        <JumboDdMenu
            icon={
                <Tooltip title='Actions'>
                    <MoreHorizOutlined/>
                </Tooltip>
            }
            menuItems={menuItems}
            onClickCallback={handleItemAction}
        />
    </>
  );
};

export default DeliverablesItemAction;
