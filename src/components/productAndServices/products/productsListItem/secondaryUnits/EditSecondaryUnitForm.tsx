import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Grid,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Div from '@jumbo/shared/Div/Div';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import productServices from '../../product-services';

const EditSecondaryUnitForm = ({ product, setOpenDialog, unit }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: updateUnit, isLoading } = useMutation(productServices.updateUnit, {
    onSuccess: (data) => {
      setOpenDialog(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['secondaryUnits']);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    },
  });

  const saveMutation = React.useMemo(() => {
    return updateUnit;
  }, [updateUnit]);

  const validationSchema = yup.object({
    conversion_factor: yup.number().required('Conversion factor').typeError(`Conversion factor`),
  })

  const {setValue, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
        id: product.id,
        measurement_unit_id: unit.id,
        conversion_factor: unit.conversion_factor,
    },
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit(saveMutation)}>
      <DialogTitle textAlign={'center'}>{`Edit: ${unit.name}`}</DialogTitle>
        <DialogContent>
            <Grid container columnSpacing={1}>
                <Grid item xs={12} md={7}>
                    <Div sx={{ mt: 1, mb: 1 }}>
                        <TextField
                            size="small"
                            fullWidth
                            defaultValue={unit.name}
                            label="Conversion factor"
                            InputProps={{
                                readOnly: true,
                              }}
                            
                        />
                    </Div>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Div sx={{ mt: 1}}>
                        <TextField
                            size="small"
                            fullWidth
                            defaultValue={unit.conversion_factor}
                            error={errors && !!errors?.conversion_factor}
                            helperText={errors && errors.conversion_factor?.message}
                            label="Conversion factor"
                            onChange={(e) => {
                                setValue(`conversion_factor`,e.target.value ? sanitizedNumber(e.target.value ): '',{
                                    shouldValidate: true,
                                    shouldDirty: true
                                });
                            }}
                        />
                    </Div>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button size="small" onClick={() => setOpenDialog(false)}>
                Cancel
            </Button>
            <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                sx={{ display: 'flex' }}
                loading={isLoading}
            >
                Submit
            </LoadingButton>
        </DialogActions>
    </form>
  );
};

export default EditSecondaryUnitForm;
