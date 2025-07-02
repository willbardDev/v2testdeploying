import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div';
import { Autocomplete, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, LinearProgress, TextField, Tooltip, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import posServices from '../../../pos-services';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

function SalesInvoiceEditForm({invoiceData, toggleOpen}) {
    const [transaction_date] = useState(invoiceData ? dayjs(invoiceData.transaction_date) : dayjs());
    const [due_date] = useState(invoiceData.due_date !== null ? dayjs(invoiceData.due_date) : dayjs());
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); 
    const {authOrganization : {organization}} = useJumboAuth();
    const [totalAmount, setTotalAmount] = useState(0);
    const [vatableAmount, setVatableAmount] = useState(0);
    const [sale_items, setSale_items] = useState(invoiceData ? invoiceData.items : []);
    const currencyCode = invoiceData.currency.code;

    const updateInvoice = useMutation(posServices.updateInvoice, {
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
        return updateInvoice.mutate
    },[updateInvoice]);

    const validationSchema = yup.object({
        transaction_date: yup.string().required('Invoice Date is required').typeError('Invoice Date is required'),
      }
    );

    const { setValue, register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            id: invoiceData?.id,
            internal_reference: invoiceData.internal_reference,
            customer_reference: invoiceData.customer_reference,
            narration: invoiceData.narration,
            terms_and_instructions: invoiceData.terms_and_instructions,
            transaction_date: transaction_date.toISOString(),
            due_date: due_date.toISOString()
        }
    });

    const vat_registered = !!organization.settings?.vat_registered;

    useEffect(() => {
        let total = 0;
        let vatableAmount = 0;

        async function loopItems(){
            await sale_items.forEach((item) => {
                total += item.rate*item.quantity
            });
            setTotalAmount(total);
        }

        async function loopItemsForVAT(){
            await sale_items.filter(item => item.product?.vat_exempted !== 1).forEach((item) => {
               vatableAmount += item.vat_amount
            });
            setVatableAmount(vatableAmount);
        }
        loopItems();
        loopItemsForVAT();

    }, [sale_items]);

    const { data: suggestions, isLoading: isFetching } = useQuery('terms-and-instructions', posServices.getTermsandInstructions);
  
    if (isFetching) {
      return <LinearProgress />;
    }

  return (
    <>
        <DialogTitle>
            <Grid container columnSpacing={2}>
                <Grid textAlign={'center'} item xs={12} mb={3}>{`Edit Invoice ${invoiceData.invoiceNo}`}</Grid>
                <Grid item xs={12} md={9} mb={2}>
                    <form autoComplete='off'>
                        <Grid container columnSpacing={1} rowSpacing={2}>
                            <Grid item  md={4} lg={4} xs={12}>
                                <Div sx={{mt: 0.3}}>
                                    <DateTimePicker
                                        label='Invoice Date'
                                        fullWidth
                                        minDate={dayjs(organization.recording_start_date)}
                                        defaultValue={transaction_date}
                                        slotProps={{
                                            textField : {
                                                size: 'small',
                                                fullWidth: true,
                                                readOnly: true,
                                                error: !!errors?.transaction_date,
                                                helperText: errors?.transaction_date?.message
                                            }
                                        }}
                                        onChange={(newValue) => {
                                            setValue('transaction_date', newValue ? newValue.toISOString() : null,{
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                            <Grid item  md={4} lg={4} xs={12} >
                                <Div sx={{mt: 0.3}}>
                                    <TextField
                                        size='small'
                                        label='Internal Reference'
                                        fullWidth
                                        {...register('internal_reference')}
                                    />
                                </Div>
                            </Grid>
                            <Grid item  md={4} lg={4} xs={12} >
                                <Div sx={{mt: 0.3}}>
                                    <TextField
                                        size='small'
                                        label='Customer Reference'
                                        fullWidth
                                        {...register('customer_reference')}
                                    />
                                </Div>
                            </Grid>
                            <Grid item  md={4} lg={4} xs={12}>
                                <Div sx={{mt: 0.3}}>
                                    <DateTimePicker
                                        label='Due Date'
                                        fullWidth
                                        minDate={dayjs(watch('transaction_date'))}
                                        defaultValue={due_date}
                                        slotProps={{
                                            textField : {
                                                size: 'small',
                                                fullWidth: true,
                                                readOnly: true,
                                                error: !!errors?.transaction_date,
                                                helperText: errors?.transaction_date?.message
                                            }
                                        }}
                                        onChange={(newValue) => {
                                            setValue('due_date', newValue ? newValue.toISOString() : null,{
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Div sx={{ mt: 0.3}}>
                                    <Autocomplete
                                        id="checkboxes-terms_and_instructions"
                                        freeSolo
                                        options={suggestions}
                                        isOptionEqualToValue={(option,value) => option === value}
                                        getOptionLabel={(option) => option}
                                        defaultValue={invoiceData.terms_and_instructions}
                                        renderInput={
                                            (params) => 
                                            <TextField 
                                                {...params} 
                                                label="Terms and Instructions" 
                                                size="small" 
                                                fullWidth 
                                                multiline
                                                rows={2}
                                                error={!!errors.terms_and_instructions}
                                                helperText={errors.terms_and_instructions?.message}
                                            />
                                        }
                                        onChange={(e, newValue) => {
                                            setValue('terms_and_instructions', newValue && newValue , {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                        onInputChange={(event, newValue) => {
                                            setValue('terms_and_instructions',newValue ? newValue : '',{
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                            <Grid item  md={4} lg={4} xs={12} >
                                <Div sx={{mt: 0.3}}>
                                    <TextField
                                        size='small'
                                        label='Narration'
                                        fullWidth
                                        multiline={true}
                                        minRows={2}
                                        {...register('narration')}
                                    />
                                </Div>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                            <Typography align='center' variant='h3'>Summary</Typography>
                            <Divider/>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' variant='body2'>Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' variant='h5'>{totalAmount.toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Typography>
                        </Grid>
                        { !!vat_registered &&
                            <>
                                <Grid item xs={6}>
                                    <Typography align='left' variant='body2'>VAT Amount:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align='right' variant='h5'>{vatableAmount.toLocaleString("en-US", {style:"currency", currency:currencyCode}) || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align='left' variant='body2'>Grand Total:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align='right' variant='h5'>{(totalAmount + vatableAmount).toLocaleString("en-US", {style:"currency", currency:invoiceData.currency.code})}</Typography>
                                </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </DialogTitle>

        <DialogContent>
            {sale_items?.map((item, index) => (
                <Grid
                    container
                    spacing={1}
                    key={index}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                        bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={0.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>{index + 1}.</Div>
                    </Grid>
                    <Grid item xs={11.5} md={8} lg={5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Product'>
                                <Typography>{item.product}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={2} md={3.5} lg={1.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Quantity'>
                                <Typography>{`${item.measurement_unit.symbol || item.measurement_unit} ${item.quantity}`}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={4} md={4} lg={2.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Rate'>
                                <Typography>{item.rate?.toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={4} md={4} lg={2.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Amount'>
                                <Typography>{(item.rate * item.quantity).toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                </Grid>
            ))}
        </DialogContent>

        <DialogActions>
            <Button size='small' onClick={() => toggleOpen(false)}>
                Cancel
            </Button>
            <LoadingButton
                loading={updateInvoice.isLoading}
                size='small'
                type='submit'
                variant='contained'
                onClick={handleSubmit(saveMutation)}
            >
                Invoice
            </LoadingButton>
        </DialogActions>
    </>
  )
}

export default SalesInvoiceEditForm