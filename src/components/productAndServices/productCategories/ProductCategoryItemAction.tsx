import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material'
import { Dialog, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react'
import ProductCategoryFormDialogContent from './ProductCategoryFormDialogContent';
import { ProductCategoriesAppContext } from './ProductCategories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import productCategoryServices from './productCategoryServices';
import { JumboDdMenu } from '@jumbo/components';

function ProductCategoryItemAction({productCategory}) {
  const {showDialog,hideDialog} = useJumboDialog();
  const {enqueueSnackbar} = useSnackbar();
  const {productCategories} = useContext(ProductCategoriesAppContext);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const deleteProductCategory = useMutation(productCategoryServices.delete,{
    onSuccess: (data) => {
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['productCategories']);
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
      case 'delete':
        showDialog({
          title : 'Confirm Delete?',
          content: 'If you say yes, this item will be deleted provided it is not associated with any transactions',
          onYes: () => {
            hideDialog();
            deleteProductCategory.mutate(productCategory);
          },
          onNo: () => hideDialog(),
          variant: 'confirm'
        })
        break;
      case 'edit':
        setOpenEditDialog(true);
        break;
      default:
        break;
    }
  }
  return (
    <React.Fragment>
      <Dialog
        open={openEditDialog}
        scroll={'paper'}
        fullWidth
        fullScreen={belowLargeScreen}   
      >
        <ProductCategoryFormDialogContent productCategories={productCategories} productCategory={productCategory} title={`Edit Category`} onClose={() => setOpenEditDialog(false)} />
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
    </React.Fragment>
  )
}

export default ProductCategoryItemAction