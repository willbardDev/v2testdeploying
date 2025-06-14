import React, { useEffect, useState } from 'react'
import ProductsSelectProvider from '../../../productAndServices/products/ProductsSelectProvider'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Checkbox, Chip, DialogContent, DialogTitle, Grid, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import ProductSelect from '../../../productAndServices/products/ProductSelect'
import CostCenterSelector from '../../../masters/costCenters/CostCenterSelector';
import storeServices from '../../stores/store-services';
import { useQuery } from 'react-query';
import { CheckBox, CheckBoxOutlineBlank, ExpandMoreOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { DateTimePicker } from '@mui/x-date-pickers';
import productServices from '../../../productAndServices/products/product-services';

function ProductInsights() {
  const {authOrganization} = useJumboAuth();
  const [product, setProduct] = useState(null);
  const [averageCost, setAverageCost] = useState(0);
  const {costCenters} = authOrganization;

  const {setValue,watch} = useForm({
    defaultValues: {
      from: dayjs().startOf('month').toISOString(),
      to: dayjs().toISOString(),
      cost_centers: [],
      store_ids: []
    }
  });

  //Fetching Stores
  const { data: stores, isLoading: isFetchingStores } = useQuery('stores', storeServices.getStoreOptions);

   //Retrieve the latest unit cost
  const {data: balances, isLoading: isLoadingBalances} = useQuery(
    [
      'balances',
      {
        product_id: product?.id,
        cost_center_ids: watch('cost_centers').map(cost_center => cost_center.id),
        asOf: watch('to'),
        store_ids: watch('store_ids')
      }
    ],
    async() => {
      const cost_center = !!watch('cost_centers') && watch('cost_centers').length === 1 && watch('cost_centers')[0];
      if(product?.id && watch('to') && watch('store_ids').length > 0 && cost_center){
        return await productServices.getStoreBalances({
          productId: product.id,
          costCenterId : cost_center.id,
          storeIds: watch('store_ids'),
          sales_outlet_id: cost_center.type === "Sales Outlet" && cost_center.cost_centerable_id
        })
      } else {
        return null;
      }
    }
  );

  useEffect(() => {
    if(stores && stores.length === 1){
      setValue('store_ids', stores.map(store => store.id));
    }
  }, [stores])

  useEffect(() => {
    if(costCenters.length === 1){
      setValue('cost_centers', costCenters);
    }
  }, [costCenters])

  useEffect(() => {
    const unit_cost = balances?.stock_balances && balances.stock_balances.length > 0 ? balances.stock_balances[balances.stock_balances.length-1].unit_cost : 0;
    unit_cost ? setAverageCost(unit_cost) : setAverageCost(0);
  }, [balances])
  

  if (isFetchingStores) {
    return <LinearProgress />;
  }

  return (
    <React.Fragment>
      <DialogTitle textAlign={'center'}>{`${product ? product.name : 'Product'} Insights`}</DialogTitle>
      <DialogContent>
        <ProductsSelectProvider>
          <Grid container columnSpacing={1} rowSpacing={2} mt={1}>
            <Grid item xs={12} lg={6}>
                <ProductSelect
                  onChange={(newValue) => {
                    setProduct(newValue);
                    setValue('product_id', newValue ? newValue.id : null);
                  }}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <DateTimePicker
                label="From (MM/DD/YYYY)"
                fullWidth
                minDate={dayjs(authOrganization.organization.recording_start_date)}
                defaultValue={dayjs().startOf('month')}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
                onChange={(newValue) => {
                  setValue('from', newValue ? newValue.toISOString() : null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12}  md={6} lg={3}>
              <DateTimePicker
                label="To (MM/DD/YYYY)"
                fullWidth
                minDate={dayjs(watch('from'))}
                defaultValue={dayjs()}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
                onChange={(newValue) => {
                  setValue('from', newValue ? newValue.toISOString() : null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            {
              product?.type === 'Inventory' &&
              <Grid item xs={12} lg={6}>
                <Autocomplete
                  multiple
                  id="checkboxes-stores"
                  options={stores}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.name}
                  value={stores.filter(store => watch('store_ids').includes(store.id))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Stores"
                      size="small"
                      fullWidth
                    />
                  )}
                  onChange={(e, stores) => {
                    setValue('store_ids', stores.map(store => store.id));
                  }}

                  renderTags={(tagValue, getTagProps)=> {
                    return tagValue.map((option, index)=>{
                      const {key, ...restProps} = getTagProps({index});
                      return <Chip {...restProps} key={option.id+"-"+key} label={option.name} />
                    })
                  }}

                  {...{ renderOption: (props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}}
                />
              </Grid>
            }
            <Grid item xs={12} lg={6}>
                <CostCenterSelector
                  allowSameType={true}
                  defaultValue={costCenters.length === 1  && costCenters}
                  onChange={(cost_centers) => {
                    setValue('cost_centers',cost_centers)
                  }}
                />
            </Grid>
            {/* {
              <React.Fragment>
                <Grid item xs={6} md={4} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        onChange={(e) => {
                            
                        }} 
                        name="cost_trend"
                      />
                    }
                    label="Cost Trend"
                  />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        onChange={(e) => {
                            
                        }} 
                        name="stock_trend"
                      />
                    }
                    label="Stock Trend"
                  />
                </Grid>
              </React.Fragment>
            }
            <Grid item xs={6} md={4} lg={2}>
              <FormControlLabel
                control={
                  <Checkbox 
                    onChange={(e) => {
                        
                    }} 
                    name="Price Trend"
                  />
                }
                label="Price Trend"
              />
            </Grid> */}
          </Grid>
          {
            isLoadingBalances ? <LinearProgress/> :
            <React.Fragment>
            <Grid container columnSpacing={1} rowSpacing={1} mt={2} mb={2}>
                {
                  balances?.stock_balances &&
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ fontWeight:'bold' }}>Latest Average Cost:</Typography>
                      <Typography>{averageCost.toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                }
                {
                  balances?.selling_price &&
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ fontWeight:'bold' }}>Latest Selling Price:</Typography>
                      <Typography>{balances.selling_price.bottom_cap.toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                }
                {
                  balances?.stock_balances && balances?.selling_price &&
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ fontWeight:'bold' }}>Potential Profit:</Typography>
                      <Typography>{(balances.selling_price.bottom_cap-averageCost).toLocaleString()}</Typography>
                    </Stack>
                  </Grid>
                }
            </Grid>
            {
              balances?.stock_balances && balances.stock_balances.length > 0 && 
              <Paper elevation={2}>
                <Accordion defaultExpanded={true}>
                  <AccordionSummary
                      expandIcon={<ExpandMoreOutlined/>}
                  >
                    <Typography sx={{ fontWeight:'bold' }}>Stock Availability</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {
                      balances.stock_balances.map((stock_balance,index) => (
                        <Grid container rowSpacing={1} columnSpacing={1} key={index}
                          sx={{
                            cursor: 'pointer',
                            borderTop: 1,
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                            padding: 1,
                          }}
                        >
                          <Grid item xs={12} md={6} lg={4}>
                            <Stack direction="row" spacing={1}>
                              <Typography sx={{ fontWeight:'bold' }}>Store:</Typography>
                              <Typography>{stores.find(store => store.id === stock_balance.store_id).name}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6} lg={2.5}>
                            <Stack direction="row" spacing={1}>
                              <Typography sx={{ fontWeight:'bold' }}>Stock Balance:</Typography>
                              <Typography>{stock_balance.balance}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6} lg={2.5}>
                            <Stack direction="row" spacing={1}>
                              <Typography sx={{ fontWeight:'bold' }}>Avg Cost:</Typography>
                              <Typography>{averageCost.toLocaleString()}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6} lg={2.5}>
                            <Stack direction="row" spacing={1}>
                              <Typography sx={{ fontWeight:'bold' }}>Value:</Typography>
                              <Typography>{(stock_balance.balance*averageCost).toLocaleString()}</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      ))
                    }
                  </AccordionDetails>
                </Accordion>
              </Paper>
            }
            </React.Fragment>
          }
        </ProductsSelectProvider>
      </DialogContent>
    </React.Fragment>
  )
}

export default ProductInsights