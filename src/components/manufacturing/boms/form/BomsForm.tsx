import React from 'react';
import {
  useForm,
  Controller,
  useFieldArray
} from 'react-hook-form';
import {
  Box, Button, DialogTitle, DialogContent, DialogActions,
  Grid, Typography
} from '@mui/material';
import ProductsSelectProvider from '@/components/productAndServices/products/ProductsSelectProvider';
import MeasurementUnitSelector from '@/components/selectors/MeasurementUnitSelector';
import TextField from '@mui/material/TextField';
import BomsFormItem from './BomsFormItem'; // ← new component

type BomFormValues = {
  product_id: string;
  quantity: number;
  measurement_unit_id: string;
  conversion_factor: number;
  items: {
    product_id: string;
    quantity: number;
    measurement_unit_id: string;
    conversion_factor: number;
    alternatives?: {
      product_id: string;
      quantity: number;
      measurement_unit_id: string;
      conversion_factor: number;
    }[];
  }[];
};

type BomsFormProps = {
  toggleOpen: (open: boolean) => void;
};

const BomsForm: React.FC<BomsFormProps> = ({ toggleOpen }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors }
  } = useForm<BomFormValues>({
    defaultValues: {
      product_id: '',
      quantity: 1,
      measurement_unit_id: '',
      conversion_factor: 1,
      items: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = (data: BomFormValues) => {
    console.log('Final BOM:', data);
    toggleOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>New Bill Of Material</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>BOM Header</Typography>
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
              />
            </Grid>
            <Grid size={{xs: 6, md: 3}}>
              <Controller
                name="measurement_unit_id"
                control={control}
                render={({ field }) => (
                  <MeasurementUnitSelector
                    label="Unit"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.measurement_unit_id}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>Input Products</Typography>
          {fields.map((item, index) => (
            <BomsFormItem
              key={item.id}
              index={index}
              control={control}
              remove={remove}
            />
          ))}
          <Button onClick={() => append({ product_id: '', quantity: 1, measurement_unit_id: '', conversion_factor: 1 })}>
            + Add Input Product
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleOpen(false)} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Submit</Button>
      </DialogActions>
    </form>
  );
};

export default BomsForm;
