import Div from '@jumbo/shared/Div/Div';
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react'
import * as yup from "yup";
import PriceListsItemForm from './PriceListItemForm';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PriceListsItemRow from './PriceListItemRow';
import OutletSelector from '../../outlets/OutletSelector';
import priceListServices from '../priceLists-services';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector';
import StoreSelector from 'app/prosServices/prosERP/procurement/stores/StoreSelector';
import { HighlightOff } from '@mui/icons-material';

function PriceListForm({ toggleOpen, priceList = null }) {
  const [effective_date] = useState(priceList ? dayjs(priceList.effective_date) : dayjs());
  const [items, setItems] = useState(priceList ? priceList.items : []);
  const [applicableOutlets, setApplicableOutlets] = useState(priceList ? priceList.items[0].sales_outlets : []);
  const [costInsights, setCostInsights] = useState(false);
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [submitItemForm, setSubmitItemForm] = useState(false);

  const validationSchema = yup.object({
    effective_date: yup.string().required('Effective Date is required'),
    sales_outlets: yup.array().min(1, "You must add at least one outlet").of(
        yup.object().required('Outlet is required').typeError('Outlet is required')
      ).typeError('You must add at least one outlet'),
    items: yup.array().min(1, "You must add at least one item").typeError('You must add at least one item').of(
      yup.object().shape({
        product_id: yup.number().required("Product is required").positive('Product is required').typeError('Product is required'),
        price: yup.number().required("Price is required").positive("Price is required").typeError('Price is required'),
        bottom_cap: yup.number().positive("Invalid bottom cap").typeError('Invalid bottom cap'),
      })
    ),
  });

  const { setValue, setError, handleSubmit, watch, register, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      effective_date: effective_date.toISOString(),
      id: priceList && priceList.id,
      items: priceList && priceList.items,
      sales_outlets: priceList && priceList.items[0].sales_outlets,
      narration: priceList && priceList.narration
    }
  });

  const addPriceList = useMutation(priceListServices.add,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['priceLists']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })
    
  const updatePriceList = useMutation(priceListServices.update,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['priceLists']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  });

  const saveMutation = React.useMemo(() => {
    return priceList ? updatePriceList : addPriceList
  },[updatePriceList,addPriceList]);

  const onSubmit = (data) => {
    if (items.length === 0) {
      setError(`items`, {
        type: "manual",
        message: "You must add at least one item",
      });
      return;
    } else if (isDirty) {
      setShowWarning(true);
    } else {
      handleSubmit((data) => saveMutation.mutate(data))();
    }
  };  

  const handleConfirmSubmitWithoutAdd = () => {
    handleSubmit((data) => saveMutation.mutate(data))();
    setIsDirty(false);
    setShowWarning(false);
    setClearFormKey(prev => prev + 1)
  };

  //Set Item values
  React.useEffect(() => {
    async function loopItems() {
      await setValue(`items`, null);
      await items.forEach((item, index) => {
        setValue(`items.${index}.product_id`, item?.product?.id ? item.product.id : item.product_id);
        setValue(`items.${index}.sales_outlet_ids`, applicableOutlets.map(outlet => outlet.id));
        setValue(`items.${index}.price`, item.price);
        setValue(`items.${index}.measurement_unit_id`, item.measurement_unit_id);
        setValue(`items.${index}.bottom_cap`, item.bottom_cap);
      });
    }
    loopItems();
  }, [items, applicableOutlets, priceList]);

  //for Cost Insights
  const costCenterId = watch(`cost_center_id`);
  const storeId = watch(`store_id`);

  return (
    <React.Fragment>
      <DialogTitle>
        <Grid item xs={12} textAlign={"center"} mb={2}>
          {priceList ? `Edit Price List` : `New Price List`}
        </Grid>
          <form autoComplete='off'>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4} lg={4}>
                <Div sx={{ mt: 1, mb: 1 }}>
                  <DatePicker
                    fullWidth
                    label="Effective Date"
                    defaultValue={effective_date}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        readOnly: true,
                      }
                    }}
                    onChange={(newValue) => {
                      setValue('effective_date', newValue ? newValue.toISOString() : null, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <Div sx={{ mt: 1, mb: 1 }}>
                  <OutletSelector
                    multiple={true}
                    defaultValue={applicableOutlets}
                    label='Applicable Outlets'
                    frontError={errors.sales_outlets}
                    onChange={(newValue) => {
                      setApplicableOutlets(newValue);
                      setValue(`sales_outlets`, newValue,{
                        shouldDirty: true,
                        shouldValidate: true
                      })
                    }}
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Grid container rowSpacing={0.3}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Checkbox
                      checked={costInsights}
                      size='small'
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setCostInsights(isChecked);
                      }}
                    />
                    <Typography>Cost Insights</Typography>
                  </Stack>
                  {
                    !!costInsights &&
                      <>
                        <Grid item xs={12}>
                          <Div sx={{ mt: 0.5}}>
                            <StoreSelector
                              allowSubStores={true}
                              onChange={(newValue) => {
                                setValue('store_id', newValue ? newValue.id : '', {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </Div>
                        </Grid>
                        <Grid item xs={12}>
                          <Div sx={{mt: 0.5}}>
                            <CostCenterSelector
                              label="Cost Center"
                              multiple={false}
                              frontError={errors.cost_center_id}
                              onChange={(newValue) => {
                                setValue('cost_center_id', newValue?.id ? newValue.id : null,{
                                  shouldValidate: true,
                                  shouldDirty: true
                                });
                              }}
                            />
                          </Div>
                        </Grid>
                      </>
                  }
                </Grid>
              </Grid>
              <Grid item xs={12} md={8} lg={8} alignItems={'start'}>
                <Div sx={{ mt: {xs: 1, md : !!costInsights ? 6 : 1}, mb: 1 }}>
                  <TextField
                    label='Narration'
                    fullWidth
                    multiline={true}
                    minRows={2}
                    error={!!errors?.narration}
                    helperText={errors?.narration?.message}
                    {...register('narration')}
                  />
                </Div>
              </Grid>
            </Grid>
          </form>
        <Grid item xs={12}>
          <Divider />
          <PriceListsItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} costInsights={costInsights} costCenterId={costCenterId} storeId={storeId} setItems={setItems} items={items} />
        </Grid>
      </DialogTitle>
      <DialogContent>
        {errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>}
        
        {items.map((item, index) => (
          <PriceListsItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} index={index} setItems={setItems} items={items} item={item} />
        ))}

        <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
          <DialogTitle>            
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={11}>
                Unsaved Changes
              </Grid>
              <Grid item xs={1} textAlign="right">
                <Tooltip title="Close">
                  <IconButton
                    size="small" 
                    onClick={() => setShowWarning(false)}
                  >
                    <HighlightOff color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            Last item was not added to the list
          </DialogContent>
          <DialogActions>
            <Button size="small" onClick={() => {setSubmitItemForm(true); setShowWarning(false);}}>
              Add and Submit
            </Button>
            <Button size="small" onClick={handleConfirmSubmitWithoutAdd} color="secondary">
              Submit without add
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={addPriceList.isLoading || updatePriceList.isLoading}
          variant='contained'
          size='small'
          onClick={onSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </React.Fragment>
  )
}

export default PriceListForm;
