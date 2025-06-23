import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { DeleteOutlined, EditOutlined} from '@mui/icons-material'
import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { lazy, useState } from 'react'
import productServices from '../productServices';
import { PERMISSIONS } from '@/utilities/constants/permissions';

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

  const deleteProduct = useMutation({
    mutationFn: productServices.delete,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to delete product', { variant: 'error' });
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