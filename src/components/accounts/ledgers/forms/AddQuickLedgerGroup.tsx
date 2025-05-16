import React, { useState } from "react";
import { Autocomplete, Box, Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useLedgerGroup } from "../../ledgerGroups/LedgerGroupProvider";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/services/config";

interface LedgerGroupFormData {
  name: string;
  alias?: string;
  parentGroupId: string;
  description?: string;
}

interface LedgerGroupOption {
  id: number;
  name: string;
  [key: string]: any; // Additional properties if needed
}

interface AddQuickLedgerGroupProps {
  setOpenQuickAddLedgerGroup: (open: boolean) => void;
}

export default function AddQuickLedgerGroup({ setOpenQuickAddLedgerGroup }: AddQuickLedgerGroupProps) {
    const { ledgerGroupOptions, ledgerGroupOptionIds, isLoading } = useLedgerGroup();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<Record<string, string[]> | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const [isPosting, setIsPosting] = useState(false);

    const storeLedgerGroup = (data: LedgerGroupFormData) => {
        setIsPosting(true);
        axios.get('/sanctum/csrf-cookie').then(() => {
            axios.post('/accounts/ledger_group', data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar(res.data.message, { variant: 'success' });
                }
                queryClient.invalidateQueries({ queryKey: ['fetchLedgerGroups'] });
                setIsPosting(false);
                setOpenQuickAddLedgerGroup(false);
            }).catch((err: any) => {
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
            .string()
            .required('Ledger Group Name is required'),
        parentGroupId: yup
            .mixed()
            .oneOf(ledgerGroupOptionIds, 'Please select a group from the given options')
            .required('Parent Group is required')
    });

    const { 
        handleSubmit, 
        register, 
        setValue, 
        formState: {errors} 
    } = useForm<LedgerGroupFormData>({
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            name: '',
            alias: '',
            parentGroupId: '',
            description: ''
        }
    });

    const handleFormSubmit = (data: LedgerGroupFormData) => {
        storeLedgerGroup(data);
    };

    return (
        <>
            <Typography variant="h6" textAlign={'center'}>
                Quick Add Ledger Group
            </Typography>
            {isLoading ? <LinearProgress /> : (
                <Grid container spacing={1} component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Ledger Group Name"
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register('name')}
                        />
                        {serverError?.name && (
                            <Typography variant="body2" color="error">
                                {serverError.name[0]}
                            </Typography>
                        )}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <TextField
                            fullWidth
                            label="Alias (optional)"
                            size="small"
                            {...register('alias')}
                        />
                        {serverError?.alias && (
                            <Typography variant="body2" color="error">
                                {serverError.alias[0]}
                            </Typography>
                        )}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Autocomplete
                            getOptionLabel={(option: LedgerGroupOption) => option?.name || ''}
                            isOptionEqualToValue={(option: LedgerGroupOption, value: LedgerGroupOption) => 
                                option.id === value.id
                            }
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
                            onChange={(e, newValue: LedgerGroupOption | null) => {
                                setValue('parentGroupId', newValue ? String(newValue.id) : '', {
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                            }}
                        />
                        {serverError?.parentGroupId && (
                            <Typography variant="body2" color="error">
                                {serverError.parentGroupId[0]}
                            </Typography>
                        )}
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Description (optional)"
                            size="small"
                            multiline
                            minRows={2}
                            {...register('description')}
                        />
                        {serverError?.description && (
                            <Typography variant="body2" color="error">
                                {serverError.description[0]}
                            </Typography>
                        )}
                    </Grid>
                    <Grid size={12}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Button 
                                size="small" 
                                onClick={() => setOpenQuickAddLedgerGroup(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <LoadingButton
                                type="submit"
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