import React from 'react';
import {
  Controller,
  useFormContext,
} from 'react-hook-form';
import {
  Grid,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductsSelectProvider from '@/components/productAndServices/products/ProductsSelectProvider';
import type { BomFormValues } from './BomsForm';

type BomsFormItemProps = {
  index: number;
  remove: (index: number) => void;
};

const BomsFormItem: React.FC<BomsFormItemProps> = ({ index, remove }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BomFormValues>();

  return (
    <Box mb={2} p={2} border={1} borderColor="divider" borderRadius={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{xs: 12, md: 5}}>
          <Controller
            name={`items.${index}.product_id`}
            control={control}
            render={({ field }) => (
              <ProductsSelectProvider
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

       <Grid size={{xs: 12, md: 2}}>
          <IconButton onClick={() => remove(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BomsFormItem;
