import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { Button, Divider, FormControl, Grid, IconButton, InputLabel, LinearProgress, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import ProductSelect from 'app/prosServices/prosERP/productAndServices/products/ProductSelect';
import { useProductsSelect } from 'app/prosServices/prosERP/productAndServices/products/ProductsSelectProvider';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import priceListServices from '../priceLists-services';

function PriceListItemForm({ setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, costInsights, costCenterId, storeId, item = null, index = -1, setItems, items = [], setShowForm = null}) {
  const [productUnits, setProductUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(item && item.measurement_unit_id);
  const { productOptions } = useProductsSelect();
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [costAverage, setCostAverage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Define validation Schema
  const validationSchema = yup.object({
    product: yup.object().required("Product is required").typeError('Product is required'),
    price: yup.number().required("Price is required").positive("Price is required").typeError('Price is required'),
    bottom_cap: yup.number().positive("Invalid bottom cap").typeError('Invalid bottom cap'),
  });

  //Initialize react-hook-form
  const { setValue, handleSubmit, reset, control, watch, setError,clearErrors, formState: { errors, dirtyFields } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: item && productOptions.find(product => product.id === item.product.id),
      price: item && item.price,
      bottom_cap: item && item.bottom_cap,
      measurement_unit_id: item && item.measurement_unit_id,
      unit_symbol: item?.unit_symbol ? item.unit_symbol : item?.measurement_unit?.symbol,
    }
  });

  useEffect(() => {
    setIsDirty(Object.keys(dirtyFields).length > 0); // Update dirty state
  }, [dirtyFields, setIsDirty, watch]);

  const updateItems = async (item) => {
    setIsAdding(true);
    if (index > -1) {
      // Replace the existing item with the edited item
      let updatedItems = [...items];
      updatedItems[index] = item;
      await setItems(updatedItems);
      setClearFormKey(prevKey => prevKey + 1);
    } else {
      // Add the new item to the items array
      await setItems((items) => [...items, item]);
      if (!!submitItemForm) {
        submitMainForm();
      }
      setSubmitItemForm(false);
      setClearFormKey(prevKey => prevKey + 1);
    }

    reset();
    setIsAdding(false);
    setShowForm && setShowForm(false);
  };

  useEffect(() => {
    if (submitItemForm) {
      handleSubmit(updateItems, () => {
        setSubmitItemForm(false); // Reset submitItemForm if there are errors
      })();
    }
  }, [submitItemForm]);

  useEffect(() => {
    if (item && item.product) {
      const itemProduct = productOptions.find(product => product.id === item.product.id);
      setProductUnits(itemProduct?.secondary_units?.concat(!!itemProduct?.primary_unit && itemProduct?.primary_unit));
      setSelectedUnit(item.measurement_unit_id);
    }
  }, [item, productOptions]);

  //for checking available units of a product
  const getAvailableUnits = (units, productId) => {
    const selectedUnits = items?.filter(existingItem => existingItem.product.id === productId)
      .map(existingItem => existingItem.measurement_unit_id);

    return units?.filter(unit => !selectedUnits.includes(unit.id));
  };

  const product = watch(`product`);
  const measurement_unit_id = watch(`measurement_unit_id`)

  const retrieveCostInsights = async () => {
    if (!!costCenterId && !! storeId && !!product && !!measurement_unit_id) {
      setIsRetrieving(true);
      const costInsights =  await priceListServices.getCostInsights({
        cost_center_id: costCenterId,
        store_id: storeId,
        product_id: product.id, 
        measurement_unit_id: measurement_unit_id,
      })
      setCostAverage(costInsights);
      setIsRetrieving(false);
    }
  }

  //for triggering process of retrieving Cost insight
  useEffect(() => {
    retrieveCostInsights()
  }, [costCenterId, storeId, product, measurement_unit_id])

  if (isAdding) {
    return <LinearProgress />;
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit(updateItems)}>
      <Divider />
      <Grid container columnSpacing={1} rowSpacing={1} mb={1} mt={1}>
        {!item && (
          <Grid item xs={12} textAlign={'center'}>
            <Typography variant='h5'>Add Item</Typography>
          </Grid>
        )}

        {!!costInsights && (
          <Grid item xs={12} textAlign={'center'}>
            {isRetrieving ? (
              <LinearProgress />
            ) : (
              <Typography variant='subtitle1' color={'error'}>
                Average Cost: {costAverage.toLocaleString()}
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12} md={productUnits?.length > 0 ? 3.5 : 5}>
          <ProductSelect
            label='Product/Service'
            frontError={errors.product}
            defaultValue={item && item.product}
            // excludeIds={items.map(item => item.product.id)}
            onChange={(newValue) => {
              const allUnits = newValue?.secondary_units.concat(!!newValue?.primary_unit && newValue?.primary_unit);
              const availableUnits = getAvailableUnits(allUnits, newValue?.id);

              if (availableUnits?.length < 1) {
               return setError('product',{
                  type:'manual',
                  message:'No available unit for this product to add price. Please select a different product.',
                });
              } else {
                clearErrors('product');
              }

              setProductUnits(availableUnits);
              setSelectedUnit(availableUnits?.length ? availableUnits[0].id : null);
              
              setValue('product', newValue, {
                shouldDirty: true,
                shouldValidate: true
              });
              costCenterId && storeId && retrieveCostInsights(); // For retrieve CostInsights

              setValue('measurement_unit_id', availableUnits?.length ? availableUnits[0].id : null);
              setValue('unit_symbol', availableUnits?.length ? availableUnits[0].unit_symbol : null);
              setValue('product_id', newValue?.id);

            }}
          />
        </Grid>
        { 
          productUnits?.length > 0 && !!selectedUnit &&
          <Grid item xs={12} md={1.5}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Controller
              name="measurement_unit_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedUnit}
                  onChange={(e) => {
                    setSelectedUnit(e.target.value);
                    const selectedUnitId = e.target.value;
                    const selectedUnit = productUnits?.find(unit => unit.id === selectedUnitId);
                    if (selectedUnit) {
                      setValue('measurement_unit_id', selectedUnit.id, { shouldValidate: true });
                      setValue('unit_symbol', selectedUnit.unit_symbol, { shouldValidate: true });
                    }
                  }}
                  size="small"
                  label="Unit" 
                >
                  {productUnits?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        }
        <Grid item xs={12} md={3}>
          <TextField
            label="Price"
            fullWidth
            size='small'
            InputProps={{
              inputComponent: CommaSeparatedField,
            }}
            error={!!errors?.price}
            helperText={errors?.price?.message}
            defaultValue={item && item?.price}
            onChange={(e) => {
              const sanitizedValue = sanitizedNumber(e.target.value);
              setValue('price', sanitizedValue ? sanitizedValue : 0, {
                shouldValidate: true,
                shouldDirty: true
              });
              setValue('bottom_cap', sanitizedValue ? sanitizedValue : 0, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Bottom Cap"
            fullWidth
            size='small'
            InputProps={{
              inputComponent: CommaSeparatedField
            }}
            error={!!errors?.bottom_cap}
            helperText={errors?.bottom_cap?.message}
            value={watch('bottom_cap')}
            onChange={(e) => {
              setValue('bottom_cap', e.target.value ? sanitizedNumber(e.target.value) : 0, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={1} textAlign={'end'}>
          <Button
            variant='contained'
            size='small'
            type='submit'
            onClick={() => {
              setProductUnits(null);
              setCostAverage(0);
            }}            
          >
            {
              item ? (
                <><CheckOutlined fontSize='small'/> Done</>
              ) : (
                <><AddOutlined fontSize='small'/> Add</>
              )
            }
          </Button>
          {
            item &&
            <Tooltip title='Close Edit'>
              <IconButton size='small'
                onClick={() => {
                  setShowForm(false);
                }}
              >
                <DisabledByDefault fontSize='small' color='success' />
              </IconButton>
            </Tooltip>
          }
        </Grid>
      </Grid>
    </form>
  );
}

export default PriceListItemForm;
