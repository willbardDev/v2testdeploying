import Div from '@jumbo/shared/Div/Div'
import { LoadingButton } from '@mui/lab'
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { AddOutlined } from '@mui/icons-material';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import StakeholderSelector from 'app/prosServices/prosERP/masters/stakeholders/StakeholderSelector';
import StakeholderQuickAdd from 'app/prosServices/prosERP/masters/stakeholders/StakeholderQuickAdd';
import projectsServices from '../../projectsServices';
import { useProjectProfile } from '../ProjectProfileProvider';
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';

function SubcontractForm({setOpenDialog, subContract = null }) {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { project } = useProjectProfile();
    const { authOrganization : {organization}, checkOrganizationPermission } = useJumboAuth();
    const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
    const [addedStakeholder, setAddedStakeholder] = useState(null);

    const { mutate: addSubcontract, isLoading } = useMutation(projectsServices.addSubcontract, {
        onSuccess: (data) => {
            setOpenDialog(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['subcontracts']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response.data.message, {
                variant: 'error',
            });
        },
    });

    const { mutate: updateSubcontract, isLoading: updateIsLoading } = useMutation(projectsServices.updateSubcontract, {
        onSuccess: (data) => {
            setOpenDialog(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['subcontracts']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response.data.message, {
                variant: 'error',
            });
        },
    });

    const saveMutation = React.useMemo(() => {
        return subContract?.id ? updateSubcontract : addSubcontract;
    }, [subContract, updateSubcontract, addSubcontract]);

    const validationSchema = yup.object({
        subcontractor_id: yup.number().required("Sub Contractor Name is required").typeError('Sub Contractor Name is required'),
    }); 

    const { register, handleSubmit, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            id: subContract?.id,
            project_id: project?.id,
            subcontractor_id: subContract?.subcontractor_id,
            commencement_date: subContract?.commencement_date ?? null,
            completion_date: subContract?.completion_date ?? null,
            currency_id: subContract ? subContract?.currency_id : 1,
            exchange_rate: subContract ? subContract?.exchange_rate : 1,
            reference: subContract?.reference,
            remarks: subContract?.remarks,
        },
    });

    // setvalues from coming addedStakeholder
    useEffect(() => {
        if(addedStakeholder?.id){
            setValue('subcontractor_id', addedStakeholder.id);
            setStakeholderQuickAddDisplay(false)
        }
    }, [addedStakeholder])

  return (
    <form autoComplete="off" onSubmit={handleSubmit(saveMutation)}>
      {!stakeholderQuickAddDisplay && 
        <DialogTitle textAlign={'center'}>{subContract ? `Edit: ${subContract.subcontractNo}` : 'New Sub Contract'}</DialogTitle>
      }
      <DialogContent>
        <Grid container spacing={1}>
          {!stakeholderQuickAddDisplay &&
            <Grid item md={4} xs={12} >
              <Div sx={{ mt: 1, mb: 1 }}>
                <StakeholderSelector
                  label='Sub Contractor Name'
                  defaultValue={subContract && subContract.subcontractor_id}
                  frontError={errors?.subcontractor_id}
                  addedStakeholder={addedStakeholder}
                  onChange={(newValue) => {
                    newValue ? setValue('subcontractor_id', newValue.id,{
                      shouldDirty: true,
                      shouldValidate: true
                    }) : setValue('subcontractor_id','',{
                      shouldDirty: true,
                      shouldValidate: true
                    });
                  }}
                  startAdornment= {
                    checkOrganizationPermission(PERMISSIONS.STAKEHOLDERS_CREATE) && (
                        <Tooltip title="Add Contractor">
                            <AddOutlined
                                onClick={() => setStakeholderQuickAddDisplay(true)}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Tooltip>
                    )
                  }
                />
              </Div>
            </Grid>
          }

          {stakeholderQuickAddDisplay && <StakeholderQuickAdd setStakeholderQuickAddDisplay={setStakeholderQuickAddDisplay} create_payable={true} setAddedStakeholder={setAddedStakeholder}/>} 

            {!stakeholderQuickAddDisplay &&
                <>
                    <Grid item md={4} xs={12}>
                        <Div sx={{ mt: 1}}>
                            <CurrencySelector
                                frontError={errors?.currency_id}
                                defaultValue={subContract ? subContract.currency_id : 1}
                                onChange={(newValue) => {
                                    setValue('currency_id', newValue ? newValue.id : null, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    }
                                );

                                clearErrors('exchange_rate');

                                setValue('exchange_rate', newValue?.exchangeRate ? newValue.exchangeRate : 1);
                                }}
                            />
                        </Div>
                    </Grid>
                    {
                        watch('currency_id') > 1 && (
                            <Grid item md={4} xs={12}>
                                <Div sx={{ mt: 1}}>
                                    <TextField
                                        label="Exchange Rate"
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            inputComponent: CommaSeparatedField,
                                        }}
                                        value={watch('exchange_rate')}
                                        onChange={(e) => {
                                            setValue(`exchange_rate`, e.target.value ? sanitizedNumber(e.target.value) : null, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} md={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <TextField
                                label="Reference"
                                size="small"
                                fullWidth
                                defaultValue={subContract?.reference}
                                {...register('reference')}
                            />
                        </Div>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <DateTimePicker
                                label='Commencement Date'
                                fullWidth
                                minDate={dayjs(organization.recording_start_date)}
                                defaultValue={subContract && !!subContract.commencement_date ? dayjs(subContract.commencement_date) : null}
                                slotProps={{
                                    textField : {
                                        size: 'small',
                                        fullWidth: true,
                                        readOnly: true,
                                    }
                                }}
                                onChange={(newValue) => {
                                    setValue('commencement_date', newValue ? newValue.toISOString() : null,{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <DateTimePicker
                                label='Completion Date'
                                fullWidth
                                minDate={dayjs(watch(`commencement_date`))}
                                defaultValue={subContract && !!subContract.completion_date ? dayjs(subContract.completion_date) : null}
                                slotProps={{
                                    textField : {
                                        size: 'small',
                                        fullWidth: true,
                                        readOnly: true,
                                    }
                                }}
                                onChange={(newValue) => {
                                    setValue('completion_date', newValue ? newValue.toISOString() : null,{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={watch('currency_id') > 1 ? 12 : 4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <TextField
                                label="Remarks"
                                size="small"
                                defaultValue={subContract?.remarks}
                                multiline={true}
                                minRows={2}
                                fullWidth
                                {...register('remarks')}
                            />
                        </Div>
                    </Grid>
                </>
            }
        </Grid>
      </DialogContent>
      <DialogActions>
            <Button size="small" onClick={() => setOpenDialog(false)}>
                Cancel
            </Button>
            {!stakeholderQuickAddDisplay &&
                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{ display: 'flex' }}
                    loading={isLoading || updateIsLoading}
                >
                    Submit
                </LoadingButton>
            }
      </DialogActions>        
    </form>
  )
}

export default SubcontractForm