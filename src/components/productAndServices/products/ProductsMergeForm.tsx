import { Autocomplete, Button, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, Grid, TextField} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductSelect from './ProductSelect'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form';
import { useProductsSelect } from './ProductsSelectProvider';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useMutation, useQueryClient } from 'react-query';
import productServices from './product-services';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

function ProductsMergeForm({toggleOpen}) {
  const { productOptions } = useProductsSelect();
  const [selectedDissolveProducts, setSelectedDissolveProducts] = useState([]);
  const [selectedRemainProduct, setSelectedRemainProduct] = useState([]);
  const queryClient = useQueryClient();
  const {enqueueSnackbar} = useSnackbar();

  const newProductOptions=[...selectedRemainProduct[0] ? productOptions.filter(product => product.id !== selectedRemainProduct[0]?.id).filter(product => product.type === selectedRemainProduct[0]?.type) : productOptions]

  const mergeProducts = useMutation(productServices.mergeProducts,{
    onSuccess: (data) => {
        toggleOpen(false);
        enqueueSnackbar(data.message,{variant : 'success'});
        queryClient.invalidateQueries(['products']);
    }
  });

  const validationSchema = yup.object().shape({
    remaining_product_id: yup.number().required('Please select a product to remain').typeError('Please select a product to remain'),
    dissolved_products_ids: yup.array().required('Please select products to dissolve').min(1, 'Please select at least one product to dissolve')
  });
 
  const { setValue, handleSubmit, clearErrors, formState:{ errors}} = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
  // Reset Products To Dissolve field and clear selectedDissolveProducts when selectedRemainProduct changes
  setSelectedDissolveProducts([]);
  setValue('dissolved_products_ids', []);
}, [selectedRemainProduct, setValue]);

  const saveMutation = React.useMemo(() => {
    return mergeProducts.mutate
},[mergeProducts]);

  return (
    <form autoComplete='false' onSubmit={handleSubmit(saveMutation)}>
      <DialogTitle>
        <Grid textAlign={'center'}>Products Merge</Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={2} rowSpacing={1} mt={1}>
          <Grid item xs={12} md={6}>
            <ProductSelect
              label='Product To Remain'
              frontError={errors.remaining_product_id}
              onChange={(newValue) => {
                newValue?.id && clearErrors(`remaining_product_id`);
                setSelectedRemainProduct(newValue ? [newValue] : []);
                setValue(`remaining_product_id`, newValue ? newValue.id : []);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={newProductOptions}
              getOptionLabel={(product) => product.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedDissolveProducts}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth
                  error={!!errors?.dissolved_products_ids}
                  helperText={errors?.dissolved_products_ids?.message}
                  size='small'
                  label='Products To Dissolve' 
                />
              )}

              renderTags={(tagValue, getTagProps)=> {
                return tagValue.map((option, index)=>{
                  const {key, ...restProps} = getTagProps({index});
                  return <Chip {...restProps} key={option.id+"-"+key} label={option.name} />
                 })
              }}
              renderOption={(props, option, { selected }) => {
                const { key, ...restProps} = props
                return (
                  <li {...restProps} key={option.id+"-"+key}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name}
                  </li>
                )
              }}
              onChange={(e,newValue) => {
                newValue && clearErrors(`dissolved_products_ids`);
                setValue(`dissolved_products_ids`, newValue ? newValue.map(product => product.id): []);
                setSelectedDissolveProducts(newValue)
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={() => toggleOpen(false)}>Cancel</Button>
          <LoadingButton 
              type='submit'
              loading={mergeProducts.isLoading} 
              variant='contained'
              size='small' 
          >Merge</LoadingButton>
      </DialogActions>
    </form>
  )
}

export default ProductsMergeForm