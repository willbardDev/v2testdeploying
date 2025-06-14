import { useSnackbar } from 'notistack';
import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { useProductApp } from './ProductsProvider';
import { Autocomplete, Button, Grid, TextField} from '@mui/material';
import Div from '@jumbo/shared/Div';
import * as yup  from "yup";
import productServices from './product-services';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

function ProductQuickAdd({setOpen, setAddedProduct}) {
    const {productCategories,item_names,brands,models,measurementUnits,specifications} = useProductApp();
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();

    const addProduct = useMutation(productServices.add,{
        onSuccess: (data) => {
            queryClient.invalidateQueries(['product_select_options']);
            setOpen(false);
            enqueueSnackbar(data.message,{variant : 'success'});
            setAddedProduct(data.product);
            queryClient.invalidateQueries(['products']);
            queryClient.invalidateQueries(['productParams']);
        }
    });

    const validationSchema = yup.object({
        item_name: yup.string('Enter your Product name').required('Product name is required'),
        product_category_id: yup.number('Choose an Product category').min(1, 'Product category is required').required('Product category is required'),
        measurement_unit_id: yup.number('Choose a measurement unit').min(1, 'Measurement unit is required').required('Measurement unit is required'),
        type: yup.string('Choose an Product type').required('Product type is required'),
    });

    const {register,setValue, handleSubmit, formState:{ errors}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            vat_exempted: false,
        }
    });

    const saveMutation = React.useMemo(() => {
        return addProduct.mutate
    },[addProduct]);

  return (
    <>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={productCategories}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Product Category"
                            error={!!errors.product_category_id}
                            helperText={errors.product_category_id?.message}
                        />
                    )}
                    onChange={(event, newValue) => {
                        setValue('product_category_id',newValue ? newValue.id : 0,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    options={[
                        {
                            name:'Inventory'
                        },
                        {
                            name:'Non-Inventory'
                        },
                        {
                            name:'Service'
                        },
                        // {
                        //     name: 'Individually-Tracked'
                        // }
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params} 
                            label="Type"
                            error={!!errors.type}
                            helperText={errors.type?.message}
                        />
                        )
                    }
                    onChange={(event, newValue) => {
                        setValue('type',newValue ? newValue.name : '',{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    freeSolo
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    options={item_names}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Product Name"
                            error={!!errors.item_name}
                            helperText={errors.item_name?.message}
                        />
                    )
                    }
                    onChange={(event, newValue) => {
                        setValue('item_name',newValue ? newValue : '',{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                    onInputChange={(event, newValue) => {
                        setValue('item_name',newValue ? newValue : '',{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    freeSolo
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    options={brands}
                    renderInput={(params) => <TextField {...params} label="Brand (Optional)"/>}
                    onChange={(event, newValue) => {
                        setValue('brand',newValue ? newValue : null,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                    onInputChange={(event, newValue) => {
                        setValue('brand',newValue ? newValue : '',{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}

                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    freeSolo
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    options={models}
                    renderInput={(params) => <TextField {...params} label="Model (Optional)"/>}
                    onChange={(event, newValue) => {
                        setValue('model',newValue,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                    onInputChange={(event, newValue) => {
                        setValue('model',newValue,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}

                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    freeSolo
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    options={specifications}
                    renderInput={(params) => (
                            <TextField
                                {...params}
                                rows={2}
                                label="Specifications (Optional)"
                            />
                        )
                    }
                    onChange={(event, newValue) => {
                        setValue('specifications',newValue ? newValue : null,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                    onInputChange={(event, newValue) => {
                        setValue('specifications',newValue ? newValue : '',{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}

                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <Autocomplete
                    size="small"
                    getOptionLabel={(option) => 
                        option.name !== option.symbol ? `${option.name} (${option.symbol})` : option.name
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={measurementUnits}
                    renderInput={(params) => (
                        <TextField 
                        {...params} 
                        label="Measurement Unit"
                        error={!!errors.measurement_unit_id}
                        helperText={errors.measurement_unit_id?.message}
                        />
                    )}
                    onChange={(event, newValue) => {
                        setValue('measurement_unit_id',newValue ? newValue.id : 0,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <TextField
                    size='small'
                    fullWidth
                    label='SKU (Optional)'
                    {...register('sku')}
                    error={!!errors.sku}
                    helperText={errors.sku?.message}                      
                />
            </Div>
        </Grid>
        <Grid item xs={12} md={4}>
            <Div sx={{mt: 1, mb: 1}}>
                <TextField
                    size='small'
                    fullWidth
                    multiline={true}
                    rows={2}
                    label='Description (Optional)'
                    {...register('description')}
                />
            </Div>
        </Grid>
        <Grid item xs={12}sx={{textAlign: 'end'}}>
            <Div sx={{mt: 1, mb: 1}}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <LoadingButton 
                    type='submit'
                    loading={addProduct.isLoading} 
                    onClick={handleSubmit(saveMutation)}
                    variant='contained' size='small' 
                >
                    Add
                </LoadingButton>
            </Div>
        </Grid>
    </>
  )
}

export default ProductQuickAdd