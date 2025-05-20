import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Div from '@jumbo/shared/Div/Div';
import { LoadingButton } from '@mui/lab';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import approvalChainsServices from '../approvalChainsServices';
import ApprovalChainsItemForm from './ApprovalChainsItemForm';
import ApprovalChainsItemRow from './ApprovalChainsItemRow';
import CostCenterSelector from '../../costCenters/CostCenterSelector';
import { PROCESS_TYPES } from 'app/utils/constants/processTypes';
import { HighlightOff } from '@mui/icons-material';

function ApprovalChainForm({toggleOpen }) {
  const [items, setItems] = useState([]);
  const [serverError, setServerError] = useState(null);
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [submitItemForm, setSubmitItemForm] = useState(false);

  const validationSchema = yup.object({
    process_type: yup.string().required('Process Type is required').typeError('Process Type is required'),
  });

  const { handleSubmit, setError, setValue, register, formState : {errors}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {}
  });

  const addApprovalChains = useMutation(approvalChainsServices.addApprovalChains,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvalChains']);
    },
    onError: (err) => {
      if (err.response.status === 400) {
          setServerError(err.response?.data?.validation_errors);
      } else {
          enqueueSnackbar(err.response?.data?.message, { variant: 'error' });
      }
    }
  })

  const saveMutation = React.useMemo(() => {
    return addApprovalChains
  },[addApprovalChains]);

  useEffect(() => {
    setValue(`levels`, items);
  }, [items]);

  const onSubmit = (data) => {
    if (items.length === 0) {
      setError(`items`, {
        type: "manual",
        message: "You must add at least one item",
      });
      return;
    } else if (isDirty) {
      setShowWarning(true);
    } else {
      handleSubmit((data) => saveMutation.mutate(data))();
    }
  };  

  const handleConfirmSubmitWithoutAdd = () => {
    handleSubmit((data) => saveMutation.mutate(data))();
    setIsDirty(false);
    setShowWarning(false);
    setClearFormKey(prev => prev + 1)
  };

  return (
    <React.Fragment>
      <DialogTitle>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} textAlign={"center"} mb={2}>
            {'New Approval Chain'}
          </Grid>
          <Grid item xs={12} mb={1}>
            <form autoComplete='off'>
              <Grid container columnSpacing={1} rowSpacing={2}>
                <Grid item xs={12} md={4}>
                  <Div sx={{  mt: 0.3  }}>
                    <Autocomplete
                      id="checkboxes-process_type"
                      options={PROCESS_TYPES}
                      isOptionEqualToValue={(option, value) => option === value}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Process Type"
                          size="small"
                          fullWidth
                          error={!!errors.process_type}
                          helperText={errors.process_type?.message}
                        />
                      )}
                      onChange={(e, newValue) => {
                        setServerError(null);
                        setValue('process_type', newValue ? newValue : null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Div sx={{ mt: 0.3 }}>
                    <CostCenterSelector
                      multiple={false}
                      withNotSpecified={true}
                      label="Cost Center"
                      onChange={(newValue) => {
                        setServerError(null);
                        setValue('cost_center_id', newValue.id);
                    }}
                    />
                  </Div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Div sx={{ mt: 0.3 }}>
                    <TextField
                      label="Remarks"
                      size="small"
                      multiline={true}
                      minRows={2}
                      fullWidth
                      {...register('remarks')}
                    />
                  </Div>
                </Grid>
                <Grid item xs={12}>
                  {serverError?.process_type && (
                    <Typography variant="body2" color="error" textAlign={{md: 'center'}}>
                      {serverError.process_type[0]}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <ApprovalChainsItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} setItems={setItems} items={items}/>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {
          errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
        }
        {
          items.map((item,index) => (
            <ApprovalChainsItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} index={index} setItems={setItems} items={items} item={item} />
          ))
        }

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
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={addApprovalChains.isLoading}
          variant='contained' 
          onClick={handleSubmit(onSubmit)}
          size='small'
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </React.Fragment>
  )
}

export default ApprovalChainForm