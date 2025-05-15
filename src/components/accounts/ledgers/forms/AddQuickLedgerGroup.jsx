import React, { useState } from "react";
import { Autocomplete, Box, Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import axios from "app/services/config";
import { useSnackbar } from "notistack";
import { useQueryClient } from "react-query";
import { useLedgerGroup } from "../../ledgerGroups/LedgerGroupProvider";

export default function AddQuickLedgerGroup({ setOpenQuickAddLedgerGroup }) {
    const { ledgerGroupOptions, ledgerGroupOptionIds, isLoading } = useLedgerGroup();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [isPosting, setIsPosting] = useState(false);

    const storeLedgerGroup = (data) => {
        setIsPosting(true);
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/accounts/ledger_group', data).then(res => {
                if (res.status === 200) {
                    enqueueSnackbar(res.data.message, { variant: 'success' });
                }
                queryClient.invalidateQueries('fetchLedgerGroups');
                setIsPosting(false);
                setOpenQuickAddLedgerGroup(false);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status === 400) {
                        setServerError(err.response?.data?.validation_errors);
                    } else {
                        enqueueSnackbar(err.response?.data?.message, { variant: 'error' });
                    }
                }
                setIsPosting(false);
            });
        });
    };

    const validationSchema = yup.object({
        name: yup
            .string('Enter your Organization Name')
            .required('Ledger Group Name is required'),
        parentGroupId: yup
            .mixed('Select a parent group')
            .oneOf(ledgerGroupOptionIds, 'Please select a group from the given options')
            .required('Parent Group is required')
    });

    const { handleSubmit, register, setValue, formState: {errors} } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            alias: '',
            parentGroupId: '',
            description: ''
        }
    });

    const handleFormSubmit = (data) => {
        storeLedgerGroup(data);
    };

    return (
        <>
            <Typography variant="h6" textAlign={'center'}>
                Quick Add Ledger Group
            </Typography>
            {isLoading ? <LinearProgress /> : (
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth
                            label="Ledger Group Name"
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register('name')}
                        />
                        <span style={{ color: 'red' }}>{serverError?.name}</span>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Alias (optional)"
                            size="small"
                            {...register('alias')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            getOptionLabel={(option) => option?.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={ledgerGroupOptions}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Parent Group"
                                    error={!!errors.parentGroupId}
                                    helperText={errors.parentGroupId?.message}
                                />
                            )}
                            onChange={(e,newValue) => {
                                setValue(`parentGroupId`, String(newValue?.id),{
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                            }}
                        />
                        <span style={{ color: 'red' }}>{serverError?.parentGroupId}</span>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth
                            label="Description (optional)"
                            size="small"
                            multiline
                            minRows={2}
                            {...register('description')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Button size="small" onClick={() => setOpenQuickAddLedgerGroup(false)}>
                                Cancel
                            </Button>
                            <LoadingButton
                                onClick={handleSubmit(handleFormSubmit)}
                                variant="contained"
                                size="small"
                                loading={isPosting}
                            >
                                Add
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </>
    );
}
