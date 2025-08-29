import {
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  LinearProgress,
  Box,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import ProductQuickAdd from '@/components/productAndServices/products/ProductQuickAdd';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { BOMItem } from '../BomType';

interface FormValues {
  product?: Product | null;
  product_id?: number;
  quantity: number | null;
  measurement_unit_id?: number | null;
  measurement_unit: MeasurementUnit | null;
  symbol: string | null;
  conversion_factor?: number | null;
  items: BOMItem[];
  alternatives?: BOMItem[];
}

interface BomItemFormProps {
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm: () => void;
  submitItemForm: boolean;
  setSubmitItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  item?: {
    product_id?: number;
    product?: Product;
    quantity: number;
    measurement_unit_id?: number;
    measurement_unit?: MeasurementUnit | null | undefined;
    conversion_factor?: number | null;
    symbol?: string | null | undefined;
  };
  index?: number;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  items?: any[];
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = yup.object({
  product: yup.object().required("Product is required"),
  quantity: yup.number().required("Quantity is required").positive("Quantity must be positive"),
  measurement_unit_id: yup.number().required("Unit is required")
});

const BomItemForm: React.FC<BomItemFormProps> = ({
  setClearFormKey,
  submitMainForm,
  submitItemForm,
  setSubmitItemForm,
  item = null,
  index = -1,
  setItems,
  items = [],
  setShowForm = null,
}) => {
  const [openProductQuickAdd, setOpenProductQuickAdd] = useState(false);
  const { checkOrganizationPermission } = useJumboAuth();
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(item?.measurement_unit_id ?? item?.measurement_unit?.id ?? null);
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      product: item?.product ?? null,
      product_id: item?.product_id ?? item?.product?.id ?? undefined,
      quantity: item?.quantity ?? null,
      measurement_unit_id: item?.measurement_unit_id ?? item?.measurement_unit?.id ?? null,
      measurement_unit: item?.measurement_unit ?? null,
      symbol: item?.measurement_unit?.symbol ?? null,
      conversion_factor: item?.conversion_factor
        ?? item?.product?.primary_unit?.conversion_factor
        ?? 1,
    }
  });

  const symbol = watch("measurement_unit")?.symbol;
  const product = watch('product') as Product | undefined;
  const quantity = watch('quantity');

  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : []),
  ];

  // Use useCallback to memoize the updateItems function
  const updateItems = useCallback<SubmitHandler<FormValues>>(async (data) => {
    setIsAdding(true);

    try {
      const newItem = {
        ...data,
        product_id: data.product?.id,
        measurement_unit_id: selectedUnit,
        measurement_unit: data.measurement_unit,
        symbol: data.symbol,
        conversion_factor: data.conversion_factor ?? 1,
      };

      if (index > -1) {
        const updatedItems = [...items];
        updatedItems[index] = newItem;
        setItems(updatedItems);
      } else {
        setItems(prev => [...prev, newItem]);
      }

      // Only reset on success
      setClearFormKey(k => k + 1);
      reset();
      setShowForm?.(false);
      
      if (submitItemForm) {
        submitMainForm();
      }
    } catch (error) {
      // On error, keep the form data
      console.error("Submission failed:", error);
    } finally {
      setIsAdding(false);
      setSubmitItemForm(false);
    }
  }, [selectedUnit, index, items, setItems, setClearFormKey, reset, setShowForm, submitItemForm, submitMainForm, setSubmitItemForm]);

  // Handle the submitItemForm trigger differently
  useEffect(() => {
    if (submitItemForm) {
      // Create a form submission handler
      const submitForm = async () => {
        const form = document.querySelector('form');
        if (form) {
          // This will trigger the form submission which will call handleSubmit
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      };
      
      submitForm();
    }
  }, [submitItemForm]); // Only depend on submitItemForm

  useEffect(() => {
    if (addedProduct) {
      const unitId = addedProduct.primary_unit?.id ?? addedProduct.measurement_unit_id;
      const unitSymbol = addedProduct.primary_unit?.unit_symbol ?? addedProduct.measurement_unit?.symbol ?? '';

      setValue('product', addedProduct);
      setValue('product_id', addedProduct.id);
      setValue('measurement_unit_id', unitId);
      setValue('symbol', unitSymbol);
      setValue('conversion_factor', addedProduct.primary_unit?.conversion_factor ?? 1);
      setSelectedUnit(unitId);
      setOpenProductQuickAdd(false);
    }
  }, [addedProduct, setValue]);

  if (isAdding) return <LinearProgress />;

  return (
    <form onSubmit={handleSubmit(updateItems)} autoComplete="off">
      <Grid container spacing={2} alignItems="flex-end" mb={2}>
        <Grid size={{xs:12, md:8}}>
          {/* Product Selector */}
          <ProductSelect
            label="Input Product"
            frontError={errors.product_id}
            value={product}
            addedProduct={addedProduct}
            onChange={(newValue: Product | null) => {
              if (newValue) {
                const unitId = newValue.primary_unit?.id ?? newValue.measurement_unit_id;
                const unitObj = newValue.primary_unit ?? newValue.measurement_unit ?? null;
                const symbol = unitObj?.unit_symbol ?? '';
                const conversionFactor = unitObj?.conversion_factor ?? 1;

                setAddedProduct(newValue);
                setValue('product_id', newValue.id);
                setValue('measurement_unit_id', unitId ?? undefined);
                setValue('measurement_unit', unitObj ?? undefined);
                setValue('symbol', symbol ?? undefined);
                setValue('conversion_factor', conversionFactor);
                setSelectedUnit(unitId ?? null);
              } else {
                setAddedProduct(null);
                reset({
                  product: null,
                  product_id: undefined,
                  quantity: 0,
                  measurement_unit_id: undefined,
                  measurement_unit: null,
                  symbol: null,
                  conversion_factor: 1,
                  items: [],
                  alternatives: [],
                });
                setSelectedUnit(null);
              }
            }}
            startAdornment={
              checkOrganizationPermission(['products_create']) && (
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Add New Product">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering parent button
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
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: '8px',
              },
            }}
          />
        </Grid>

        {/* Quantity + Units */}
<Grid size={{ xs: 12, md: 4 }}>
  <Controller
    name="quantity"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        label="Quantity"
        fullWidth
        size="small"
        value={field.value ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          const numValue = value ? parseFloat(value.replace(/,/g, '')) : null;
          field.onChange(numValue);
        }}
        InputProps={{
          inputComponent: CommaSeparatedField,
          endAdornment: product ? (
            <FormControl
              variant="standard"
              sx={{ minWidth: 80, ml: 1 }}
            >
              <Select
                size="small"
                value={watch('measurement_unit_id') ?? ''}
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
                    setValue('symbol', selectedUnit.unit_symbol ?? selectedUnit.unit_symbol);
                    setValue('conversion_factor', selectedUnit.conversion_factor ?? 1);
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300, borderRadius: 1 },
                  },
                }}
              >
                {[
                  ...(product?.secondary_units || []),
                  ...(product?.primary_unit ? [product.primary_unit] : []),
                ].map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_symbol ?? unit.unit_symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null,
        }}
        error={!!errors.quantity}
        helperText={errors.quantity?.message as string}
        inputProps={{
          step: 'any',
          min: 0.01,
        }}
        sx={{
          '& .MuiInputBase-root': {
            paddingRight: product ? 0 : '14px',
          },
        }}
      />
    )}
  />
</Grid>

      </Grid>

      {/* Actions */}
      <Grid size={12} textAlign="right">
        <Button
          variant="contained"
          size="small"
          type="submit"
          onClick={() => setAddedProduct(null)}
        >
          {item ? <><CheckOutlined fontSize="small" /> Done</> : <><AddOutlined fontSize="small" /> Add</>}
        </Button>
        {item && (
          <Tooltip title="Close Edit">
            <IconButton size="small" onClick={() => setShowForm?.(false)}>
              <DisabledByDefault fontSize="small" color="success" />
            </IconButton>
          </Tooltip>
        )}
      </Grid>

      {/* Quick Add Dialog */}
      {openProductQuickAdd && (
        <ProductQuickAdd setOpen={setOpenProductQuickAdd} setAddedProduct={setAddedProduct} />
      )}
    </form>
  );
};

export default BomItemForm;