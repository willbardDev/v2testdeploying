import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import * as yup from 'yup'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import posServices from '../../../pos-services';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, DialogActions, DialogContent, DialogTitle, Grid} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaleInvoiceTopInformation from './SaleInvoiceTopInformation';
import SaleInvoiceItems from './SaleInvoiceItems';

function SaleInvoiceForm({toggleOpen, sale = null}) {
    const [transaction_date] = useState(dayjs());
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); 
    const [isRetrieving, setIsRetrieving] = useState(false);
    const [sale_items, setSale_items] = useState(!sale.is_instant_sale ? [] : sale.sale_items);
    const [isTaxInvoice, setIsTaxInvoice] = useState(false);

    // Mutation methods
    const addInvoiceSale = useMutation(posServices.invoiceSale, {
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['SaleInvoices']);
            queryClient.invalidateQueries(['counterSales']);
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const updateInvoice = useMutation(posServices.updateSaleInvoice, {
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['SaleInvoices']);
            queryClient.invalidateQueries(['counterSales']);
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const saveMutation = React.useMemo(() => {
        return addInvoiceSale.mutate
    },[addInvoiceSale]);

    const validationSchema = yup.object({
        transaction_date: yup.string().required('Invoice Date is required').typeError('Invoice Date is required'),
      }
    );

    const { setValue, register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            id: sale?.id,
            is_instant_sale: sale.is_instant_sale,
            internal_reference: sale.saleNo,
            vat_percentage: sale?.vat_percentage,
            customer_reference: '',
            delivery_note_ids: [],
            narration: '',
            is_tax_invoice: isTaxInvoice,
            transaction_date: transaction_date.toISOString(),
        }
    });

  return (
    <FormProvider {...{sale, setValue, register, watch, errors, isRetrieving, setIsRetrieving, setSale_items, sale_items, transaction_date, setIsTaxInvoice, isTaxInvoice}}>

        <DialogTitle>
            <Grid container columnSpacing={2}>
                <Grid textAlign={'center'} item xs={12} mb={3}>New Invoice</Grid>
                <SaleInvoiceTopInformation/>
            </Grid>
        </DialogTitle>

        <DialogContent>
            <SaleInvoiceItems/>
        </DialogContent>

        <DialogActions>
            <Button size='small' onClick={() => toggleOpen(false)}>
                Cancel
            </Button>
            <LoadingButton
                loading={addInvoiceSale.isLoading || updateInvoice.isLoading}
                size='small'
                type='submit'
                disabled={!sale.is_instant_sale && !sale_items.length > 0}
                variant='contained'
                onClick={handleSubmit(saveMutation)}
            >
                Invoice
            </LoadingButton>
        </DialogActions>
    </FormProvider>
  )
}

export default SaleInvoiceForm