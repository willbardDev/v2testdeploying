import Div from '@jumbo/shared/Div/Div';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import * as yup from "yup";
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector';
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import journalServices from './journal-services';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import JournalItemForm from './JournalItemForm';
import JournalItemRow from './JournalItemRow';
import { HighlightOff } from '@mui/icons-material';

function JournalFormDialogContent({ isDuplicate=false, isEdit=false, setOpen, journal = null }) {
    const { authOrganization, checkOrganizationPermission } = useJumboAuth();
    const { costCenters } = authOrganization;
    const [items, setItems] = useState(journal ? journal.items : []);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [serverError, setServerError] = useState(null);
    const [transactionDate] = useState(isEdit ? dayjs(journal.transaction_date) : dayjs());

    const haveAllCostCenters = checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL);

    const [showWarning, setShowWarning] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [clearFormKey, setClearFormKey] = useState(0);
    const [submitItemForm, setSubmitItemForm] = useState(false);

    const addJournal = useMutation(journalServices.add, {
        onSuccess: (data) => {
            data?.message && enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries('transactions');
            setOpen(false);
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

    const updateJournal = useMutation(journalServices.update, {
        onSuccess: (data) => {
            data?.message && enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries('transactions');
            setOpen(false);
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
        narration: yup.string().required('Narration is required').typeError('Narration is required'),
        currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
        exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
        transactionDate: yup.string().required('Journal Date is required'),
        items: yup.array().min(1, "You must add at least one item").required('You must add at least one item'),
        cost_centers: yup
            .array()
            .test(
                'cost-center-required',
                'At least one cost center is required',
            (value) => haveAllCostCenters || (value && value.length > 0)
        ),
    });

    const { handleSubmit, setError, setValue, register, clearErrors, formState: { errors }, watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: journal && journal.reference,
            narration: journal && journal.narration,
            currency_id: journal?.currency_id ? journal.currency_id : 1,
            exchange_rate: journal?.exchange_rate ? journal.exchange_rate : 1,
            cost_centers: journal ? journal.cost_centers : costCenters.length === 1 ? costCenters : [],
            transactionDate: transactionDate.toISOString(),
            items: journal ? journal.items : items,
            id: journal && journal.id
        }
    });

    useEffect(() => {
        setValue('items', items);
    }, [items]);

    const totalAmount = items.reduce((totalAmount, item) => totalAmount + item.amount, 0);

    const saveJournal = React.useMemo(() => {
        return isEdit ? updateJournal : addJournal;
    }, [updateJournal, addJournal, isDuplicate]);

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
        const updatedData = { ...data, items };
          await saveJournal.mutate(updatedData);
      };

    return (
        <>
            <DialogTitle textAlign={'center'}>
                {isDuplicate ? `Duplicate: ${journal.voucherNo}` : isEdit ? `Edit: ${journal.voucherNo}` : `New Journal Form`}
            </DialogTitle>
            <DialogContent>
                <form autoComplete='false'>
                    <Grid container columnSpacing={1} marginBottom={2}>
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1, mb: 1 }}>
                                <DateTimePicker
                                    label="Journal Date (MM/DD/YYYY)"
                                    fullWidth
                                    minDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.JOURNAL_VOUCHERS_BACKDATE]) ? dayjs(authOrganization.organization.recording_start_date) : dayjs().startOf('day')}
                                    maxDate={checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_POSTDATE,PERMISSIONS.JOURNAL_VOUCHERS_POSTDATE]) ? dayjs().add(10, 'year').endOf('year') : dayjs().endOf('day')}
                                    defaultValue={transactionDate}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            readOnly: true,
                                            error: !!errors?.transactionDate,
                                            helperText: errors?.transactionDate?.message
                                        }
                                    }}
                                    onChange={(newValue) => {
                                        setValue('transactionDate', newValue ? newValue.toISOString() : null, {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    }}
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1, mb: 1 }}>
                                <CurrencySelector
                                    frontError={errors?.currency_id}
                                    defaultValue={journal ? journal.currency_id : 1}
                                    onChange={(newValue) => {
                                        setValue('currency_id', newValue ? newValue.id : null, {
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
                                <Div sx={{ mt: 1, mb: 1 }}>
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
                                            setValue(`exchange_rate`, e.target.value ? sanitizedNumber(e.target.value) : null, {
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                        }
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1, mb: 1 }}>
                                <TextField
                                    size="small"
                                    label="Reference"
                                    fullWidth
                                    defaultValue={journal && journal.reference}
                                    {...register('reference')}
                                    onChange={(e) => {
                                        setServerError(null)
                                    }}
                                />
                                <span style={{ color: 'red' }}>{serverError?.reference}</span>
                            </Div>
                        </Grid>
                        <Grid item xs={12} lg={watch('currency_id') === 1 ? 12 : 8}>
                            <Div sx={{ mt: 1, mb: 1 }}>
                                <CostCenterSelector
                                    label="Cost Centers"
                                    disableCloseOnSelect={false}
                                    frontError={errors.cost_centers}
                                    defaultValue={(journal && journal.cost_centers) || (costCenters.length === 1 && costCenters)}
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

                    <JournalItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveJournal.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} items={items} setItems={setItems}/>

                    {
                        errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
                    }

                    {
                        items.map((item, index) => {
                            return <JournalItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveJournal.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} index={index} item={item} items={items} setItems={setItems}/>
                        })
                    }

                    <Divider />
                    <Grid container columnSpacing={1}>
                        <Grid item xs={11} sx={{
                            display: 'flex',
                            direction: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <Tooltip title={'Total Amount'}>
                                <Typography variant={"h5"}>
                                    {totalAmount.toLocaleString()}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Div sx={{ mt: 1, mb: 1 }}>
                                <TextField
                                    label='Narration'
                                    multiline={true}
                                    rows={2}
                                    fullWidth
                                    size='small'
                                    error={!!errors?.narration}
                                    helperText={errors?.narration?.message}
                                    defaultValue={journal && journal.narration}
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
                <Button size='small' onClick={() => setOpen(false)} variant={'outlined'}>
                    Cancel
                </Button>
                <LoadingButton
                    type='submit'
                    size='small'
                    variant={'contained'}
                    loading={updateJournal.isLoading || addJournal.isLoading}
                    onClick={onSubmit}>
                    Submit
                </LoadingButton>
            </DialogActions>
        </>
    );
}

export default JournalFormDialogContent;
