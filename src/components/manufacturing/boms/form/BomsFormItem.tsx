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
import React, { useEffect, useState } from 'react';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import ProductQuickAdd from '@/components/productAndServices/products/ProductQuickAdd';
import { useForm, SubmitHandler } from 'react-hook-form';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

interface FormValues {
  product?: Product | null;
  product_id?: number;
  quantity: number;
  measurement_unit_id?: number | null;
  unit_symbol?: string | null;
}

interface BomsFormItemProps {
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm: () => void;
  submitItemForm: boolean;
  setSubmitItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  item?: {
    product_id?: number;
    product?: Product;
    quantity: number;
    measurement_unit_id?: number;
    measurement_unit?: MeasurementUnit;
    unit_symbol?: string;
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

const BomsFormItem: React.FC<BomsFormItemProps> = ({
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
  const [selectedUnit, setSelectedUnit] = useState<number | null>(
    item ? item.measurement_unit_id ?? item.measurement_unit?.id ?? null : null
  );
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)as any,
    defaultValues: {
      product: item?.product ?? null,
      quantity: item?.quantity ?? 0,
      measurement_unit_id: item?.measurement_unit_id ?? item?.measurement_unit?.id ?? null,
      unit_symbol: item?.unit_symbol ?? item?.measurement_unit?.unit_symbol ?? null
    }
  });

  useEffect(() => {
    if (addedProduct?.id) {
      setValue('product', addedProduct);
      setValue('measurement_unit_id', addedProduct.measurement_unit_id);
      setValue('unit_symbol', addedProduct.measurement_unit?.unit_symbol ?? '');
      setSelectedUnit(addedProduct.measurement_unit_id);
      setOpenProductQuickAdd(false);
    }
  }, [addedProduct, setValue]);

  const updateItems: SubmitHandler<FormValues> = async (data) => {
    setIsAdding(true);
    const product = watch('product');
    const newItem = {
      ...data,
      product_id: product?.id,
      measurement_unit_id: selectedUnit,
      unit_symbol: watch('unit_symbol'),
    };

    if (index > -1) {
      const updatedItems = [...items];
      updatedItems[index] = newItem;
      await setItems(updatedItems);
      setClearFormKey((prevKey) => prevKey + 1);
    } else {
      await setItems((prevItems) => [...prevItems, newItem]);
      if (submitItemForm) {
        submitMainForm();
      }
      setSubmitItemForm(false);
      setClearFormKey((prevKey) => prevKey + 1);
    }

    reset();
    setIsAdding(false);
    setShowForm && setShowForm(false);
  };

  useEffect(() => {
    if (submitItemForm) {
      handleSubmit(updateItems, () => {
        setSubmitItemForm(false);
      })();
    }
  }, [submitItemForm]);

  if (isAdding) {
    return <LinearProgress />;
  }

  const product = watch('product') as Product | undefined;
  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units?.map((unit) => ({
      id: unit.id,
      name: unit.name ?? unit.unit_symbol,
      unit_symbol: unit.unit_symbol,
      conversion_factor: unit.conversion_factor,
    })) ?? []),
    ...(product?.primary_unit
      ? [{
        id: product.primary_unit.id,
        name: product.primary_unit.name ?? product.primary_unit.unit_symbol,
        unit_symbol: product.primary_unit.unit_symbol,
        conversion_factor: undefined,
      }]
      : []),
  ];

  return (
    <form autoComplete="off" onSubmit={handleSubmit(updateItems)}>
          <>
            <Grid container spacing={2} alignItems="flex-end" mb={2}>
              <Grid size={{xs:12, md:8}}>
                <ProductSelect
                  label="Input Product"
                  frontError={errors.product}
                  defaultValue={item?.product}
                  addedProduct={addedProduct}
                  onChange={(newValue: Product | null) => {
                    if (newValue) {
                      setValue('product', newValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setAddedProduct(null);
                      setSelectedUnit(newValue.primary_unit ? newValue.primary_unit.id : newValue.measurement_unit_id);
                      setValue('measurement_unit_id', newValue.primary_unit ? newValue.primary_unit.id : newValue.measurement_unit_id);
                      setValue('unit_symbol', newValue.primary_unit ? newValue.primary_unit.unit_symbol : newValue.measurement_unit?.unit_symbol ?? '');
                      setValue('product_id', newValue.id);
                    } else {
                      setValue('product', null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setSelectedUnit(null);
                      setValue('measurement_unit_id', null);
                      setValue('unit_symbol', '');
                      setValue('product_id', undefined);
                    }
                  }}
                  startAdornment={
                    checkOrganizationPermission(['products_create']) && (
                      <Tooltip title="Add New Product">
                        <AddOutlined
                          onClick={() => setOpenProductQuickAdd(true)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )
                  }
                />
              </Grid>
              
              <Grid size={{xs:12, md:4}}>
                <TextField
                  label="Quantity"
                  fullWidth
                  size="small"
                  defaultValue={item?.quantity}
                  InputProps={{
                    inputComponent: CommaSeparatedField,
                    endAdornment: product && selectedUnit && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth>
                          <Select
                            value={selectedUnit ?? ''}
                            onChange={(e) => {
                              const selectedUnitId = e.target.value as number;
                              setSelectedUnit(selectedUnitId);
                              const selectedUnit = combinedUnits.find((unit) => unit.id === selectedUnitId);
                              if (selectedUnit) {
                                setValue('measurement_unit_id', selectedUnit.id);
                                setValue('unit_symbol', selectedUnit.unit_symbol);
                              }
                            }}
                            variant="standard"
                            size="small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  borderRadius: 0,
                                },
                              },
                            }}
                          >
                            {combinedUnits.map((unit: MeasurementUnit) => (
                              <MenuItem key={unit.id} value={unit.id}>
                                {unit.unit_symbol}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    ),
                  }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  {...register('quantity')}
                />
              </Grid>
            </Grid>

            <Grid size={{xs:12, md:12}} textAlign={'end'}>
              <Button
                variant="contained"
                size="small"
                type="submit"
                onClick={() => {
                  setAddedProduct(null);
                }}
              >
                {item ? (
                  <>
                    <CheckOutlined fontSize="small" /> Done
                  </>
                ) : (
                  <>
                    <AddOutlined fontSize="small" /> Add
                  </>
                )}
              </Button>
              {item && (
                <Tooltip title="Close Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setShowForm && setShowForm(false);
                    }}
                  >
                    <DisabledByDefault fontSize="small" color="success" />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </>
        
        
        {openProductQuickAdd && (
          <ProductQuickAdd 
            setOpen={setOpenProductQuickAdd} 
            setAddedProduct={setAddedProduct} 
          />
        )}
    </form>
  );
};

export default BomsFormItem;