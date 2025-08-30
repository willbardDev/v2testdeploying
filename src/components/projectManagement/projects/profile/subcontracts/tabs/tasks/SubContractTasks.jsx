import Div from '@jumbo/shared/Div'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Button, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, LinearProgress, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useMutation,  useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { DateTimePicker } from '@mui/x-date-pickers'
import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import projectsServices from '../../../../projectsServices'
import { useProjectProfile } from '../../../ProjectProfileProvider'
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers'
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField'
import LedgerSelect from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelect'
import { useLedgerSelect } from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelectProvider'

function SubContractTasks({setOpenDialog, subContract = null, subContractTask = null, existingTasks}) {
  const queryClient = useQueryClient();
  const {enqueueSnackbar} = useSnackbar();
  const { ungroupedLedgerOptions } = useLedgerSelect();
  const {authOrganization: {organization}} = useJumboAuth();
  const [isRetrievingDetails, setIsRetrievingDetails] = useState(false);
  const { deliverable_groups, setFetchDeliverables, projectTimelineActivities, setFetchTimelineActivities} = useProjectProfile();
  const [unitToDisplay, setUnitToDisplay] = useState(subContractTask ? subContractTask.project_task.measurement_unit.symbol : null);

  useEffect(() => {
    if (!deliverable_groups) {
      setFetchDeliverables(true);
    } else {
      setFetchDeliverables(false)
    }

    if (!projectTimelineActivities) {
      setFetchTimelineActivities(true);
    } else {
      setFetchTimelineActivities(false)
    }

  }, [projectTimelineActivities, setFetchTimelineActivities]);

  const addSubContractTask = useMutation(projectsServices.addSubContractTask,{
    onSuccess: (data) => {
      data?.message && enqueueSnackbar(data.message,{variant:'success'});
      queryClient.invalidateQueries('subContractTasks');
      setOpenDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
    }
  }); 
  
  const updateSubContractTask = useMutation(projectsServices.updateSubContractTask,{
    onSuccess: (data) => {
      data?.message && enqueueSnackbar(data.message,{variant:'success'});
      queryClient.invalidateQueries('subContractTasks');
      setOpenDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
    }
  });

  const saveMutation = React.useMemo(() => {
    return subContractTask ? updateSubContractTask.mutate : addSubContractTask.mutate;
}, [addSubContractTask, updateSubContractTask, subContractTask]);

  const validationSchema = yup.object({
    rate: yup.number().required("Rate is required").typeError('Rate is required'),
    expense_ledger_id: yup.number().required("Expense Ledger is required").typeError('Expense Ledger is required'),
    project_task_id: yup
    .number()
    .required("Project Task is required")
    .typeError('Project Task is required')
    .test(
      'unique-task',
      'This Task is already in Subcontract',
      function (value) {
        const { existingTasks, subContractTask } = this.options.context;
        
        const isTaskExist = existingTasks?.some(task => {
          if (subContractTask && subContractTask.project_task.id === task.id) {
            return false;
          }
          return task.id === value;
        });
  
        return !isTaskExist; 
      }
    ),  
    quantity: yup
      .number()
      .required("Quantity is required")
      .typeError('Quantity is required')
      .test(
        'max-quantity',
        function (value) {
          const originalQuantity = this.parent.unsubcontracted_quantity;
          
          if (value > originalQuantity) {
            return this.createError({
              message: `Quantity should not exceed Project Task Quantity. ${originalQuantity} remaining.`
            });
          }
          return true;
        }
      ),
  });

  const { handleSubmit, setValue, register, formState: { errors }, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: subContractTask?.id,
      project_subcontract_id: subContractTask ? subContractTask.project_subcontract_id : subContract?.id,
      expense_ledger_id: subContractTask?.expense_ledger_id,
      project_task_id: subContractTask?.project_task_id,
      unsubcontracted_quantity: subContractTask ? subContractTask.unsubcontracted_quantity : null,
      quantity: subContractTask?.quantity,
      rate: subContractTask?.rate,
      start_date: subContractTask && subContractTask.start_date ? dayjs(subContractTask.start_date).toISOString() : null,
      end_date: subContractTask && subContractTask.end_date ? dayjs(subContractTask.end_date).toISOString() : null,
      remarks: subContractTask?.remarks,
    },
    context: { existingTasks, subContractTask }
  });  

  const retrieveTaskDetails = async (taskId) => {
    setIsRetrievingDetails(true);
    const details =  await projectsServices.showTaskDetails(taskId)
    setValue('unsubcontracted_quantity', details?.unsubcontracted_quantity);
    setIsRetrievingDetails(false);
  }

  const getTaskOptions = (activities, depth = 0) => {
    if (!Array.isArray(activities)) {
      return [];
    }
  
    return activities.flatMap(activity => {
      const { children, tasks } = activity;
  
      const tasksOptions = (tasks || []).map(task => ({
        id: task.id,
        name: task.name,
        handlers: task.handlers,
        dependencies: task.dependencies,
        quantity: task.quantity,
        measurement_unit: task.measurement_unit,
        start_date: dayjs(task.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(task.end_date).format('YYYY-MM-DD'),
        weighted_percentage: task.weighted_percentage,
        project_deliverable_id: task.project_deliverable_id
      }));
  
      const tasksFromgroupChildren = getTaskOptions(children, depth + 1);
  
      return [...tasksOptions, ...tasksFromgroupChildren];
    });
  };

  const allTasks = getTaskOptions(projectTimelineActivities);

  useEffect(() => {
    if (watch(`quantity`) > 0) {
      setValue(`quantity`, watch(`quantity`),{
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [watch(`unsubcontracted_quantity`)])

  return (
    <>
      <DialogTitle textAlign={'center'}>
        {subContractTask ? `Edit SubContract Task` : `New Subcontract Task`}
      </DialogTitle>
      <DialogContent>
        <form autoComplete='false'>
          <Grid container  columnSpacing={1} marginBottom={2}>
            <Grid item xs={12} md={6}>
              <Div sx={{ mt: 1 }}>
                <Autocomplete
                  options={allTasks}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.name}
                  defaultValue={subContractTask?.project_task}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project Task"
                      size="small"
                      fullWidth
                      error={!!errors?.project_task_id}
                      helperText={errors?.project_task_id?.message}
                    />
                  )}
                  onChange={(e, newValue) => {
                    if (!!newValue) {
                      setUnitToDisplay(newValue.measurement_unit.symbol)
                      setValue('unsubcontracted_quantity', newValue.quantity)
                      setValue('project_task_id',!!newValue && newValue.id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      retrieveTaskDetails({ taskId: newValue.id });
                    } else {
                      setUnitToDisplay(null)
                      setValue('project_task_id',null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                )}
                />
              </Div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Div sx={{mt: 1}}>
                <LedgerSelect
                  label='Expense'
                  frontError={errors.expense_ledger_id}
                  allowedGroups={['Expenses']}
                  defaultValue={subContractTask && ungroupedLedgerOptions?.find(ledger => ledger.id === subContractTask?.expense_ledger_id)}
                  onChange={(newValue) => {
                    setValue('expense_ledger_id', newValue ? newValue.id : 0,{
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Div sx={{ mt: 1 }}>
                {isRetrievingDetails ? (
                  <LinearProgress />
                ) : (
                  <TextField
                    label="Quantity"
                    fullWidth
                    size="small"
                    defaultValue={watch(`quantity`)}
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                      endAdornment: (
                        <InputAdornment position="end">
                          {unitToDisplay}
                        </InputAdornment>
                      ),
                    }}
                    error={errors && !!errors?.quantity}
                    helperText={errors && errors?.quantity?.message}
                    onChange={(e) => {
                      setValue(`quantity`, e.target.value ? sanitizedNumber(e.target.value) : 0, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                )}
              </Div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Div sx={{mt: 1}}>
                <TextField
                  label="Rate"
                  fullWidth
                  size="small"
                  defaultValue={subContractTask?.rate}
                  InputProps={{
                      inputComponent: CommaSeparatedField,
                  }}
                  error={errors && !!errors?.rate}
                  helperText={errors && errors?.rate?.message}
                  onChange={(e) => {
                    setValue(`rate`,e.target.value ? sanitizedNumber(e.target.value) : 0,{
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item md={6} xs={12}>
              <Div sx={{ mt: 1 }}>
                <DateTimePicker
                  label='Start Date'
                  fullWidth
                  minDate={dayjs(organization.recording_start_date)}
                  value={watch('start_date') ? dayjs(watch('start_date')) : null}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      readOnly: true,
                      error: !!errors?.start_date,
                      helperText: errors?.start_date?.message,
                    },
                  }}
                  onChange={(newValue) => {
                    const startDate = newValue ? newValue.toISOString() : null;
                    setValue('start_date', startDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item md={6} xs={12}>
              <Div sx={{ mt: 1 }}>
                <DateTimePicker
                  label='End Date'
                  fullWidth
                  minDate={watch('start_date') ? dayjs(watch('start_date')) : null}
                  value={watch('end_date') ? dayjs(watch('end_date')) : null}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      readOnly: true,
                      error: !!errors?.end_date,
                      helperText: errors?.end_date?.message,
                    },
                  }}
                  onChange={(newValue) => {
                    setValue('end_date', newValue ? newValue.toISOString() : null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item xs={12} md={12}>
              <Div sx={{ mt: 1}}>
                <TextField
                  label="Remarks"
                  size="small"
                  defaultValue={subContractTask?.remarks}
                  error={errors && !!errors?.remarks}
                  helperText={errors && errors?.remarks?.message}
                  multiline={true}
                  minRows={2}
                  fullWidth
                  {...register('remarks')}
                />
              </Div>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
          <Button size='small' onClick={() => setOpenDialog(false)}>
              Cancel
          </Button>
          <LoadingButton
              type='submit'
              onClick={handleSubmit(saveMutation)}
              loading={addSubContractTask.isLoading || updateSubContractTask.isLoading}
              size="small"
              variant='contained'
          >Submit</LoadingButton>
      </DialogActions>
    </>
  )
}

export default SubContractTasks