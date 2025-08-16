import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BomsFormRow from './BomFormRow';
import { Product } from '@/components/productAndServices/products/ProductType';
import bomsServices from '../boms-services';
import BomsFormItem from './BomFormItem';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import { BOMPayload } from '../BomType';

interface BomsFormProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  bom?: any;
  onSuccess?: () => void;
}

const schema = yup.object().shape({
  product_id: yup.number().required().positive(),
  quantity: yup.number().required().min(0),
  measurement_unit_id: yup.number().required().positive(),
  conversion_factor: yup.number().required().min(1),
  items: yup.array().of(
    yup.object().shape({
      product_id: yup.number().required().positive(),
      quantity: yup.number().required().min(0),
      measurement_unit_id: yup.number().required().positive(),
      conversion_factor: yup.number().required().min(1),
    })
  ),
});

function BomsForm({ open, toggleOpen, bom = null, onSuccess }: BomsFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<any[]>(bom?.items || []);
  const [outputProduct, setOutputProduct] = useState<Product | null>(
    bom?.output_product || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitItemForm, setSubmitItemForm] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [formData, setFormData] = useState({
    output_quantity: bom?.output_quantity || null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitted },
    trigger,
  } = useForm<BOMPayload>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      product_id: bom?.output_product?.id || undefined,
      quantity: bom?.quantity || 0,
      measurement_unit_id:
        bom?.output_product?.measurement_unit_id || undefined,
      conversion_factor: bom?.output_product?.conversion_factor || 1,
      items: bom?.items || [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('items', items, { shouldValidate: false });
  }, [items, setValue]);

  useEffect(() => {
    if (isSubmitted) {
      trigger('items');
    }
  }, [items, isSubmitted, trigger]);

  const handleReset = () => {
    setItems([]);
    setOutputProduct(null);
    setClearFormKey((prev) => prev + 1);
    setFormData({ output_quantity: null });
    reset({
      product_id: undefined,
      quantity: 0,
      measurement_unit_id: undefined,
      conversion_factor: 1,
      items: [],
    });
    setSubmitItemForm(false);
  };

  const handleClose = () => {
    handleReset();
    toggleOpen(false);
  };

  const addBomMutation = useMutation({
    mutationFn: bomsServices.add,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to create BOM',
        { variant: 'error' }
      );
    },
  });

  const updateBomMutation = useMutation({
    mutationFn: ({ id, bom }: { id: number; bom: BOMPayload }) =>
      bomsServices.update(id, bom),
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to update BOM',
        { variant: 'error' }
      );
    },
  });

  const onSubmit = async (data: BOMPayload) => {
  if (!outputProduct?.id) {
    enqueueSnackbar('Output product is required', { variant: 'error' });
    return;
  }

  if (items.length === 0) {
    enqueueSnackbar('Please add at least one item', { variant: 'error' });
    return;
  }

  const payload: BOMPayload = {
    product_id: Number(outputProduct.id),
    quantity: Number(data.quantity),
    measurement_unit_id: Number(data.measurement_unit_id),
    conversion_factor: Number(data.conversion_factor),
    items: items.map((item) => ({
      product_id: Number(item.product?.id || item.product_id),
      quantity: Number(item.quantity),
      measurement_unit_id: Number(item.measurement_unit_id),
      conversion_factor: Number(item.conversion_factor) || 1,
      alternatives: item.alternatives?.map((alt: { product: { id: any; }; product_id: any; quantity: any; measurement_unit_id: any; conversion_factor: any; }) => ({
        product_id: Number(alt.product?.id || alt.product_id),
        quantity: Number(alt.quantity),
        measurement_unit_id: Number(alt.measurement_unit_id),
        conversion_factor: Number(alt.conversion_factor) || 1
      })) || []
    }))
  };

  try {
    setIsSubmitting(true);
    if (bom) {
      await updateBomMutation.mutateAsync({ id: bom.id, bom: payload });
    } else {
      await addBomMutation.mutateAsync(payload);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle component="div"> <Typography variant="h4" component="h2" textAlign="center" mb={2}>
          {!bom ? 'New Bill of Material' : `Edit ${bom.id}`}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Top Fields */}
        <Grid container spacing={2} mb={3} sx={{ pt: 2 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProductSelect
              label="Output Product"
              frontError={errors.product_id}
              defaultValue={outputProduct}
              onChange={(newValue: Product | null) => {
                if (newValue) {
                  const unitId =
                    newValue.primary_unit?.id ??
                    newValue.measurement_unit_id;
                  const unitSymbol =
                    newValue.primary_unit?.unit_symbol ??
                    newValue.measurement_unit?.unit_symbol ??
                    '';
                  setOutputProduct(newValue);
                  setValue('product_id', newValue.id);
                  setValue('measurement_unit_id', unitId);
                  setValue(
                    'conversion_factor',
                    newValue.primary_unit?.conversion_factor ?? 1
                  );
                } else {
                  setOutputProduct(null);
                  setValue('product_id', 0);
                  setValue('measurement_unit_id', undefined);
                  setValue('conversion_factor', 1);
                }
              }}
              sx={{
                '& .MuiInputBase-root': { paddingRight: '8px' },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Quantity"
              size="small"
              fullWidth
              value={formData.output_quantity ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  output_quantity:
                    value === '' ? null : Number(value),
                }));
                setValue(
                  'quantity',
                  value === '' ? 0 : Number(value)
                );
              }}
              error={!!errors.quantity}
              helperText={errors.quantity?.message as string}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <BomsFormItem
              setItems={setItems}
              items={items}
              key={clearFormKey}
              setClearFormKey={setClearFormKey}
              setSubmitItemForm={setSubmitItemForm}
              submitItemForm={submitItemForm}
              submitMainForm={handleSubmit(onSubmit)}
            />
          </Grid>

          <Grid size={12}>
            {errors.items?.message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.items.message}
              </Alert>
            )}

            {items.map((item, index) => (
              <BomsFormRow
                key={index}
                index={index}
                item={item}
                items={items}
                setItems={setItems}
                setClearFormKey={setClearFormKey}
                setSubmitItemForm={setSubmitItemForm}
                submitItemForm={submitItemForm}
                submitMainForm={handleSubmit(onSubmit)}
              />
            ))}
          </Grid>
        </Grid>

        {isSubmitting && <LinearProgress />}
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {bom ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BomsForm;
