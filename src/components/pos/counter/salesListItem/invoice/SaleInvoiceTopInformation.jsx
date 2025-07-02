import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div';
import { Autocomplete, Checkbox, Chip, Divider, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import posServices from '../../../pos-services';
import { useFormContext } from 'react-hook-form';

function SaleInvoiceTopInformation() {
    const {authOrganization : {organization}} = useJumboAuth();
    const [totalAmount, setTotalAmount] = useState(0);
    const [vatableAmount, setVatableAmount] = useState(0);
    const { sale, setValue, register, watch, errors, setIsRetrieving, setSale_items, sale_items, transaction_date, setIsTaxInvoice, isTaxInvoice } = useFormContext()
    const currencyCode = sale.currency.code;

    const { data: saleDeliveryNotes, isLoading } = useQuery(
        ['saleDeliveryNotes', {saleId: sale.id}],() => posServices.saleDeliveryNotes(sale.id),
    );

    const retrieveDeliveryNotesSalesItems = async () => {
        const delivery_note_ids = watch('delivery_note_ids');
        
        if(!sale.is_instant_sale && delivery_note_ids.length > 0){
            setIsRetrieving(true);
            const deliveryNotesSalesItems =  await posServices.deliveryNotesSalesItems({
                delivery_note_ids: delivery_note_ids,
            })

            let fetchedData = await deliveryNotesSalesItems.map(item => item)
            await setSale_items(fetchedData && fetchedData.map(item => item.items).flat())
            setIsRetrieving(false);
        }else if(!sale.is_instant_sale && delivery_note_ids.length === 0){
            setSale_items([])
        }
    }

    const vat_registered = !!organization.settings?.vat_registered;
    const vat_percentage = parseFloat(watch('vat_percentage'));
    const vatAmount = vatableAmount*vat_percentage/100 //Total VAT
    
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
               vatableAmount += item.rate*item.quantity
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

    if(isLoading && !sale.is_instant_sale){
        return <LinearProgress/>
    }

  return (
    <>
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
                    { !sale.is_instant_sale &&
                        <Grid item xs={12} md={8} lg={8}>
                            <Div sx={{mt: 0.3}}>
                                {
                                    <Autocomplete
                                        size="small"
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        options={saleDeliveryNotes.filter(item => !item.is_invoiced)}
                                        multiple={true}
                                        disableCloseOnSelect={true}
                                        getOptionLabel={(option) => option.deliveryNo}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Delivery Note"
                                                error={!!errors?.delivery_note_ids}
                                                helperText={errors?.delivery_note_ids?.message}
                                            />
                                        )}

                                        renderTags={(tagValue, getTagProps)=> {
                                            return tagValue.map((option, index)=>{
                                                const {key, ...restProps} = getTagProps({index});
                                                return <Chip {...restProps} key={option.id+"-"+key} label={option.deliveryNo} />
                                             })
                                        }}
                                        onChange={(event, newValue) => {
                                            newValue ? setValue('delivery_note_ids', newValue.map(value => value.id),{
                                                shouldDirty: true,
                                                shouldValidate: true
                                            }) : setValue('delivery_note_ids',[],{
                                                shouldDirty: true,
                                                shouldValidate: true
                                            });
                                            retrieveDeliveryNotesSalesItems()
                                        }}
                                    />
                                }
                            </Div>
                        </Grid>
                    }
                    <Grid item  md={4} lg={4} xs={12}>
                        <Div sx={{mt: 0.3}}>
                            <DateTimePicker
                                label='Due Date'
                                fullWidth
                                minDate={dayjs(watch('transaction_date'))}
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
                    <Grid item xs={12} md={!sale.is_instant_sale ? 6 : 4}>
                        <Div sx={{ mt: 0.3}}>
                            <Autocomplete
                                id="checkboxes-terms_and_instructions"
                                freeSolo
                                options={suggestions}
                                isOptionEqualToValue={(option,value) => option === value}
                                getOptionLabel={(option) => option}
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
                    <Grid item  md={!sale.is_instant_sale ? 6 : 4} xs={12} >
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
                    {organization.is_tra_connected && (!organization.is_vat_registered || sale.vat_amount > 0) &&
                        <Grid item xs={12}>
                            <Div sx={{ mt: 0.3}}>
                                <Checkbox
                                    checked={isTaxInvoice}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setIsTaxInvoice(isChecked);
                                        setValue('is_tax_invoice', isChecked, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                                Post VFD
                            </Div>
                        </Grid>
                    }
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
                            <Typography align='right' variant='h5'>{vatAmount.toLocaleString("en-US", {style:"currency", currency:currencyCode}) || 0}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' variant='body2'>Grand Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' variant='h5'>{(totalAmount + vatAmount).toLocaleString("en-US", {style:"currency", currency: currencyCode})}</Typography>
                        </Grid>
                    </>
                }
            </Grid>
        </Grid>
    </>
  )
}

export default SaleInvoiceTopInformation