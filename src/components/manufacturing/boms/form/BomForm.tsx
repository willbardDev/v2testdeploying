import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/components/productAndServices/products/ProductType';
import bomsServices from '../boms-services';
import BomItemRow from './BomItemRow';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import { BOMPayload } from '../BomType';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import BomItemForm from './BomItemForm';



interface BomFormProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  bomId?: number;
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

function BomForm({ open, toggleOpen, bomId, onSuccess }: BomFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: bomData, isLoading, isError } = useQuery({
      queryKey: ['bom', bomId],
      queryFn: () => bomsServices.show(bomId!),
      enabled: !!bomId && open,
    });
  const [items, setItems] = useState<any[]>([])
   const [outputProduct, setOutputProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitItemForm, setSubmitItemForm] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
   const [formData, setFormData] = useState<{ output_quantity: number | null }>({
    output_quantity: null,
  });

    const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitted },
    trigger,
  } = useForm<BOMPayload>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      product_id: undefined,
      quantity: 0,
      measurement_unit_id: undefined,
      measurement_unit: undefined, 
      symbol: undefined,        
      conversion_factor: 1,
      items: [],
      alternatives: [],
    },
    mode: 'onChange',
  });


  useEffect(() => {
  if (bomData) {
    setOutputProduct(bomData.product || null);
    setFormData({ output_quantity: bomData.quantity || null });
    setItems(bomData.items || []);

    reset({
      product_id: bomData.product_id ?? bomData.product?.id ?? undefined,
      quantity: bomData.quantity ?? 0,
      measurement_unit_id: bomData.measurement_unit_id ?? bomData.measurement_unit?.id ?? undefined,
      measurement_unit: bomData.measurement_unit ?? undefined,
      symbol: bomData.measurement_unit?.unit_symbol ?? undefined,
      conversion_factor: bomData.conversion_factor
        ?? bomData.product?.primary_unit?.conversion_factor
        ?? 1,
      items: bomData.items ?? [],
      alternatives: bomData.alternatives ?? [],
    });
  }
}, [bomData, reset]);


 // Replace the problematic useEffect with this:
useEffect(() => {
  // Only update form value if items actually changed
  if (JSON.stringify(prevItemsRef.current) !== JSON.stringify(items)) {
    setValue('items', items, { shouldValidate: false });
    prevItemsRef.current = items;
  }
}, [items, setValue]);

// Add this near your state declarations
const prevItemsRef = useRef<any[]>([]);

 const validateItems = useCallback(() => {
  if (isSubmitted) {
    trigger('items');
  }
}, [isSubmitted, trigger]);

  const handleReset = () => {
  setItems([]);
  setOutputProduct(null);
  setClearFormKey((prev) => prev + 1);
  setFormData({ output_quantity: null });

  reset({
    product_id: undefined,
    quantity: 0,
    measurement_unit_id: undefined,
    measurement_unit: undefined,
    symbol: undefined,
    conversion_factor: 1,
    items: [],
    alternatives: [],
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
    symbol: String(data.symbol), 
    conversion_factor: Number(data.conversion_factor),
    items: items.map((item) => ({
      product_id: Number(item.product?.id || item.product_id),
      quantity: Number(item.quantity),
      measurement_unit_id: Number(item.measurement_unit_id),
      conversion_factor: Number(item.conversion_factor) || 1,
      symbol: item.unit_symbol || item.symbol || '', 
      alternatives: item.alternatives?.map((alt: any) => ({
        product_id: Number(alt.product?.id || alt.product_id),
        quantity: Number(alt.quantity),
        measurement_unit_id: Number(alt.measurement_unit_id),
        conversion_factor: Number(alt.conversion_factor) || 1,
        symbol: alt.unit_symbol || alt.symbol || '', 
      })) || []
    }))
  };

  try {
    setIsSubmitting(true);
    if (bomId) {
      await updateBomMutation.mutateAsync({ id: bomId, bom: payload });
    } else {
      await addBomMutation.mutateAsync(payload);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography>Loading BOM data...</Typography>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">Error loading BOM data</Alert>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle component="div"> <Typography variant="h4" component="h2" textAlign="center" mb={2}>
          {!bomId ? 'New Bill of Material' : `Edit BOM #${bomId}`}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Top Fields */}
        <Grid container spacing={2} mb={3} sx={{ pt: 2 }}>
          <Grid size={{ xs: 12, md: 8 }}>
           <ProductSelect
            label="Output Product"
            frontError={errors.product_id}
            value={outputProduct}
            onChange={(newValue: Product | null) => {
              if (newValue) {
                const unitId = newValue.primary_unit?.id ?? newValue.measurement_unit_id;
                const unitObj = (newValue.primary_unit ?? newValue.measurement_unit) as any;
                const symbol = unitObj?.unit_symbol ?? '';
                const conversionFactor = unitObj?.conversion_factor ?? 1;

                setOutputProduct(newValue);
                setValue('product_id', newValue.id);
                setValue('measurement_unit_id', unitId ?? undefined);
                setValue('measurement_unit', unitObj); // Fixed this line
                setValue('symbol', symbol);
                setValue('conversion_factor', conversionFactor);
              } else {
                setOutputProduct(null);
                reset({
                  product_id: undefined,
                  quantity: 0,
                  measurement_unit_id: undefined,
                  measurement_unit: undefined,
                  symbol: undefined,
                  conversion_factor: 1,
                  items: [],
                  alternatives: [],
                });
              }
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
                output_quantity: value === '' ? null : Number(value),
              }));
              setValue('quantity', value === '' ? 0 : Number(value));
            }}
            error={!!errors.quantity}
            helperText={errors.quantity?.message as string}
            InputProps={{
              inputComponent: CommaSeparatedField,
              endAdornment: outputProduct ? (
                <FormControl 
                  variant="standard" 
                  sx={{ 
                    minWidth: 80,
                    ml: 1 
                  }}
                >
                  <Select
                    value={watch('measurement_unit_id') ?? ''}
                    onChange={(e) => {
                      const selectedUnitId = e.target.value as number;
                      setValue('measurement_unit_id', selectedUnitId);
                      
                      // Find the selected unit and update conversion factor
                      const combinedUnits = [
                        ...(outputProduct?.secondary_units || []),
                        ...(outputProduct?.primary_unit ? [outputProduct.primary_unit] : [])
                      ];
                      const selectedUnit = combinedUnits.find((unit) => unit.id === selectedUnitId);
                      
                      if (selectedUnit) {
                        setValue('conversion_factor', selectedUnit.conversion_factor ?? 1);
                      }
                    }}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          borderRadius: 1
                        }
                      }
                    }}
                  >
                    {[
                      ...(outputProduct?.secondary_units || []),
                      ...(outputProduct?.primary_unit ? [outputProduct.primary_unit] : [])
                    ].map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.unit_symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null
            }}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <BomItemForm
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
              <BomItemRow
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
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {bomId ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BomForm;
