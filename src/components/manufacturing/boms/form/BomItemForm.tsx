import {
  Grid,
  TextField,
  Button,
  LinearProgress,
  Box,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { BOMItem } from '../BomType';
import { Product } from '@/components/productAndServices/products/ProductType';

interface BomItemFormProps {
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm: () => void;
  submitItemForm: boolean;
  setSubmitItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  item?: BOMItem;
  index?: number;
  setItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  items: BOMItem[];
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
  const [isAdding, setIsAdding] = useState(false);


  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
        product: item?.product ?? null,
        product_id: item?.product_id ?? item?.product?.id ?? null,
        quantity: item?.quantity ?? null,
        measurement_unit_id: item?.measurement_unit_id ?? item?.measurement_unit?.id ?? null,
        measurement_unit: item?.measurement_unit ?? null,
        symbol: item?.measurement_unit?.symbol ?? item?.symbol ?? '',
        conversion_factor: item?.conversion_factor 
          ?? item?.measurement_unit?.conversion_factor 
          ?? item?.product?.primary_unit?.conversion_factor 
          ?? 1,
      },
  });

  const product = watch('product');

  const updateItems = async (data: any) => {
    setIsAdding(true);

    const newItem: BOMItem = {
      ...data,
      product: data.product || null,
      product_id: data.product_id ?? data.product?.id,
      measurement_unit_id: data.measurement_unit_id ?? data.measurement_unit?.id,
      measurement_unit: data.measurement_unit,
      symbol: data.measurement_unit?.unit_symbol || data.symbol,
      conversion_factor: data.conversion_factor ?? 1,
      items: data.items ?? [],
      alternatives: data.alternatives ?? [],
    };

    if (index > -1) {
      // Edit existing item
      const updatedItems = [...items];
      updatedItems[index] = newItem;
      setItems(updatedItems);
      setShowForm?.(false);
    } else {
      // Add new item
      setItems(prev => [...prev, newItem]);
      reset();
      setClearFormKey(prev => prev + 1);
    }

    setIsAdding(false);
    setSubmitItemForm(false);

    if (submitItemForm) {
      submitMainForm();
    }
  };

  useEffect(() => {
    if (submitItemForm) {
      handleSubmit(updateItems)();
    }
  }, [submitItemForm]);

  useEffect(() => {
    if (addedProduct) {
      const unitObj = addedProduct.primary_unit ?? addedProduct.measurement_unit;
      const unitId = unitObj?.id ?? null;
      const symbol = unitObj?.unit_symbol ?? '';
      const conversionFactor = unitObj?.conversion_factor ?? 1;

      setValue('product', addedProduct);
      setValue('product_id', addedProduct.id);
      setValue('measurement_unit_id', unitId);
      setValue('measurement_unit', unitObj);
      setValue('symbol', symbol);
      setValue('conversion_factor', conversionFactor);
      setOpenProductQuickAdd(false);
    }
  }, [addedProduct, setValue]);

  if (isAdding) return <LinearProgress />;

  return (
    <form onSubmit={handleSubmit(updateItems)} autoComplete="off">
      <Grid container spacing={2} alignItems="flex-end" mb={2}>
        <Grid size={{xs:12, md:8}}>
          <ProductSelect
            label="Input Product"
            frontError={errors.product}
            defaultValue={item?.product}
            addedProduct={addedProduct}
            onChange={(newValue: Product | null) => {
              if (newValue) {
                const unitObj = newValue.primary_unit ?? newValue.measurement_unit;
                const unitId = unitObj?.id ?? null;
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
                    value={watch('measurement_unit_id') || ''}
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

        <Grid size={12} textAlign="right">
          <Button variant="contained" size="small" type="submit">
            {item ? (
              <><CheckOutlined fontSize="small" /> Done</>
            ) : (
              <><AddOutlined fontSize="small" /> Add</>
            )}
          </Button>
          {item && (
            <Tooltip title="Close Edit">
              <IconButton size="small" onClick={() => setShowForm?.(false)}>
                <DisabledByDefault fontSize="small" color="success" />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default BomItemForm;
