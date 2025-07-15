import { Button, Checkbox, Divider, FormControl, Grid, IconButton, LinearProgress, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { useProductsSelect } from 'app/prosServices/prosERP/productAndServices/products/ProductsSelectProvider';
import ProductSelect from 'app/prosServices/prosERP/productAndServices/products/ProductSelect';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import ProductQuickAdd from '../../productAndServices/products/ProductQuickAdd';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function RequisitionProductItemForm({ setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, product_item = null, index = -1, setRequisition_product_items, requisition_product_items = [], setShowForm = null }) {
    const { productOptions } = useProductsSelect();
    const { checkOrganizationPermission, authOrganization } = useJumboAuth();
    const nonInventoryIds = productOptions.filter(product => product.type !== 'Inventory').map(product => product.id);
    const [openProductQuickAdd, setOpenProductQuickAdd] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);
    const [calculatedAmount, setCalculatedAmount] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState(product_item && (product_item.measurement_unit_id ? product_item.measurement_unit_id : product_item.measurement_unit.id));
    const [preservedValues, setPreservedValues] = useState(null);
    const [vatChecked, setVatChecked] = useState(product_item?.vat_percentage > 0 ? true : false);

    const [isVatfieldChange, setIsVatfieldChange] = useState(false);
    const [priceInclusiveVAT, setPriceInclusiveVAT] = useState(0);
    const [priceFieldKey, setPriceFieldKey] = useState(0);
    const [vatPriceFieldKey, setVatPriceFieldKey] = useState(0);

    const validationSchema = yup.object({
        product: yup.object().required('Product is required').typeError('Product is required'),
        quantity: yup
            .number()
            .when(['product'], {
                is: (product) => !!product && product.type === 'Inventory',
                then: yup
                    .number()
                    .required('Quantity is required')
                    .positive('Quantity must be a positive number')
                    .typeError('Quantity is required'),
            }),
    });

    const { setValue, handleSubmit, register, watch, reset, formState: { errors, dirtyFields } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            product: product_item && productOptions.find(product => product.id === (product_item.product_id || product_item.product.id)),
            product_id: product_item && product_item.product_id,
            quantity: product_item && product_item.quantity,
            rate: product_item && product_item.rate,
            vat_percentage: product_item ? product_item.vat_percentage : !!preservedValues ? preservedValues.vat_percentage : 0,
            remarks: product_item && product_item.remarks,
            measurement_unit_id: product_item && (product_item.measurement_unit_id ? product_item.measurement_unit_id : product_item.measurement_unit.id),
            conversion_factor: product_item ? product_item.conversion_factor : 1,
            unit_symbol: product_item && (product_item.measurement_unit?.symbol ? product_item.measurement_unit?.symbol : product_item.unit_symbol),
        },
    });

    useEffect(() => {
        setIsDirty(Object.keys(dirtyFields).length > 0);
    }, [dirtyFields, setIsDirty, watch]);

    const product = watch('product');
    const vat_percentage = watch('vat_percentage') || 0;
    const vat_factor = vat_percentage * 0.01;

    useEffect(() => {
        setValue(`vat_percentage`, vat_percentage);
        setVatChecked(vatChecked);
    }, [product, vat_percentage]);

    const calculateAmount = () => {
        const quantity = parseFloat(watch(`quantity`)) || product_item?.quantity || 0;
        const rate = parseFloat(watch(`rate`)) || (product_item?.rate || 0);
        return quantity * rate * (1 + vat_factor);
    };

    useEffect(() => {
        const amount = calculateAmount();
        setCalculatedAmount(amount);
        setValue(`amount`, amount);
        setValue(`product_item_vat`, (watch(`rate`) * vat_factor) || 0);
    }, [watch('quantity'), watch('rate'), vat_factor, product_item]);

    useEffect(() => {
        if (addedProduct?.id) {
            setValue('product', addedProduct);
            setValue('product_id', addedProduct?.id);
            setValue('measurement_unit_id', addedProduct.measurement_unit_id);
            setValue('unit_symbol', addedProduct.measurement_unit.symbol);
            setSelectedUnit(addedProduct?.measurement_unit_id);
            setOpenProductQuickAdd(false);
        }
    }, [addedProduct]);

    const [isAdding, setIsAdding] = useState(false);

    const updateItems = async (product_item) => {
        setIsAdding(true);
        if (index > -1) {
            // Replace the existing item with the edited item
            let updatedItems = [...requisition_product_items];
            updatedItems[index] = product_item;
            await setRequisition_product_items(updatedItems);
            setClearFormKey(prevKey => prevKey + 1);
        } else {
            // Add the new item to the items array
            await setRequisition_product_items((requisition_product_items) => [...requisition_product_items, product_item]);
            if (!!submitItemForm) {
                submitMainForm(); 
                setClearFormKey(prevKey => prevKey + 1);
            }
            setSubmitItemForm(false);
        }

        setPreservedValues({
            vat_percentage: product_item.vat_percentage,
        });

        reset({
            product: null,
            quantity: null,
            rate: null,
            measurement_unit_id: null,
            unit_symbol: null,
        });
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
        setValue(`vat_percentage`, product_item ? product_item?.vat_percentage : preservedValues?.vat_percentage);
    }, [preservedValues, product_item, product]);

    if (isAdding) {
        return <LinearProgress />;
    }

    const combinedUnits = product?.secondary_units?.concat(product?.primary_unit);

  return (
      <form autoComplete='off' onSubmit={handleSubmit(updateItems)}>
          <Grid container columnSpacing={1} rowSpacing={1} mt={1}>
              <Grid item xs={12}>
                  <Divider />
              </Grid>
              {!!openProductQuickAdd && !product_item && (
                  <Grid item xs={12} textAlign={'center'}>
                      <Typography variant='h5'>Quick Product Registration</Typography>
                  </Grid>
              )}
              {!openProductQuickAdd && (
                  <>
                      <Grid item xs={12} md={3} lg={3}>
                          <ProductSelect
                              label='Product'
                              frontError={errors.product}
                              addedProduct={addedProduct}
                              defaultValue={product_item && product_item.product}
                              // excludeIds={nonInventoryIds}
                              onChange={async (newValue) => {
                                  if (!!newValue) {
                                      await setSelectedUnit(null);
                                      setValue(`product`, newValue, {
                                          shouldDirty: true,
                                          shouldValidate: true,
                                      });
                                      setSelectedUnit(newValue.primary_unit ? newValue?.primary_unit?.id : newValue?.measurement_unit_id);
                                      setValue(`measurement_unit_id`, newValue.primary_unit ? newValue?.primary_unit?.id : newValue?.measurement_unit_id);
                                      setValue(`unit_symbol`, newValue.primary_unit ? newValue?.primary_unit?.unit_symbol : newValue?.measurement_unit.symbol);
                                      setValue(`product_id`, newValue?.id);
                                  } else {
                                      setValue(`product`, null, {
                                          shouldDirty: true,
                                          shouldValidate: true,
                                      });
                                      setValue(`measurement_unit_id`, null);
                                      setValue(`unit_symbol`, null);
                                      setValue(`product_id`, null);
                                  }
                              }}
                              startAdornment={
                                  checkOrganizationPermission([PERMISSIONS.PRODUCTS_CREATE]) && (
                                      <Tooltip title={'Add New Product'}>
                                          <AddOutlined
                                              onClick={() => setOpenProductQuickAdd(true)}
                                              sx={{
                                                  cursor: 'pointer',
                                              }}
                                          />
                                      </Tooltip>
                                  )
                              }
                          />
                      </Grid>
                      <Grid item xs={12} md={2} lg={2}>
                          <TextField
                              label='Quantity'
                              fullWidth
                              size='small'
                              defaultValue={product_item && product_item.quantity}
                              InputProps={{
                                  endAdornment: (
                                      !!product && !!selectedUnit && (
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                              <FormControl fullWidth>
                                                  <Select
                                                      value={!!selectedUnit && selectedUnit}
                                                      onChange={async (e) => {
                                                          setSelectedUnit(e.target.value);
                                                          const selectedUnitId = e.target.value;
                                                          const selectedUnit = combinedUnits?.find(unit => unit.id === selectedUnitId);
                                                          if (selectedUnit) {
                                                              await setValue(`conversion_factor`, selectedUnit.conversion_factor);
                                                              await setValue(`measurement_unit_id`, selectedUnit.id);
                                                              setValue(`unit_symbol`, selectedUnit?.unit_symbol);
                                                          }
                                                      }}
                                                      variant='standard'
                                                      size='small'
                                                      MenuProps={{
                                                          PaperProps: {
                                                              style: {
                                                                  borderRadius: 0,
                                                              },
                                                          },
                                                      }}
                                                  >
                                                      {product?.primary_unit ? (
                                                          combinedUnits?.map((unit) => (
                                                              <MenuItem key={unit.id} value={unit.id}>
                                                                  {unit.unit_symbol}
                                                              </MenuItem>
                                                          ))
                                                      ) : (
                                                          <MenuItem key={product.measurement_unit?.id} value={product.measurement_unit?.id}>
                                                              {product.measurement_unit.symbol}
                                                          </MenuItem>
                                                      )}
                                                  </Select>
                                              </FormControl>
                                          </div>
                                      )
                                  ),
                              }}
                              error={!!errors?.quantity}
                              helperText={errors?.quantity?.message}
                              onChange={(e) => {
                                  setValue(`quantity`, e.target.value ? sanitizedNumber(e.target.value) : 0, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                  });
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} md={1} lg={1}>
                          <Typography align='left' variant='body2'>
                              VAT
                              <Checkbox
                                  size='small'
                                  checked={vatChecked}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setVatChecked(checked);
                                    setValue('vat_percentage', checked ? authOrganization.organization.settings.vat_percentage : 0, {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                  }}
                              />
                          </Typography>
                      </Grid>
                      <Grid item xs={12} md={vat_factor ? 2 : 3}>
                          <TextField
                              label='Price'
                              fullWidth
                              key={priceFieldKey}
                              size='small'
                              error={!!errors?.rate}
                              helperText={errors?.rate?.message}
                              InputProps={{
                                  inputComponent: CommaSeparatedField,
                              }}
                              defaultValue={Math.round(watch(`rate`) * 100000) / 100000}
                              onChange={(e) => {
                                  setIsVatfieldChange(false);
                                  setPriceInclusiveVAT(0);
                                  setValue(`rate`, e.target.value ? sanitizedNumber(e.target.value) : null, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                  });
                                  setVatPriceFieldKey((key) => key + 1);
                              }}
                          />
                      </Grid>
                      {!!vat_factor && (
                          <Grid item xs={12} md={2} lg={2}>
                              <TextField
                                  label='Price (VAT Inclusive)'
                                  fullWidth
                                  key={vatPriceFieldKey}
                                  size='small'
                                  error={!!errors?.rate}
                                  helperText={errors?.rate?.message}
                                  InputProps={{
                                      inputComponent: CommaSeparatedField,
                                  }}
                                  defaultValue={
                                      isVatfieldChange
                                          ? Math.round(priceInclusiveVAT * 100000) / 100000
                                          : Math.round(watch('rate') * (1 + vat_factor) * 100000) / 100000
                                  }
                                  onChange={(e) => {
                                      setIsVatfieldChange(!!e.target.value);
                                      setPriceInclusiveVAT(e.target.value ? sanitizedNumber(e.target.value) : null);
                                      setValue(`rate`, e.target.value ? sanitizedNumber(e.target.value) / (1 + vat_factor) : null, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                      });
                                      setPriceFieldKey((key) => key + 1);
                                  }}
                              />
                          </Grid>
                      )}
                      <Grid item xs={12} md={vat_factor ? 2 : 3}>
                          <TextField
                              label='Amount'
                              fullWidth
                              size='small'
                              value={calculatedAmount}
                              InputProps={{
                                  inputComponent: CommaSeparatedField,
                                  readOnly: true,
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                          <TextField
                              label='Remarks'
                              fullWidth
                              size='small'
                              {...register('remarks')}
                          />
                      </Grid>
                      <Grid item xs={12} md={12} textAlign={'end'}>
                          <Button
                              variant='contained'
                              size='small'
                              type='submit'
                              onClick={() => {
                                  setAddedProduct(null);
                                  setIsDirty(false);
                                  setPriceInclusiveVAT(0);
                              }}
                          >
                              {product_item ? (
                                  <>
                                      <CheckOutlined fontSize='small' /> Done
                                  </>
                              ) : (
                                  <>
                                      <AddOutlined fontSize='small' /> Add
                                  </>
                              )}
                          </Button>
                          {product_item && (
                              <Tooltip title='Close Edit'>
                                  <IconButton
                                      size='small'
                                      onClick={() => {
                                          setShowForm(false);
                                          setIsDirty(false);
                                      }}
                                  >
                                      <DisabledByDefault fontSize='small' color='success' />
                                  </IconButton>
                              </Tooltip>
                          )}
                      </Grid>
                  </>
              )}
              {!!openProductQuickAdd && <ProductQuickAdd setOpen={setOpenProductQuickAdd} setAddedProduct={setAddedProduct} />}
          </Grid>
      </form>
  );
}

export default RequisitionProductItemForm;