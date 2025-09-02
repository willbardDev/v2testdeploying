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
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/components/productAndServices/products/ProductType';
import bomsServices from '../boms-services';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import { BOMPayload, BOMItem } from '../BomType';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import BomItemForm from './BomItemForm';
import BomItemRow from './BomItemRow';
import ProductQuickAdd from '@/components/productAndServices/products/ProductQuickAdd';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

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
  items: yup.array().min(1, 'Please add at least one item').of(
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
  const { checkOrganizationPermission } = useJumboAuth();
  const [items, setItems] = useState<BOMItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitItemForm, setSubmitItemForm] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [openProductQuickAdd, setOpenProductQuickAdd] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);

  const { data: bomData, isLoading, isError } = useQuery({
    queryKey: ['bom', bomId],
    queryFn: () => bomsServices.show(bomId!),
    enabled: !!bomId && open,
  });

  const { control, handleSubmit, setValue, reset, watch, setError, formState: { errors } } = useForm<BOMPayload>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      product_id: null,
      product: null,
      quantity: null,
      measurement_unit_id: null,
      measurement_unit: null,
      symbol: '',
      conversion_factor: 1,
      items: [],
      alternatives: [],
    },
  });

  const product = watch('product');

  useEffect(() => {
    if (bomData) {
      reset({
        product_id: bomData.product_id ?? bomData.product?.id,
        product: bomData.product || null,
        quantity: bomData.quantity ?? null,
        measurement_unit_id: bomData.measurement_unit_id ?? bomData.measurement_unit?.id,
        measurement_unit: bomData.measurement_unit,
        symbol: bomData.measurement_unit?.unit_symbol || bomData.symbol,
        conversion_factor: bomData.conversion_factor ?? 1,
        items: bomData.items ?? [],
        alternatives: bomData.alternatives ?? [],
      });
      
      setItems(bomData.items || []);
    }
  }, [bomData, reset]);

  const handleClose = () => {
    reset();
    setItems([]);
    setClearFormKey(prev => prev + 1);
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

  const onSubmit = (data: BOMPayload) => {
    if (items.length === 0) {
      setError('items', {
        type: 'manual',
        message: 'Please add at least one item',
      });
      return;
    }

    const payload: BOMPayload = {
      product_id: Number(data.product_id),
      quantity: Number(data.quantity),
      measurement_unit_id: Number(data.measurement_unit_id),
      symbol: String(data.symbol),
      conversion_factor: Number(data.conversion_factor),
      items: items.map((item) => ({
        product_id: Number(item.product?.id || item.product_id),
        quantity: Number(item.quantity),
        measurement_unit_id: Number(item.measurement_unit_id),
        conversion_factor: Number(item.conversion_factor) || 1,
        symbol: item.symbol || '',
        alternatives: item.alternatives?.map((alt: any) => ({
          product_id: Number(alt.product?.id || alt.product_id),
          quantity: Number(alt.quantity),
          measurement_unit_id: Number(alt.measurement_unit_id),
          conversion_factor: Number(alt.conversion_factor) || 1,
          symbol: alt.symbol || '',
        })) || []
      }))
    };

    setIsSubmitting(true);
    if (bomId) {
      updateBomMutation.mutate({ id: bomId, bom: payload });
    } else {
      addBomMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle component="div">
        <Typography variant="h4" component="h2" textAlign="center" mb={2}>
          {!bomId ? 'New Bill of Material' : `Edit ${bomData?.bomNo ?? ''}`}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mb={3} sx={{ pt: 2 }}>
          <Grid size={{xs:12, md:8}}>
            <ProductSelect
              label="Output Product"
              frontError={errors.product_id}
              defaultValue={bomData?.product}
              addedProduct={addedProduct}
              onChange={(newValue: Product | null) => {
                if (newValue) {
                  const unitId = newValue.primary_unit?.id ?? newValue.measurement_unit_id;
                  const unitObj = newValue.primary_unit ?? newValue.measurement_unit;
                  const symbol = unitObj?.unit_symbol ?? '';
                  const conversionFactor = unitObj?.conversion_factor ?? 1;

                  setValue('product', newValue);
                  setValue('product_id', newValue.id);
                  setValue('measurement_unit_id', unitId);
                  setValue('measurement_unit', unitObj);
                  setValue('symbol', symbol);
                  setValue('conversion_factor', conversionFactor);
                }
              }}
              startAdornment={
                checkOrganizationPermission(['products_create']) && (
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Add New Product">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenProductQuickAdd(true);
                        }}
                        size="small"
                        sx={{ p: 0.5 }}
                      >
                        <AddOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              }
            />
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              value={watch('quantity') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value ? parseFloat(value.replace(/,/g, '')) : null;
                setValue('quantity', numValue);
              }}
              InputProps={{
                inputComponent: CommaSeparatedField,
                endAdornment: product ? (
                  <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                    <Select
                      size="small"
                      defaultValue={watch('measurement_unit_id') || ''}
                      onChange={(e) => {
                        const selectedUnitId = e.target.value as number;
                        setValue('measurement_unit_id', selectedUnitId);

                        const combinedUnits = [
                          ...(product?.secondary_units || []),
                          ...(product?.primary_unit ? [product.primary_unit] : []),
                        ];

                        const selectedUnit = combinedUnits.find(
                          (unit) => unit.id === selectedUnitId
                        );

                        if (selectedUnit) {
                          setValue('measurement_unit', selectedUnit);
                          setValue('symbol', selectedUnit.unit_symbol);
                          setValue('conversion_factor', selectedUnit.conversion_factor);
                        }
                      }}
                    >
                      {[
                        ...(product?.secondary_units || []),
                        ...(product?.primary_unit ? [product.primary_unit] : []),
                      ].map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.unit_symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null,
              }}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
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
              />
            ))}
          </Grid>
        </Grid>

        {openProductQuickAdd && (
          <ProductQuickAdd 
            setOpen={setOpenProductQuickAdd} 
            setAddedProduct={setAddedProduct} 
          />
        )}
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BomForm;