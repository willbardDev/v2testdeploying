import React from 'react';
import {
  useForm,
  Controller,
  useFieldArray,
  FormProvider,
} from 'react-hook-form';
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
} from '@mui/material';
import ProductsSelectProvider from '@/components/productAndServices/products/ProductsSelectProvider';
import BomsFormItem from './BomsFormItem';

export type BomFormValues = {
  product_id: number;
  quantity: number;
  measurement_unit_id: number;
  conversion_factor: number;
  items: {
    product_id: number;
    measurement_unit_id: number;
    quantity: number;
    conversion_factor: number;
    alternatives?: {
      product_id: number;
      measurement_unit_id: number;
      quantity: number;
      conversion_factor: number;
    }[];
  }[];
};

type BomsFormProps = {
  toggleOpen: (open: boolean) => void;
};

const BomsForm: React.FC<BomsFormProps> = ({ toggleOpen }) => {
  const methods = useForm<BomFormValues>({
    defaultValues: {
      product_id: 0,
      quantity: 1,
      measurement_unit_id: 0,
      conversion_factor: 1,
      items: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: BomFormValues) => {
    console.log('Final BOM:', data);
    toggleOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>New Bill Of Material</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              BOM Header
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{xs: 12, md: 6}}>
                <Controller
                  name="product_id"
                  control={control}
                  render={({ field }) => (
                    <ProductsSelectProvider
                      label="Output Product"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.product_id}
                      helperText={errors.product_id?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{xs: 6, md: 3}}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  {...register('quantity', { required: true, min: 1 })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Input Products
            </Typography>
            {fields.map((item, index) => (
              <BomsFormItem
                key={item.id}
                index={index}
                remove={remove}
              />
            ))}
            <Button
              sx={{ mt: 2 }}
              onClick={() =>
                append({
                  product_id: 0,
                  quantity: 1,
                  measurement_unit_id: 0,
                  conversion_factor: 1,
                  alternatives: [],
                })
              }
            >
              + Add Input Product
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

export default BomsForm;
