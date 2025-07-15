import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import Div from '@jumbo/shared/Div'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Tooltip, Typography } from '@mui/material'
import {DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField'
import { useMutation,  useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector'
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import paymentServices from 'app/prosServices/prosERP/accounts/transactions/payments/payment-services'
import LedgerSelect from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelect'
import ApprovedPaymentItemForm from './ApprovedPaymentItemForm'

function ApprovedPaymentForm({toggleOpen, approvedDetails, payment = null, approvedRequisition, prevApprovedDetails}) {
    const {authOrganization,checkOrganizationPermission} = useJumboAuth();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState(null);
    const {enqueueSnackbar} = useSnackbar();

    const [items, setItems] = useState(() => {
      if (payment) {
        return payment.items.map((payItem) => {
          const prevItem = prevApprovedDetails?.items.find(
            (prevItem) => prevItem.ledger.id === payItem.debit_ledger_id
          );
    
          return {
            ...payItem,
            ledger: prevItem.ledger,
            debit_ledger_id: payItem.debit_ledger_id,
            amount: payItem.amount,
            unpaid_amount: prevItem ? (payItem.amount + prevItem.unpaid_amount) : 0,
            requisition_approval_ledger_item_id: prevItem.id,
          };
        });
      } else if (approvedDetails) {
        return approvedDetails.items.filter(item => item.unpaid_amount > 0).map((item) => ({
          ...item,
          debit_ledger_id: item.ledger.id,
          amount: item.unpaid_amount,
          requisition_approval_ledger_item_id: item.id,
        }));
      }
      return [];
    });

    const addPayment = useMutation(paymentServices.add,{
      onSuccess: (data) => {
        data?.message && enqueueSnackbar(data.message,{variant:'success'});
        queryClient.invalidateQueries(['approvedRequisitions']);
        queryClient.invalidateQueries('approvedPayments');
        toggleOpen(false);
      },
      onError: (error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setServerError(error.response?.data?.validation_errors);
          } else {
            enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
          }
        }
      }
    }); 
    
    const updatePayment = useMutation(paymentServices.update,{
      onSuccess: (data) => {
        data?.message && enqueueSnackbar(data.message,{variant:'success'});
        queryClient.invalidateQueries(['approvedRequisitions']);
        queryClient.invalidateQueries('approvedPayments');
        toggleOpen(false);
      },
      onError: (error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setServerError(error.response?.data?.validation_errors);
          } else {
            enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
          }
        }
      }
    });

    const validationSchema = yup.object({
      narration: yup
        .string()
        .required('Narration is required').typeError('Narration is required'),
      credit_ledger_id: yup
        .number()
        .required('Paying (credit) account is required').positive('Paying (credit) account as Required').typeError('Paying (credit) account as Required'),
      currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
      exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
      transactionDate: yup
        .mixed()
        .required('Payment Date is required'),
      items: yup.array().min(1, "You must add at least one item").required('You must add at least one item'),
    });

    const {handleSubmit, setValue,register, formState: {errors}, watch} = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        id: payment?.id,
        requisition_approval_id: approvedDetails?.id,
        credit_ledger_id : payment && payment.credit_ledger_id,
        currency_id: payment ? payment.currency.id : 1,
        exchange_rate: payment ? payment.currency.exchangeRate : 1,
        cost_centers: approvedRequisition ? [approvedRequisition.requisition.cost_center] : payment.cost_centers,
        transactionDate: payment ? payment.transactionDate : dayjs().toISOString(),
        items: items,
        narration: payment && payment.narration,
      }
    });

    const handleItemChange = (index, key, value) => {
      let updatedItems;
    
      if (key === 'delete' && value === true) {
        // Remove the item at the specified index
        updatedItems = items.filter((_, itemIndex) => itemIndex !== index);
      } else {
        // Update the item at the specified index
        updatedItems = [...items];
        updatedItems[index][key] = value;
      }
    
      setItems(updatedItems);
    };

    const totalAmount = items.reduce((totalAmount, item) => totalAmount + item.amount, 0);

    const savePayment = React.useMemo(() => {
      return payment ? updatePayment.mutate : addPayment.mutate
    },[payment, updatePayment, addPayment]);

    const handleSubmitForm = async (data) => {
      const updatedData = { 
        ...data, 
        items: items.filter(item => item.unpaid_amount > 0).map(item => ({
          debit_ledger_id: item.debit_ledger_id,
          requisition_approval_ledger_item_id: item.requisition_approval_ledger_item_id,
          amount: item.amount,
          description: item.remarks || item.description
        }))
      };
      await savePayment(updatedData);
    };

    return (
      <>
        <DialogTitle textAlign={'center'}>
          {payment ? `Edit Payment` : `New Approved Payment Form`}
        </DialogTitle>
        <DialogContent>
          <form autoComplete='false'>
            <Grid container  columnSpacing={1} marginBottom={2}>
              <Grid item xs={12} md={4}>
                <Div sx={{mt: 1, mb: 1}}>
                  <DateTimePicker
                    label="Payment Date (MM/DD/YYYY)"
                    fullWidth
                    minDate={checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE) ? dayjs(authOrganization.organization.recording_start_date) : dayjs().startOf('day')}
                    maxDate={checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_POSTDATE) ? dayjs().add(10,'year').endOf('year') : dayjs().endOf('day')}
                    defaultValue={payment ? dayjs(payment.transactionDate) : dayjs()}
                    slotProps={{
                      textField : {
                        size: 'small',
                        fullWidth: true,
                        readOnly: true,
                        error: !!errors?.transactionDate,
                        helperText: errors?.transactionDate?.message
                      }
                    }}
                    onChange={(newValue) => {
                      setValue('transactionDate', newValue ? newValue.toISOString() : null,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={4}>
                <Div sx={{mt: 1, mb: 1}}>
                  <LedgerSelect
                    frontError={errors.credit_ledger_id}
                    defaultValue={payment && {id: payment.credit_ledger_id,name: payment.creditLedgerName}}
                    allowedGroups={['Cash and cash equivalents']}
                    onChange={(newValue) => {
                      setValue('credit_ledger_id', newValue ? newValue.id : 0,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                    label="Pay From (Credit)"
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={4}>
                <Div sx={{mt: 1, mb: 1}}>
                  <TextField
                    size="small"
                    label="Reference"
                    fullWidth
                    {...register('reference')}
                    onChange={(e) => {
                      setServerError(null)
                    }}
                  />
                  <span style={{ color: 'red' }}>{serverError?.reference}</span>
                </Div>
              </Grid>
              <Grid item xs={12} md={4}>
                <Div sx={{mt: 1, mb: 1}}>
                  <CurrencySelector
                    defaultValue={approvedDetails ? approvedDetails.currency.id : 1}
                    disabled={true}
                  />
                </Div>
              </Grid>
              {
                watch('currency_id') > 1 &&
                <Grid item xs={12} md={4}>
                  <Div sx={{mt: 1, mb: 1}}>
                    <TextField
                      label="Exchange Rate"
                      fullWidth
                      size='small'
                      InputProps={{
                        inputComponent: CommaSeparatedField,
                      }}
                      disabled={true}
                    />
                  </Div>
                </Grid>
              }
              <Grid item xs={12} lg={watch('currency_id') === 1 ? 8 : 12}>
                <Div sx={{mt: 1, mb: 1}}>
                  <CostCenterSelector
                    multiple={true}
                    allowSameType={false}
                    defaultValue={approvedRequisition ? [approvedRequisition.requisition.cost_center] : payment.cost_centers}
                    disabled={true}
                  />
                </Div>
              </Grid>
            </Grid>

            {
              errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
            }

            <ApprovedPaymentItemForm approvedDetails={approvedDetails} items={items} handleItemChange={handleItemChange}/>

            <Divider />
            <Grid container  columnSpacing={1}>
              <Grid item xs={11} sx={{ 
                display: 'flex',
                direction:'row',
                justifyContent: 'flex-end'
              }}>
                <Tooltip title={'Total Amount'}>
                  <Typography variant={"h5"}>
                    {totalAmount.toLocaleString()}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Div sx={{mt: 1, mb: 1}}>
                  <TextField
                    label='Narration'
                    multiline={true}
                    rows={2}
                    fullWidth
                    error={!!errors?.narration}
                    helperText={errors?.narration?.message}
                    size='small'
                    {...register('narration')}
                  />
                </Div>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button size='small' onClick={() => toggleOpen(false)}>
            Cancel
          </Button>
          {items.length > 0 &&
            <LoadingButton
              type='submit'
              onClick={handleSubmit(handleSubmitForm)}
              loading={addPayment.isLoading || updatePayment.isLoading}
              size="small"
              variant='contained'
            >
              Submit
            </LoadingButton>
          }
        </DialogActions>
      </>
    )
}

export default ApprovedPaymentForm