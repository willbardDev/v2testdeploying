import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { DeleteOutlined, EditOutlined} from '@mui/icons-material'
import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { lazy, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import productServices from '../product-services';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';

const ProductFormDialogContent = lazy(() => import('../ProductFormDialogContent'));

function ProductItemAction({product}) {
  const {showDialog,hideDialog} = useJumboDialog();
  const {enqueueSnackbar} = useSnackbar();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();
  const {checkOrganizationPermission} = useJumboAuth();

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const deleteProduct = useMutation(productServices.delete,{
    onSuccess: (data) => {
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
    },
  });

  const handleDelete = () => {
    showDialog({
      title : 'Confirm Delete?',
      content: 'If you click yes, this Product will be deleted',
      onYes: () => {
        hideDialog();
        deleteProduct.mutate(product);
      },
      onNo: () => hideDialog(),
      variant: 'confirm'
    })
  }

  return (
    <React.Fragment>
      {
        checkOrganizationPermission([PERMISSIONS.PRODUCTS_EDIT]) &&
        <>
          <Dialog
            open={openEditDialog}
            scroll={'paper'}
            fullWidth
            fullScreen={belowLargeScreen}
          >
            <ProductFormDialogContent product={product} title={`Edit ${product.type === 'Service' ? 'Service' : 'Product'}`} toggleOpen={setOpenEditDialog} />
          </Dialog>
          <Tooltip  title={`Edit ${product.name}`}>
            <IconButton onClick={() => setOpenEditDialog(true)}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </>
      }
      {
        checkOrganizationPermission([PERMISSIONS.PRODUCTS_DELETE]) &&
        <Tooltip  title={`Delete ${product.name}`}>
          <IconButton onClick={handleDelete}>
            <DeleteOutlined color="error" />
          </IconButton>
        </Tooltip>
      }
    </React.Fragment>
  )
}

export default ProductItemAction