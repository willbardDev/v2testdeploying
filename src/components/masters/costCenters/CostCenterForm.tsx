import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Div from '@jumbo/shared/Div/Div';
import * as yup from 'yup';
import costCenterservices from './cost-center-services';
import UsersSelector from '../../sharedComponents/UsersSelector';

const CostCenterForm = ({ setOpenDialog, costCenter = null }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: addCostCenter, isLoading, error } = useMutation(costCenterservices.add, {
    onSuccess: (data) => {
      setOpenDialog(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['costCenters']);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    },
  });

  const { mutate: updateCostCenter, isLoading: updateIsLoading, error: updateError } = useMutation(costCenterservices.update, {
    onSuccess: (data) => {
      setOpenDialog(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['costCenters']);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    },
  });

  const saveMutation = React.useMemo(() => {
    return costCenter?.id ? updateCostCenter : addCostCenter;
  }, [ updateCostCenter, addCostCenter]);

  const validationSchema = yup.object({
    name: yup.string('Enter Cost Center Name').required('Cost Center Name is required'),
    user_ids: yup.array().min(1, 'At least one user is required').typeError('At least one user is required'),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id:costCenter && costCenter.id,
      name: costCenter?.id ? costCenter.name : '',
      description: costCenter?.id ? costCenter.description : '',
      user_ids: costCenter?.id ? costCenter.users.map((user) => user.id) : [],
    },
  });

  return (
    <>
      <DialogTitle>
        <Grid item xs={12} textAlign={"center"}>
        {!costCenter ? 'New Cost Center' : `Edit ${costCenter.name}`}
        </Grid>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={handleSubmit(saveMutation)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Div sx={{ mt: 1}}>
                <TextField
                  name='name'
                  label='Cost Center Name'
                  size='small'
                  fullWidth
                  error={!!errors.name || !!error?.response.data.validation_errors.name || !!updateError?.response.data.validation_errors.name}
                  helperText={errors.name?.message || error?.response.data.validation_errors.name || updateError?.response.data.validation_errors.name}
                  {...register('name')}
                />
              </Div>
            </Grid>
            <Grid item xs={12}>
              <Div sx={{ mt: 1 }}>
                <UsersSelector
                  label='Cost Center Users'
                  multiple={true}
                  defaultValue={costCenter?.users}
                  frontError={errors && errors.user_ids}
                  onChange={(newValue) => {
                    setValue('user_ids', newValue ? newValue.map((user) => user.id) : [], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}      
                />
              </Div>
            </Grid>
            <Grid item xs={12}>
              <Div sx={{ mt: 1}}>
                <TextField
                  name='description'
                  label='Description'
                  size='small'
                  multiline={true}
                  minRows={2}
                  fullWidth
                  {...register('description')}
                />
              </Div>
            </Grid>
          </Grid>
          <DialogActions>
            <Button size='small' onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <LoadingButton  
              type="submit"
              variant="contained"
              size="small"
              sx={{ display: 'flex' }}
              loading={isLoading || updateIsLoading}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

export default CostCenterForm;
