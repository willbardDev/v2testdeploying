import { Autocomplete, Button, DialogActions, DialogTitle, Grid, TextField } from '@mui/material'
import React from 'react'
import Div from '@jumbo/shared/Div/Div';
import { LoadingButton } from '@mui/lab';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { PROCESS_TYPES } from 'app/utils/constants/processTypes';
import approvalChainsServices from '../approvalChainsServices';
import CostCenterSelector from '../../costCenters/CostCenterSelector';

function EditChainDialog({toggleOpen, approvalChain }) {
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();

  const validationSchema = yup.object({
    process_type: yup.string().required('Process Type is required').typeError('Process Type is required'),
  });

  const { handleSubmit, setValue, register, formState : {errors}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
        id: approvalChain.id,
        process_type: approvalChain.process_type,
        remarks: approvalChain.remarks,
        cost_center_id: approvalChain.cost_center_id, 
    }
  });

  const editApprovalChain = useMutation(approvalChainsServices.editApprovalChain,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvalChains']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })

  const saveMutation = React.useMemo(() => {
    return editApprovalChain.mutate
  },[editApprovalChain]);

  const onSubmit = (formData) => {
    saveMutation(formData);
  };

  return (
    <React.Fragment>
      <DialogTitle>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} textAlign={"center"} mb={2}>
            {'Edit Approval Chain'}
          </Grid>
          <Grid item xs={12} mb={1}>
            <form autoComplete='off'>
              <Grid container columnSpacing={1} rowSpacing={2}>
                <Grid item xs={12} md={4}>
                  <Div sx={{  mt: 0.3  }}>
                    <Autocomplete
                      id="checkboxes-process_type"
                      options={PROCESS_TYPES}
                      defaultValue={approvalChain.process_type}
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
                      label="Cost Center"
                      withNotSpecified={true}
                      defaultValue={approvalChain.cost_center}
                      onChange={(newValue) => {
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
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={editApprovalChain.isLoading}
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

export default EditChainDialog