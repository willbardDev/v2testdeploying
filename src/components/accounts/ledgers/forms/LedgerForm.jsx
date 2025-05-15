import React, { useEffect, useState } from "react";
import Div from "@jumbo/shared/Div";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, DialogActions, DialogContent, FormControl, FormControlLabel, FormHelperText, Grid, LinearProgress, Radio, RadioGroup, TextField, Tooltip, Typography } from "@mui/material";
import * as yup  from "yup";
import { useMutation, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
import CommaSeparatedField from "app/shared/Inputs/CommaSeparatedField";
import { useForm, Controller } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { sanitizedNumber } from "app/helpers/input-sanitization-helpers";
import dayjs from "dayjs";
import axios from "app/services/config";
import { DateTimePicker } from "@mui/x-date-pickers";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import CostCenterSelector from "app/prosServices/prosERP/masters/costCenters/CostCenterSelector";
import { useLedgerGroup } from "../../ledgerGroups/LedgerGroupProvider";
import ledgerServices from "../ledger-services";
import { AddOutlined } from "@mui/icons-material";
import AddQuickLedgerGroup from "./AddQuickLedgerGroup";

export default function LedgerForm ({ledger, toggleOpen}){
    const { enqueueSnackbar } = useSnackbar();
    const {ledgerGroupOptions} = useLedgerGroup();
    const queryClient = useQueryClient();
    const [isFetching, setIsFetching] = useState(false);
    const [openQuickAddLedgerGroup, setOpenQuickAddLedgerGroup] = useState(false);
    const {authOrganization} = useJumboAuth();
    const [openingBalanceCostCenter, setOpeningBalanceCostCenter] = useState(null);
    const [serverError, setServerError] = useState(null);

    const addLedgerMutation = useMutation(ledgerServices.add, {
        onSuccess: () => {
            queryClient.invalidateQueries('ledgers-list');
            enqueueSnackbar('Ledger created successfully',{variant : 'success',autoHideDuration:2000});
            toggleOpen(false);
        },
        onError: (err) => {
            if (err.response.status === 400) {
                setServerError(err.response?.data?.validation_errors);
            } else {
                enqueueSnackbar(err.response?.data?.message, { variant: 'error' });
            }
        }
    });

    const updateLedgerMutation = useMutation(ledgerServices.update, {
        onSuccess: () => {
            queryClient.invalidateQueries('ledgers-list');
            enqueueSnackbar('Ledger updated successfully',{variant : 'success',autoHideDuration:2000});
            toggleOpen(false);
        },
        onError: (err) => {
            if (err.response.status === 400) {
                setServerError(err.response?.data?.validation_errors);
            } else {
                enqueueSnackbar(err.response?.data?.message, { variant: 'error' });
            }
        }
    });

    const saveMutation = React.useMemo(() => {
        return ledger?.id ? updateLedgerMutation : addLedgerMutation;
    }, [ledger, updateLedgerMutation, addLedgerMutation]);

    const validationSchema = yup.object({
        name: yup
            .string('Enter Ledger Name')
            .required('Ledger Name is required'),
        ledger_group_id: yup
            .mixed('Select a Ledger group')
            .required('Ledger Group is required'),
        opening_balance: yup
            .number('Enter The Opening Balance').min(0),
        opening_balance_side: yup
            .string('Choose balance side')
            .when('opening_balance', (opening_balance, validationSchema) => {
                    if (opening_balance > 0 ) {
                        return validationSchema.required('Is the balance Credit or Debit');
                    }
                }
            ),
        as_at: yup.string('Enter Balance Date')
            .nullable()
            .when('opening_balance', (opening_balance, validationSchema) => {
                    if (opening_balance > 0 ) {
                        return validationSchema.required('Select the date of the balance you entered');
                    }
                    return validationSchema;
                }
            )
    });

    const { register, setValue, handleSubmit, control, formState:{errors, isSubmitting} } = useForm({
        defaultValues: {
            'name' : ledger?.name ? ledger.name : '',
            'alias' : ledger?.alias ? ledger.alias : '',
            'code' : ledger?.code? ledger.code : '',
            'description' : ledger?.description? ledger.description : '',
            'ledger_group_id' : ledger?.ledger_group ? ledger.ledger_group.id : null,
            'as_at' : authOrganization?.organization?.recording_start_date
        },
        resolver: yupResolver(validationSchema)
    });
    

    useEffect(() => {
      if(ledger?.id){
        setIsFetching(true);
        setValue('id',ledger.id);
        setValue('name',ledger.name);
        setValue('alias',ledger.alias);
        setValue('ledger_group_id',ledger.ledger_group?.id);
        setValue('code',ledger.code);
        setValue('description',ledger.description);

        axios.get(`accounts/ledgers/${ledger.id}/opening_balance_journal`).then((response) => {
            const opening_balance_journal = response.data;
            if(opening_balance_journal){
                setValue('opening_balance',opening_balance_journal.amount);
                setValue('opening_balance_side',(opening_balance_journal.credit_ledger_id === ledger.id && 'credit') || (opening_balance_journal.debit_ledger_id === ledger.id && 'debit'));
                opening_balance_journal.cost_centers.length > 0 && setOpeningBalanceCostCenter(opening_balance_journal.cost_centers[0])
                opening_balance_journal.cost_centers.length > 0 && setValue('cost_center_id',opening_balance_journal.cost_centers[0].id)
            }

            setIsFetching(false);
        }).catch(error => {
            setIsFetching(false);
        });
      }
    }, [ledger]);

    if(isFetching){
        return <LinearProgress/>
    }

    return (
        <>
            <Typography textAlign={'center'} variant="h4" marginTop={2}>{ledger ? `Edit ${ledger.name}` : `Create New Ledger`}</Typography>
            <DialogContent>
                <form autoComplete='off'>
                    <Grid columnSpacing={1} container>
                        <Grid item xs={12}>
                            <Div sx={{mb: 1}}>
                                <TextField
                                    fullWidth
                                    name='name'
                                    label="Ledger Name"
                                    size='small'
                                    error={!!errors.name || !!serverError?.name}
                                    helperText={errors.name?.message || serverError?.name?.[0]}
                                    {...register('name')}
                                />
                            </Div>
                        </Grid>
                        {!openQuickAddLedgerGroup &&
                            <Grid item xs={12} md={6}>
                                <Div sx={{mt: 1, mb: 1}}>
                                    <Controller
                                        control={control}
                                        name="ledger_group_id"
                                        render={({ field: { onChange, value } }) => (
                                        <Autocomplete    
                                            options={
                                                ledger?.ledger_group 
                                                    ? ledgerGroupOptions.filter(
                                                        ledger_group => ledger_group.nature_id === ledger.ledger_group.nature_id
                                                    ) // Edit mode: Only show ledger groups with the same nature_id as the existing ledger
                                                    : ledgerGroupOptions.filter(
                                                        ledger_group => ledger_group.id !== ledger_group.nature_id || [3, 4].indexOf(ledger_group.nature_id) !== -1
                                                    ) // New ledger: original filtering logic
                                            }
                                            size="small"
                                            getOptionLabel={(option) => option.name}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            defaultValue={ledger?.ledger_group}
                                            disabled = { ledger?.ledger_group_id ? true : false }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Ledger Group"
                                                    InputProps={{
                                                        ...params.InputProps, 
                                                        startAdornment: ledger?.ledger_group_id ? '' : 
                                                        <Tooltip title={'Quick Add Group'}>
                                                            <AddOutlined
                                                                onClick={() => setOpenQuickAddLedgerGroup(true)}
                                                                sx={{
                                                                cursor: 'pointer',
                                                                }}
                                                            />
                                                        </Tooltip> 
                                                    }}
                                                    error={!!errors.ledger_group_id}
                                                    helperText={errors.ledger_group_id?.message}
                                                />
                                            )}
                                            value={ledgerGroupOptions.find((option) => option.value === value)}
                                            onChange={(event, newValue) => {
                                                onChange(newValue ? newValue.value : null);
                                                setValue('ledger_group_id',newValue ? newValue.id : null,{
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }}
                                        />
                                        )}
                                    />
                                </Div>
                            </Grid>
                        }
                        {openQuickAddLedgerGroup &&
                            <Grid item xs={12}>
                                <AddQuickLedgerGroup setOpenQuickAddLedgerGroup={setOpenQuickAddLedgerGroup}/>
                            </Grid>
                        }
                        {!openQuickAddLedgerGroup &&
                            <>
                                <Grid item xs={12} md={6}>
                                    <Div sx={{mt: 1, mb: 1}}>
                                        <TextField
                                            fullWidth
                                            name='alias'
                                            label="Alias (Optional)"
                                            size='small'
                                            {...register('alias')}
                                        />
                                        {serverError?.alias && (
                                            <Typography variant="body2" color="error">
                                                {serverError.alias[0]}
                                            </Typography>
                                        )}
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Div sx={{mt: 1, mb: 1}}>
                                        <TextField
                                            fullWidth
                                            name='code'
                                            label="Code (Optional)"
                                            size='small'
                                            {...register('code')}
                                        />
                                        {serverError?.code && (
                                            <Typography variant="body2" color="error">
                                                {serverError.code[0]}
                                            </Typography>
                                        )}
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Div sx={{mt: 1, mb: 1}}>
                                        <TextField
                                            fullWidth
                                            name='description'
                                            label="Description (Optional)"
                                            size='small'
                                            {...register('description')}
                                        />
                                    </Div>
                                </Grid>
                            </>
                        }
                        <Grid item xs={12} marginTop={2}>
                            <Typography variant='h5' textAlign={'center'}>Opening Balance Details</Typography>
                        </Grid>
                    
                        <Grid item xs={12} md={6}>
                            <Div sx={{mt: 1, mb: 3}}>
                                <Controller
                                    name="opening_balance"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            label="Opening Balance (Optional)"
                                            fullWidth
                                            size="small"
                                            value={value}
                                            InputProps={{
                                                inputComponent: CommaSeparatedField,
                                            }}
                                            onChange={(e) => {
                                                setValue('opening_balance',sanitizedNumber(e.target.value),{
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }}
                                        />
                                    )}
                                />  
                            </Div>
                        </Grid>
                        <Grid  item xs={12} md={6} >
                            <Div sx={{mt: 1,mb: 3}} >
                                <Controller
                                    name="opening_balance_side"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <FormControl component="fieldset" error={!!errors.opening_balance_side}>
                                            <RadioGroup row value={value} onChange={onChange}>
                                                <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                                                <FormControlLabel value="debit" control={<Radio/>} label="Debit"/>
                                            </RadioGroup>
                                            <FormHelperText>{errors.opening_balance_side?.message}</FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <DateTimePicker
                                    label="As at (MM/DD/YYYY)"
                                    fullWidth
                                    readOnly={true}
                                    value={dayjs(authOrganization?.organization?.recording_start_date)}
                                    slotProps={{ 
                                        textField:{
                                            size: 'small',
                                            fullWidth: true
                                        }
                                    }}
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Div sx={{mt: 1, mb: 1}}>
                                <CostCenterSelector
                                    label="Cost Centers"
                                    multiple={false}
                                    defaultValue={!!openingBalanceCostCenter && openingBalanceCostCenter}
                                    onChange={(newValue) =>{
                                        setValue('cost_center_id', newValue ? newValue.id : null);
                                    }}
                                />
                            </Div>
                        </Grid>
                    </Grid>
                </form> 
            </DialogContent>
            <DialogActions>
                <Button size="small" variant='outlined' onClick={() => toggleOpen(false)}>
                    Cancel
                </Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    onClick={handleSubmit(saveMutation.mutate)}
                    sx={{ display: 'flex'}}
                    loading={isSubmitting || saveMutation.isLoading}
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </>
    );
}