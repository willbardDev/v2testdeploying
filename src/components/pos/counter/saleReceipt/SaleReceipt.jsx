import { Button, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import posServices from '../../pos-services';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import SaleReceiptPDF from './SaleReceiptPDF';
import SaleReceiptOnScreen from './SaleReceiptOnScreen';
import { LoadingButton } from '@mui/lab';

const SaleReceipt = ({ organization, sale, user, setOpenReceiptDialog}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      customer_tin: '',
      id: '',
      vat_percentage: '',
      items: ''
    }
  });

  useEffect(() => {
    if (sale) {
      reset({
        customer_tin: sale?.stakeholder?.tin || '',
        id: sale?.id || '',
        vat_percentage: sale?.vat_percentage || '',
        items: sale?.sale_items || []
      });
    }
  }, [sale, reset]);

  const postSalesReceiptToVFD = useMutation(posServices.postSaleToVFD, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sale', { id: sale?.id }]);
      queryClient.invalidateQueries(['counterSales']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  return (
    <>
      {
        (organization.is_tra_connected && !sale.vfd_receipt) &&
        <DialogTitle>
          <Grid container columnSpacing={1} rowSpacing={1}>
            <Grid item xs={12} marginBottom={2} textAlign={'center'}>
             <Typography variant='subtitle1'>{`Receipt ${sale.saleNo}`}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={'Customer TIN'}
                fullWidth
                size='small'
                {...register('customer_tin', {
                  validate: (value) => {
                    if (!value) {
                      return true;
                    }

                    const sanitizedValue = value.replace(/\D/g, ''); 
                    if (sanitizedValue.length !== 9 || !/^\d{9}$/.test(sanitizedValue)) {
                      return 'Customer TIN must be exactly 9 digits';
                    }
                  }
                })}
                error={!!errors.customer_tin}
                helperText={errors.customer_tin?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={'Customer VRN'}
                fullWidth
                size='small'
                {...register('customer_vrn')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Customer Name'}
                fullWidth
                size='small'
                {...register('customer_name')}
              />
            </Grid>
          </Grid>
        </DialogTitle>
      }
      <DialogContent>
        {
          !organization.is_tra_connected ? (
            <PDFContent
              fileName={`Receipt ${sale.saleNo}`}
              document={<SaleReceiptPDF organization={organization} sale={sale} user={user} />}
            />
          ) : (
            !sale.vfd_receipt ? (
              <SaleReceiptOnScreen organization={organization} sale={sale} />
            ) : (
              postSalesReceiptToVFD.isLoading ? (
                <LinearProgress />
              ) : (
                <PDFContent
                  fileName={`Receipt ${sale.vfd_receipt.verification_code}`}
                  document={<SaleReceiptPDF organization={organization} sale={sale} user={user} />}
                />
              )
            )
          )
        }
      </DialogContent>
      <DialogActions>
        <Button size="small" variant='outlined' onClick={() => setOpenReceiptDialog(false)}>
          Close
        </Button>
        {
          organization.is_tra_connected && !sale.vfd_receipt &&
          <LoadingButton size='small' loading={postSalesReceiptToVFD.isLoading} variant='contained' onClick={handleSubmit(postSalesReceiptToVFD.mutate)}>
            Post VFD
          </LoadingButton>
        }
      </DialogActions>
    </>
  );
}

export default SaleReceipt;