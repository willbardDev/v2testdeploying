import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import * as yup from 'yup'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, DialogActions, DialogContent, Grid, TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import posServices from '../../../pos-services';
import { useForm } from 'react-hook-form';
import Div from '@jumbo/shared/Div';
import { DateTimePicker } from '@mui/x-date-pickers';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { useCounter } from '../../CounterProvider';

function SaleReceiptForm({toggleOpen, sale = null}) {
    const [transaction_date] = useState(dayjs());
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const {activeCounter} = useCounter();
    const {authOrganization : {organization}} = useJumboAuth();

    // Mutation method
    const addSaleReceipt = useMutation(posServices.receiptSale, {
      onSuccess: (data) => {
        toggleOpen(false);
        enqueueSnackbar(data.message, { variant: 'success' });
        queryClient.invalidateQueries(['SaleReceipts']);
        queryClient.invalidateQueries(['counterSales']);
      },
      onError: (error) => {
        error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    });

    const saveMutation = React.useMemo(() => {
      return addSaleReceipt.mutate
    },[addSaleReceipt]);

    const validationSchema = yup.object({
      transaction_date: yup.string().required('Payment Date is required').typeError('Payment Date is required'),
      narration: yup.string().typeError('Narration is required'),
      debit_ledger_id: yup.number().required('Receiving Account is required').positive('Receiving Account Is Required').typeError('Receiving Account Is Required'),
      amount: yup.number().test('zero-amount', 'Entered amount must be greater than 0', function(value) {
          return sanitizedNumber(value) > 0;
      }).test('exceeds-receiptable-amount', 'Entered amount exceeds receiptable amount', function(value) {
          const { receiptable_amount,exchange_rate } = this.parent;
          return sanitizedNumber(value)*exchange_rate <= receiptable_amount;
      }).required('Amount is required').typeError('Amount is required'),
  });
  

    const { setValue, register, clearErrors, trigger, handleSubmit, watch, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        id: sale?.id,
        debit_ledger_id : '',
        amount:0,
        receiptable_amount: sale?.receiptable_amount,
        reference: '',
        narration: '',
        currency_id: sale?.currency_id ? sale.currency_id : 1,
        exchange_rate: sale?.exchange_rate ? sale.exchange_rate : 1,
        transaction_date: transaction_date.toISOString(),
      }
    });

  return (
    <>
      <DialogContent>
        <form autoComplete='off'>
          <Grid container columnSpacing={1} rowSpacing={2}>
              <Grid item xs={12} sx={{textAlign: 'center', fontSize: 17}}>
                {'New Receipt'}
              </Grid>
              <Grid item  md={4} lg={4} xs={12}>
                <DateTimePicker
                  label='Payment Date'
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
              </Grid>
              <Grid item  md={4} lg={4} xs={12}>
                <Autocomplete
                  size="small"
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={activeCounter.ledgers }
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Receiving Account"
                      error={!!errors?.debit_ledger_id}
                      helperText={errors?.debit_ledger_id?.message}
                    />
                  )}
                  onChange={(event, newValue) => {
                    newValue ? setValue('debit_ledger_id', newValue.id,{
                      shouldDirty: true,
                      shouldValidate: true
                    }) : setValue('debit_ledger_id',null,{
                      shouldDirty: true,
                      shouldValidate: true
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <CurrencySelector
                  frontError={errors?.currency_id}
                  onChange={(newValue) => {
                    setValue('currency_id', newValue ? newValue.id : null,{
                      shouldDirty: true,
                      shouldValidate: true
                    });

                    clearErrors('exchange_rate');

                    setValue('exchange_rate', newValue?.exchangeRate ? newValue.exchangeRate : 1);
                    trigger('amount');
                  }}
                />
              </Grid>
              {
                watch('currency_id') > 1 &&
                <Grid item xs={12} md={4} lg={4}>
                  <TextField
                    label="Exchange Rate"
                    fullWidth
                    size='small'
                    error={!!errors?.exchange_rate}
                    helperText={errors?.exchange_rate?.message}
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                    }}
                    value={watch('exchange_rate')}
                    onChange={(e) => {
                      setValue(`exchange_rate`,e.target.value ? sanitizedNumber(e.target.value ): null,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                      trigger('amount');
                    }}
                  />
                </Grid>
              }
              <Grid item  md={6} lg={4} xs={12} >
                <Div sx={1}>
                  <TextField
                    size='small'
                    label='Amount'
                    fullWidth
                    error={!!errors?.amount}
                    helperText={
                      !!errors?.amount?.message && watch('amount') > 0 ? `${errors.amount.message} of ${sale.receiptable_amount.toLocaleString("en-US", {style:"currency", currency:sale.currency.code,minimumFractionDigits: 3})}` : errors?.amount?.message
                    }
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                    }}
                    onChange={(e) => {
                      setValue(`amount`,e.target.value ? sanitizedNumber(e.target.value ): null,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>
              <Grid item  md={4} lg={4} xs={12}>
                <TextField
                  size='small'
                  label='Reference'
                  fullWidth
                  error={!!errors?.reference}
                  helperText={errors?.reference?.message}
                  {...register('reference')}
                />
              </Grid>
              <Grid item md={watch('currency_id') > 1 ? 8 : 4} xs={12} >
                <TextField
                  size='small'
                  label='Narration'
                  fullWidth
                  multiline={true}
                  minRows={2}
                  {...register('narration')}
                />
              </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={addSaleReceipt.isLoading}
          size='small'
          type='submit'
          variant='contained'
          onClick={handleSubmit(saveMutation)}
        >
          Receipt
        </LoadingButton>
      </DialogActions>
    </>
  )
}

export default SaleReceiptForm