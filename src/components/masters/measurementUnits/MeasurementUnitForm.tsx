import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import measurementUnitServices from './measurement-unit-services';
import { useSnackbar } from 'notistack';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Div } from '@jumbo/shared';
import { MeasurementUnit } from './MeasurementUnitType';

interface MeasurementUnitFormProps {
  setOpenDialog: (open: boolean) => void;
  measurementUnit?: MeasurementUnit | null;
}

interface FormData extends Omit<MeasurementUnit, 'id'> {
  id?: number;
}

interface ApiResponse {
  message: string;
  validation_errors?: {
    name?: string;
    symbol?: string;
  };
}

const MeasurementUnitForm: React.FC<MeasurementUnitFormProps> = ({ setOpenDialog, measurementUnit = null }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: addMeasurementUnit, isPending, error } = useMutation<ApiResponse, any, FormData>({
    mutationFn: measurementUnitServices.add,
    onSuccess: (data) => {
      setOpenDialog(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['measurementUnits'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
        variant: 'error',
      });
    },
  });

  const { mutate: updateMeasurementUnit, isPending: updateIsLoading, error: updateError } = useMutation<ApiResponse, any, FormData>({
    mutationFn: measurementUnitServices.update,
    onSuccess: (data) => {
      setOpenDialog(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['measurementUnits'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
        variant: 'error',
      });
    },
  });

  const saveMutation = React.useMemo(() => {
    return measurementUnit?.id ? updateMeasurementUnit : addMeasurementUnit;
  }, [measurementUnit, updateMeasurementUnit, addMeasurementUnit]);

  const validationSchema = yup.object({
    name: yup.string().required('Unit Name is required'),
    symbol: yup.string().required('Unit symbol is required').max(10, 'Symbol cannot exceed 10 characters'),
    description: yup.string().nullable(),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      name: measurementUnit?.name || '',
      symbol: measurementUnit?.symbol || '',
      description: measurementUnit?.description || '',
    },
  });

  useEffect(() => {
    if (measurementUnit?.id) {
      setValue('id', measurementUnit.id);
    }
  }, [measurementUnit, setValue]);

  const onSubmit = (data: FormData) => {
    saveMutation(data);
  };

  return (
    <>
      <DialogTitle>
        <Grid size={12} textAlign={"center"}>
          {!measurementUnit?.id ? 'New Measurement Unit' : `Edit ${measurementUnit.name}`}
        </Grid>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 8}}>
              <Div sx={{ mt: 1, mb: 1 }}>
                <TextField
                  label='Unit Name'
                  size='small'
                  fullWidth
                  error={!!errors.name || !!error?.response?.data?.validation_errors?.name || !!updateError?.response?.data?.validation_errors?.name}
                  helperText={errors.name?.message || error?.response?.data?.validation_errors?.name || updateError?.response?.data?.validation_errors?.name}
                  {...register('name')}
                />
              </Div>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Div sx={{ mt: 1, mb: 1 }}>
                <TextField
                  label='Unit Symbol'
                  size='small'
                  fullWidth
                  error={!!errors.symbol || !!error?.response?.data?.validation_errors?.symbol || !!updateError?.response?.data?.validation_errors?.symbol}
                  helperText={errors.symbol?.message || error?.response?.data?.validation_errors?.symbol || updateError?.response?.data?.validation_errors?.symbol}
                  {...register('symbol')}
                />
              </Div>
            </Grid>
            <Grid size={12}>
              <Div sx={{ mt: 1, mb: 1 }}>
                <TextField
                  label='Description'
                  size='small'
                  multiline
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
              loading={isPending || updateIsLoading}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

export default MeasurementUnitForm;