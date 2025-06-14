import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Grid,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  Tooltip,
  IconButton,
  DialogTitle,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Div from '@jumbo/shared/Div/Div';
import { AddOutlined, DisabledByDefault } from '@mui/icons-material';
import { useProductApp } from '../../ProductsProvider';
import { useProductsSelect } from '../../ProductsSelectProvider';
import productServices from '../../product-services';

const SecondaryUnitForm = ({ product, setOpenDialog }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { measurementUnits} = useProductApp();
  const { productOptions } = useProductsSelect();

  const { mutate: addSecondaryUnit, isLoading } = useMutation(productServices.addSecondaryUnit, {
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
    return addSecondaryUnit;
  }, [addSecondaryUnit]);

  const validationSchema = yup.object({
    secondary_units: yup.array().of(
      yup.object().shape({
        measurement_unit_id: yup.string().required('Measurement Unit Required').typeError(`Measurement Unit Required`),
        conversion_factor: yup.number().required('Conversion factor').typeError(`Conversion factor`),
      })
    )
  })

  const {
    control,
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: product.id,
      secondary_units: [{measurement_unit_id: '', conversion_factor: ''}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'secondary_units',
  });

  const selectedProduct = productOptions.find(p => p.id === product.id)

  return (
    <>
      <DialogTitle textAlign={'center'}>Add Secondary Units</DialogTitle>
      <DialogContent>
        <form autoComplete="off">
          <Grid container columnSpacing={1}>
            <Grid item xs={12}>
              {fields.map((field, index) => (
                <Grid key={index} container columnSpacing={1} marginTop={1}>
                  <Grid item xs={11}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={12} md={6}>
                        <Div sx={{mt: 1}}>
                          <Autocomplete
                            id={`secondary_units-measurement_unit_id-${index}`}
                            size="small"
                            getOptionLabel={(option) => 
                              option.name !== option.symbol ? `${option.name} (${option.symbol})` : option.name
                            }
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={measurementUnits.filter(measurementUnit => 
                              measurementUnit.id !== product.measurement_unit_id && 
                              !selectedProduct.secondary_units.some(unit => unit.id === measurementUnit.id) 
                            )}
                            renderInput={(params) => (
                              <TextField 
                                {...params} 
                                label="Secondary Measurement Unit"
                                error={errors.secondary_units && !!errors?.secondary_units[index]?.measurement_unit_id}
                                helperText={errors.secondary_units && errors.secondary_units[index]?.measurement_unit_id?.message}
                              />
                            )}
                            onChange={async (e,newValue) => {
                              if (newValue) {
                                if(watch('secondary_units').map(item => item.measurement_unit_id).filter(measurement_unit_id => measurement_unit_id === newValue.id).length > 0){
                                  await setValue(`secondary_units.${index}.measurement_unit_id`, newValue.id, {
                                    shouldDirty: true,
                                  });
                                  setError(`secondary_units.${index}.measurement_unit_id`,{
                                    type: 'manual',
                                    message: 'Unit already exists',
                                  });
                                  } else {
                                  await clearErrors(`secondary_units.${index}.measurement_unit_id`)
                                  await setValue(`secondary_units.${index}.measurement_unit_id`, newValue.id, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }
                              } else {
                                setValue(`secondary_units.${index}.measurement_unit_id`, '', {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }
                          }}
                          />
                        </Div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Div sx={{ mt: 1}}>
                          <TextField
                            size="small"
                            fullWidth
                            error={errors.secondary_units && !!errors?.secondary_units[index]?.conversion_factor}
                            helperText={errors.secondary_units && errors.secondary_units[index]?.conversion_factor?.message}
                            label="Conversion factor"
                            {...register(`secondary_units.${index}.conversion_factor`)}
                          />
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {fields.length > 1 && (
                    <Grid item xs={1}>
                      <Div sx={{ mt: 1}}>
                        <Tooltip title="Remove Group">
                          <IconButton size="small" onClick={() => remove(index)}>
                            <DisabledByDefault fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Div>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Grid item xs={12} sx={{ display: 'flex', direction: 'row', justifyContent: 'flex-end' }}>
                <Div sx={{ mt: 1}}>
                  <Tooltip title="Add Group">
                    <Button size="small" variant="outlined" onClick={() => append({measurement_unit_id: '', conversion_factor: ''})}>
                      <AddOutlined fontSize="10" /> Add
                    </Button>
                  </Tooltip>
                </Div>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={() => setOpenDialog(false)}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          onClick={handleSubmit(saveMutation)}
          variant="contained"
          size="small"
          sx={{ display: 'flex' }}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default SecondaryUnitForm;
