import { DeleteOutlined,EditOutlined, MoreHorizOutlined} from '@mui/icons-material';
import { Dialog,Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import storeServices from './store-services';
import StoreForm from './StoreForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { JumboDdMenu } from '@jumbo/components';

const StoreItemAction = ({store}) => {
  const [openEditDialog,setOpenEditDialog] = useState(false);
  const {showDialog,hideDialog} = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const deleteStore = useMutation({
    mutationFn: storeServices.delete,
    onSuccess: (data) => {
      enqueueSnackbar(data?.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
    },
  });

  const menuItems = [
    {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
    {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
  ]

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
          title: 'Confirm Store',
          content: 'Are you sure you want to delete this Store?',
          onYes: () =>{ 
            hideDialog();
            deleteStore(store.id)
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
        maxWidth="xs" 
        fullScreen={belowLargeScreen}
      >
        <StoreForm store={store} setOpenDialog={setOpenEditDialog} />
      </Dialog>
      <JumboDdMenu
        icon={
          <Tooltip title='Actions'>
            <MoreHorizOutlined fontSize='small'/>
          </Tooltip>
      }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </>
  );
};

export default StoreItemAction;
