import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button, DialogTitle, DialogContent, DialogActions, Typography, Divider, Alert, Dialog, Tooltip, IconButton} from '@mui/material'
import { useForm } from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import LedgerSelect from '../../ledgers/forms/LedgerSelect';
import Div from '@jumbo/shared/Div/Div';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import fundTransferServices from './fund-transfer-services';
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector';
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import TransactionItemForm from '../TransactionItemForm';
import TransactionItemRow from '../TransactionItemRow';
import { HighlightOff } from '@mui/icons-material';

function TransferFormDialogContent({setOpen, transfer = null}) {
    const {authOrganization,checkOrganizationPermission} = useJumboAuth();
    const {costCenters} = authOrganization;
    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();
    const [serverError, setServerError] = useState(null);
    const [items, setItems] = useState(transfer ? transfer.items : []);

    const haveAllCostCenters = checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL);

    const [showWarning, setShowWarning] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [clearFormKey, setClearFormKey] = useState(0);
    const [submitItemForm, setSubmitItemForm] = useState(false);

    const addTransfer = useMutation(fundTransferServices.add,{
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
    
    const updateTransfer = useMutation(fundTransferServices.update,{
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
  
    const validationSchema = yup.object().shape({
        transactionDate: yup.date().required("Transfer Date is required"),
        narration: yup.string().required("Narration is required"),
        currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
        exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
        credit_ledger_id: yup.number().required("Tranfer from (credit) Ledger is required")
                            .positive('Tranfer from (credit) Ledger is required')
                            .typeError('Tranfer from (credit) Ledger is required'),
        items: yup.array().of(
                yup.object().shape({
                debit_ledger_id: yup.string().required("Tranfer to (Debit) account is required"),
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

    const{register, setError, setValue, handleSubmit, clearErrors, watch, formState:{ errors }}=useForm({
      resolver:yupResolver(validationSchema),
      defaultValues:{
        id: transfer && transfer.id,
        transactionDate: transfer ? transfer.transactionDate : dayjs(),
        credit_ledger_id : transfer && transfer.credit_ledger_id,
        items: transfer ? transfer.items : items,
        reference: transfer && transfer.reference,
        narration: transfer && transfer.narration,
        currency_id: transfer ? transfer.currency.id : 1,
        exchange_rate: transfer?.exchange_rate ? transfer.exchange_rate : 1,
        cost_centers: transfer ? transfer.cost_centers : costCenters.length === 1 ? costCenters : [],
      }
    })

    useEffect(() => {
        setValue('items', items);
    }, [items]);

    const totalAmount = items.reduce((totalAmount, item) => totalAmount + item.amount, 0);

    const saveTransfer = React.useMemo(() => {
        return transfer ? updateTransfer : addTransfer
    },[updateTransfer,addTransfer]);

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
                debit_ledger_id: item.debit_ledger_id,
                amount: item.amount,
                description: item.description
            }))
        };
          await saveTransfer.mutate(updatedData);
      };
  
    return (
        <>  
            <DialogTitle textAlign={'center'}>{transfer ? `Edit ${transfer.voucherNo}` : `New Transfer Form`}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(saveTransfer)}>
                    <Grid container  columnSpacing={1} marginBottom={2}>
                        <Grid item xs={12} md={4}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <DateTimePicker
                                    label="Tranfer Date (MM/DD/YYYY)"
                                    fullWidth
                                    minDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.FUND_TRANSFERS_BACKDATE]) ? dayjs(authOrganization.organization.recording_start_date) : dayjs().startOf('day')}
                                    maxDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_POSTDATE,PERMISSIONS.FUND_TRANSFERS_POSTDATE]) ? dayjs().add(10,'year').endOf('year') : dayjs().endOf('day')}defaultValue={transfer ? dayjs(transfer.transactionDate) : dayjs()}
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
                                    defaultValue={transfer && {id: transfer.credit_ledger_id,name: transfer.creditLedgerName}}
                                    allowedGroups={['Cash and cash equivalents']}
                                    onChange={(newValue) => {
                                        setValue('credit_ledger_id', newValue ? newValue.id : 0,{
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    }}
                                    label="Tranfer From(Credit)"
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <TextField
                                    size="small"
                                    label="Reference"
                                    fullWidth
                                    defaultValue={transfer && transfer.reference}
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
                                    defaultValue={transfer ? transfer.currency.id : 1}
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
                                    defaultValue={(transfer && transfer.cost_centers) || (costCenters.length === 1 && costCenters)}
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

                    <TransactionItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveTransfer.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} items={items} setItems={setItems} isTransfer={true}/>

                    {
                        errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
                    }

                    {
                        items.map((item, index) => {
                            return <TransactionItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveTransfer.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} index={index} item={item} items={items} setItems={setItems} isTransfer={true}/>
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
                <LoadingButton onClick={onSubmit} loading={addTransfer.isLoading || updateTransfer.isLoading} type='submit' size='small' variant='contained'>
                    Submit
                </LoadingButton>
            </DialogActions>
        </>
    )
}

export default TransferFormDialogContent