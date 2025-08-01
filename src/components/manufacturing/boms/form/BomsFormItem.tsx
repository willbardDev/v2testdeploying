import React from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext
} from 'react-hook-form';
import {
  Grid,
  IconButton,
  Box,
  Typography,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductsSelectProvider from '@/components/productAndServices/products/ProductsSelectProvider';
import MeasurementUnitSelector from '@/components/selectors/MeasurementUnitSelector';
import TextField from '@mui/material/TextField';

type BomsFormItemProps = {
  index: number;
  control: any;
  remove: (index: number) => void;
};

const BomsFormItem: React.FC<BomsFormItemProps> = ({ index, control, remove }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Box mb={2} p={2} border={1} borderColor="divider" borderRadius={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{xs: 12, md: 5}}>
          <Controller
            name={`items.${index}.product_id`}
            control={control}
            render={({ field }) => (
              <ProductsSelectProvider
                label="Input Product"
                value={field.value}
                onChange={field.onChange}
                error={!!errors?.items?.[index]?.product_id}
                helperText={errors?.items?.[index]?.product_id?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{xs: 6, md: 2}}>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            {...register(`items.${index}.quantity`, { required: true, min: 1 })}
            error={!!errors?.items?.[index]?.quantity}
            helperText={errors?.items?.[index]?.quantity?.message}
          />
        </Grid>

        <Grid size={{xs: 6, md: 3}}>
          <Controller
            name={`items.${index}.measurement_unit_id`}
            control={control}
            render={({ field }) => (
              <MeasurementUnitSelector
                label="Unit"
                value={field.value}
                onChange={field.onChange}
                error={!!errors?.items?.[index]?.measurement_unit_id}
              />
            )}
          />
        </Grid>

       <Grid size={{xs: 12, md: 2}}>
          <IconButton onClick={() => remove(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Optional divider or space for alternatives */}
      {/* You can add alternative logic here later */}
    </Box>
  );
};

export default BomsFormItem;
