import { Button, Divider, FormControl, Grid, IconButton, LinearProgress, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import ProductSelect from '../../../productAndServices/products/ProductSelect';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useSalesOutlet } from '../../outlets/OutletProvider';
import productServices from 'app/prosServices/prosERP/productAndServices/products/product-services';
import ProductQuickAdd from 'app/prosServices/prosERP/productAndServices/products/ProductQuickAdd';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useProductsSelect } from 'app/prosServices/prosERP/productAndServices/products/ProductsSelectProvider';


function ProformaItemForm({setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, item = null,index = -1,setItems, items = [], setShowForm = null, vat_percentage}) {
    const {activeOutlet} = useSalesOutlet();
    const vat_factor = vat_percentage*0.01;
    const [openProductQuickAdd, setOpenProductQuickAdd] = useState(false);
    const { productOptions } = useProductsSelect();
    const [addedProduct, setAddedProduct] = useState(null);
    const {checkOrganizationPermission} = useJumboAuth();
    const [calculatedAmount, setCalculatedAmount] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState(item && (item.measurement_unit_id ? item.measurement_unit_id : item.measurement_unit.id));

    const [priceInclusiveVAT, setPriceInclusiveVAT] = useState(0);
    const [isVatfieldChange, setIsVatfieldChange] = useState(false);
    const [priceFieldKey, setPriceFieldKey] = useState(0)
    const [vatPriceFieldKey, setVatPriceFieldKey] = useState(0)

    //Define validation Schema
    const validationSchema = yup.object({
        product: yup.object().required("Product is required").typeError('Product is required'),
        quantity: yup.number().positive('Quantity is required').required('Quantity is required').typeError('Quantity is required'),
        rate: yup.number().required("Price is required").positive("Price is required").typeError('Price is required'),
    })

    const {setValue, handleSubmit, watch, reset, register, formState: {errors, dirtyFields}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            product: item && productOptions.find(product => product.id === (item.product_id || item.product.id)),
            quantity: item && item.quantity,
            rate: item && item.rate,
            measurement_unit_id: item && (item.measurement_unit_id ? item.measurement_unit_id : item.measurement_unit.id),
            unit_symbol:item && (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item.unit_symbol),
        }
    });

    useEffect(() => {
        setIsDirty(Object.keys(dirtyFields).length > 0); // Update dirty state
    }, [dirtyFields, setIsDirty, watch]);

    // setvalues from coming addedProduct
    useEffect(() => {
        if(addedProduct?.id){
            setValue('product', addedProduct);
            setValue('measurement_unit_id', addedProduct.measurement_unit_id);
            setValue('unit_symbol', addedProduct.measurement_unit.symbol);
            setSelectedUnit(addedProduct?.measurement_unit_id)
            setOpenProductQuickAdd(false)
        }
    }, [addedProduct])

    const { isFetching } = useQuery(['sellingPrice', {id: watch('product')?.id}], async() => {
        const product_id = watch('product')?.id;
        if(product_id){
            const response = await productServices.getSellingPrices({productId: product_id, sales_outlet_id: activeOutlet.id });
            setValue('rate', response.price,{
                shouldDirty: true,
                shouldValidate: true
            });
        }
    });

    const calculateAmount = () => {
        const quantity = parseFloat(watch(`quantity`) || item?.quantity) || 0;
        const rate = parseFloat(watch(`rate`)) || (item?.rate || 0);
        return quantity * rate * (1 + (!product?.vat_exempted ? vat_factor : 0));
    };

    // Recalculate amount when relevant fields change
    useEffect(() => {
        const amount = calculateAmount();
        setCalculatedAmount(amount);
    }, [watch('quantity'), watch('rate'), vat_factor]);

    const [isAdding, setIsAdding] = useState(false);

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
                submitMainForm()
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

    if(isAdding){
        return <LinearProgress/>
    }

    const product = watch('product');

    const combinedUnits = product?.secondary_units?.concat(product?.primary_unit);
    
  return (
    <form autoComplete='off' onSubmit={handleSubmit(updateItems)} >
        <Divider/>
        <Grid container columnSpacing={1} rowSpacing={1} mb={1} mt={1}>
            {!openProductQuickAdd && !item && (
                <Grid item xs={12} textAlign={'center'} >
                    <Typography variant='h5'>Add Item</Typography>
                </Grid>
            )}
            {!!openProductQuickAdd && !item && (
                <Grid item xs={12} textAlign={'center'} >
                    <Typography variant='h5'>Quick Product Registration</Typography>
                </Grid>
            )}

        {!openProductQuickAdd && 
            <>
                <Grid item xs={12} md={vat_factor ? 3.5 : 5}>
                    <ProductSelect
                        label='Product/Service'
                        frontError={errors.product}
                        defaultValue={item && item.product}
                        addedProduct={addedProduct}
                        onChange={(newValue) => {
                            if (newValue) {
                                setIsVatfieldChange(false);
                                
                                setValue(`product`, newValue, {
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                                setAddedProduct(null);
                                setSelectedUnit(newValue.primary_unit ? newValue?.primary_unit?.id : newValue?.measurement_unit_id)
                                setValue('measurement_unit_id', newValue.primary_unit ? newValue?.primary_unit?.id : newValue?.measurement_unit_id);
                                setValue('unit_symbol', newValue.primary_unit ? newValue?.primary_unit?.unit_symbol : newValue?.measurement_unit.symbol)
                                setValue(`product_id`,newValue?.id);
                            } else {
                                setValue(`product`, null, {
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                                setSelectedUnit(null)
                                setValue('measurement_unit_id', null);
                                setValue('unit_symbol', null)
                                setValue(`product_id`,null);
                                setValue('rate', 0,{
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                            }
                        }}
                        startAdornment={
                            checkOrganizationPermission([PERMISSIONS.PRODUCTS_CREATE]) &&
                            <Tooltip title={'Add New Product'}>
                                <AddOutlined
                                    onClick={() => setOpenProductQuickAdd(true)}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                />
                            </Tooltip>
                        }
                    />
                </Grid>
                <Grid item xs={12} md={vat_factor ? 2.5 : 3}>
                    <TextField
                        label="Quantity"
                        fullWidth
                        size='small'
                        InputProps={{ 
                            endAdornment: (
                             !!product && !!selectedUnit &&
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={!!selectedUnit && selectedUnit}
                                            onChange={async(e) => {
                                                setSelectedUnit(e.target.value)
                                                const selectedUnitId = e.target.value;
                                                const selectedUnit = combinedUnits?.find(unit => unit.id === selectedUnitId);
                                                if (selectedUnit) {
                                                    await setValue('measurement_unit_id', selectedUnit.id);
                                                    setValue('unit_symbol', selectedUnit?.unit_symbol);
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
                            ),
                        }}
                        error={!!errors?.quantity}
                        helperText={errors?.quantity?.message}
                        {...register(`quantity`)}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                {
                    isFetching ? <LinearProgress /> :
                    <TextField
                        label="Price"
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
                            setValue(`rate`,e.target.value ? sanitizedNumber(e.target.value ) : 0, {
                                shouldValidate: true,
                                shouldDirty: true
                            });
                            setVatPriceFieldKey(key => key + 1)
                        }}
                    />
                }
                </Grid>
                {
                    !!vat_factor &&
                    <Grid item  xs={12} md={2}>
                        <TextField
                            label="Price (VAT Inclusive)"
                            fullWidth
                            key={vatPriceFieldKey}
                            size='small'
                            error={!!errors?.rate}
                            helperText={errors?.rate?.message}
                            InputProps={{
                                inputComponent: CommaSeparatedField,
                            }}
                            value={isVatfieldChange ? 
                                (Math.round(priceInclusiveVAT * 100000) / 100000) : 
                                Math.round((watch('rate') * (1+(!product?.vat_exempted ? vat_factor : 0))) * 100000) / 100000
                            }
                            onChange={(e) => {
                                setIsVatfieldChange(true);
                                setPriceInclusiveVAT(e.target.value ? sanitizedNumber(e.target.value) : 0);
                                setValue(`rate`,e.target.value ? sanitizedNumber(e.target.value )/(1+(product?.vat_exempted !== 1 ? vat_factor : 0)): 0,{
                                    shouldValidate: true,
                                    shouldDirty: true
                                });
                                setPriceFieldKey(key => key + 1)
                            }}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={2}>
                    <TextField
                        label="Amount"
                        fullWidth
                        size='small'
                        value={calculatedAmount}
                        InputProps={{
                            inputComponent: CommaSeparatedField,
                            readOnly: true
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={12} textAlign={'end'}>
                    <Button
                        variant='contained'
                        size='small'
                        type='submit'
                        onClick={() => {
                            setAddedProduct(null);
                        }}                          
                    >
                        {
                            item ? (
                                <><CheckOutlined fontSize='small' /> Done</>
                            ) : (
                                <><AddOutlined fontSize='small' /> Add</>
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
                                <DisabledByDefault fontSize='small' color='success'/>
                            </IconButton>
                        </Tooltip>
                    }
                </Grid>
            </>    
        }

        {!!openProductQuickAdd && <ProductQuickAdd setOpen={setOpenProductQuickAdd} setAddedProduct={setAddedProduct}/>}
        </Grid>
    </form>
  )
}

export default ProformaItemForm