import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material';
import React from 'react'
import { useSnackbar } from 'notistack';
import EditSecondaryUnitForm from './EditSecondaryUnitForm';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import productServices from '../../productServices';

function SecondaryUnitsItemAction({ product, selectedUnit, setSelectedUnit, openUnitEditDialog, setOpenUnitEditDialog, openUnitDeleteDialog, setOpenUnitDeleteDialog}) {
    const {theme} = useJumboTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { mutate: deleteUnit } = useMutation({
      mutationFn: productServices.deleteUnit,
      onSuccess: (data) => {
        enqueueSnackbar(data.message, {
          variant: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: ['secondaryUnits'],
        });
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message || 'Failed to delete unit', {
          variant: 'error',
        });
      },
    });

  return (
    <React.Fragment>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openUnitDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Secondary Measurement Unit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setSelectedUnit(null); setOpenUnitDeleteDialog(false); }} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
            if (selectedUnit) {
              deleteUnit({ productId: product.id, unitId: selectedUnit.id });
              setSelectedUnit(null);
              setOpenUnitDeleteDialog(false);
            }
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUnitEditDialog}
        scroll={smallScreen ? 'body' : 'paper'}
        fullWidth
        fullScreen={!!openUnitEditDialog && smallScreen}
        maxWidth={'md'}
      >
        <EditSecondaryUnitForm product={product} unit={selectedUnit} setOpenDialog={setOpenUnitEditDialog}/>
      </Dialog>
    </React.Fragment>
  )
}

export default SecondaryUnitsItemAction