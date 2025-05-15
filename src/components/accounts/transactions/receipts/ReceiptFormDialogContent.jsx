import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import Div from '@jumbo/shared/Div'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import LedgerSelect from '../../ledgers/forms/LedgerSelect'
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers'
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField'
import { useMutation,  useQueryClient } from 'react-query'
import receiptServices from './receipt-services'
import { useSnackbar } from 'notistack'
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector'
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import TransactionItemForm from '../TransactionItemForm'
import TransactionItemRow from '../TransactionItemRow'
import { HighlightOff } from '@mui/icons-material'

function ReceiptFormDialogContent({setOpen,receipt = null}) {
    const {authOrganization,checkOrganizationPermission} = useJumboAuth();
    const [transactionDate] = useState(receipt ? dayjs(receipt.transactionDate) : dayjs());
    const {costCenters} = authOrganization;
    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();
    const [serverError, setServerError] = useState(null);
    const [items, setItems] = useState(receipt ? receipt.items : []);

    const haveAllCostCenters = checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL);

    const [showWarning, setShowWarning] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [clearFormKey, setClearFormKey] = useState(0);
    const [submitItemForm, setSubmitItemForm] = useState(false);

    const addReceipt = useMutation(receiptServices.add,{
        onSuccess: (data) => {
            data?.message && enqueueSnackbar(data.message,{variant:'success'});
            setOpen(false);
            queryClient.invalidateQueries('transactions');
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
    
    const updateReceipt = useMutation(receiptServices.update,{
        onSuccess: (data) => {
            data?.message && enqueueSnackbar(data.message,{variant:'success'});
            setOpen(false);
            queryClient.invalidateQueries('transactions');
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
            .string().typeError('Narration is required')
            .required('Narration is required'),
        debit_ledger_id: yup
            .number()
            .required('Receiving Account is required').positive('Receiving Account Is Required').typeError('Receiving Account Is Required'),
        currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
        exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
        transactionDate: yup
            .string()
            .required('Receipt Date is required').typeError('Receipt Date is required'),
        items: yup.array().of(
            yup.object().shape({
              credit_ledger_id: yup.string().required("Receive From (Debit) account is required"),
              description: yup.string().required("Description is required"),
              amount: yup.number().required("Amount is required").positive('Amount must be greater than 0'),
            })
        ),
        cost_centers: yup
            .array()
            .test(
                'cost-center-required',
                'At least one cost center is required',
            (value) => haveAllCostCenters || (value && value.length > 0)
        ),
    });
    const {handleSubmit, setError, setValue,register, clearErrors, formState: {errors},watch} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            debit_ledger_id : receipt && receipt.debit_ledger_id,
            currency_id: receipt ? receipt.currency.id : 1,
            exchange_rate: receipt?.exchange_rate ? receipt.exchange_rate : 1,
            cost_centers: receipt ? receipt.cost_centers : costCenters.length === 1 ? costCenters : [],
            reference: receipt && receipt.reference,
            narration: receipt && receipt.narration,
            transactionDate: transactionDate.toISOString(),
            items: receipt ? receipt.items : items,
            id: receipt && receipt.id
        }
    });

    useEffect(() => {
        setValue('items', items);
    }, [items]);

    const totalAmount = items.reduce((totalAmount, item) => totalAmount + item.amount, 0);

    const saveReceipt = React.useMemo(() => {
        return receipt ? updateReceipt : addReceipt
    },[updateReceipt,addReceipt]);

    const onSubmit = (data) => {
        if (items.length === 0) {
          clearErrors("items");
          setError("items", { type: "manual", message: "You must add at least one item" });
          return;
        }
        if (isDirty) {
          setShowWarning(true);
        } else {
            handleSubmit((data) => handleSubmitForm(data))();
        }
    };
      
    const handleConfirmSubmitWithoutAdd = async (data) => {
        handleSubmit((data) => handleSubmitForm(data))();
        setIsDirty(false);
        setShowWarning(false);
        setClearFormKey((prev) => prev + 1);
    };
      
    const handleSubmitForm = async (data) => {
        const updatedData = { 
            ...data, 
            items: items.map(item => ({
                credit_ledger_id: item.credit_ledger_id,
                amount: item.amount,
                description: item.description
            }))
        };
        await saveReceipt.mutate(updatedData);
    };  

    return (
        <>
            <DialogTitle textAlign={'center'}>{receipt ? `Edit ${receipt.voucherNo}`: `New Receipt Form`}</DialogTitle>
            <DialogContent>
                <form autoComplete='false' 
                    onSubmit={handleSubmit(saveReceipt)}
                >
                    <Grid container  columnSpacing={1} marginBottom={2}>
                        <Grid item xs={12} md={4}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <DateTimePicker
                                    label="Receipt Date (MM/DD/YYYY)"
                                    fullWidth
                                    minDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.RECEIPTS_BACKDATE]) ? dayjs(authOrganization.organization.recording_start_date) : dayjs().startOf('day')}
                                    maxDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_POSTDATE,PERMISSIONS.RECEIPTS_POSTDATE]) ? dayjs().add(10,'year').endOf('year') : dayjs().endOf('day')}defaultValue={transactionDate}
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
                                    frontError={errors.debit_ledger_id}
                                    defaultValue={receipt && {id: receipt.debit_ledger_id,name: receipt.debitLedgerName}}
                                    allowedGroups={['Cash and cash equivalents']}
                                    onChange={(newValue) => {
                                        setValue('debit_ledger_id', newValue ? newValue.id : 0,{
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    }}
                                    label="Receiving Account (Debit)"
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <TextField
                                    size="small"
                                    label="Reference"
                                    fullWidth
                                    defaultValue={receipt && receipt.reference}
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
                                    frontError={errors?.currency_id}
                                    defaultValue={receipt ? receipt.currency.id : 1}
                                    onChange={(newValue) => {
                                    setValue('currency_id', newValue ? newValue.id : null,{
                                        shouldDirty: true,
                                        shouldValidate: true
                                    });
        
                                    clearErrors('exchange_rate');
        
                                    setValue('exchange_rate', newValue?.exchangeRate ? newValue.exchangeRate : 1);
        
                                    }}
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
                                        }}
                                    />
                                </Div>
                            </Grid>
                        }
                        <Grid item xs={12} lg={watch('currency_id') === 1 ? 8 : 12}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <CostCenterSelector
                                    label="Cost Centers"
                                    disableCloseOnSelect={false}
                                    frontError={errors.cost_centers}
                                    defaultValue={(receipt && receipt.cost_centers) || (costCenters.length === 1 && costCenters)}
                                    onChange={(newValue) => {
                                        setValue('cost_centers', newValue, {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    }}
                                />
                            </Div>
                        </Grid>
                    </Grid>

                    <TransactionItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveReceipt.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} items={items} setItems={setItems} isReceipt={true}/>

                    {
                        errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
                    }

                    {
                        items.map((item, index) => {
                            return <TransactionItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveReceipt.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} index={index} item={item} items={items} setItems={setItems} isReceipt={true}/>
                        })
                    }

                    <Divider />
                    <Grid container  columnSpacing={1}>
                        <Grid item xs={11} sx={{ 
                            display: 'flex',
                            direction:'row',
                            justifyContent: 'flex-end'
                        }}>
                            <Typography variant={"h5"}>
                                {totalAmount.toLocaleString()}
                            </Typography>
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

                <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
                    <DialogTitle>            
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={11}>
                                Unsaved Changes
                            </Grid>
                        <Grid item xs={1} textAlign="right">
                            <Tooltip title="Close">
                                <IconButton
                                    size="small" 
                                    onClick={() => setShowWarning(false)}
                                >
                                    <HighlightOff color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        Last item was not added to the list
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => {setSubmitItemForm(true); setShowWarning(false);}}>
                            Add and Submit
                        </Button>
                        <Button size="small" onClick={handleConfirmSubmitWithoutAdd} color="secondary">
                            Submit without add
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <LoadingButton
                    type='submit'
                    onClick={onSubmit}
                    loading={addReceipt.isLoading || updateReceipt.isLoading}
                    size="small"
                    variant='contained'
                >Submit</LoadingButton>
            </DialogActions>
        </>
    )
}

export default ReceiptFormDialogContent