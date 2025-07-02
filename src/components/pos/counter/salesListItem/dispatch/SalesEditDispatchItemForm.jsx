import Div from '@jumbo/shared/Div';
import {Divider, Grid, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import productServices from 'app/prosServices/prosERP/productAndServices/products/product-services';
import React, { useEffect, useState } from 'react'
import { useCounter } from '../../CounterProvider';
import { useFormContext } from 'react-hook-form';
import StoreSelector from 'app/prosServices/prosERP/procurement/stores/StoreSelector';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function SalesEditDispatchItemForm() {
    const {outlet} = useCounter();//From counter provider
    const { stores, cost_center } = outlet; //Destructure outlet to get needed content
    const { authOrganization} = useJumboAuth();
    const {setValue, errors, watch, items} = useFormContext();
    const [isRetrieving, setIsRetrieving] = useState({});

    const retrieveBalances = async( productId, storeId, index) => {
        if(productId){
            const quantity = parseFloat(watch(`items.${index}.quantity`));

            setIsRetrieving(prevState => ({ ...prevState, [index]: true }));
            
            const balances = await productServices.getStoreBalances({
                as_at: watch(`dispatch_date`),
                productId: productId,
                storeIds: [storeId],
                costCenterId : cost_center?.id,
                sales_outlet_id : outlet.id
            });
            
            const availableBalance = parseFloat(balances.stock_balances.find(storeBalance => storeBalance.store_id === storeId && storeBalance.cost_center_id === outlet?.cost_center?.id)?.balance || 0);
            const currentBalance = balances.stock_balances.find(storeBalance => storeBalance.store_id === storeId && storeBalance.cost_center_id === outlet?.cost_center?.id)?.current_balance;

            await setValue(`items.${index}.available_balance`, availableBalance);
            await setValue(`items.${index}.current_balance`, parseFloat(currentBalance) + parseFloat(quantity || 0));

            setIsRetrieving(prevState => ({ ...prevState, [index]: false }));;
        } else {
            setValue(`items.${index}.available_balance`,'N/A');
        }
    }

    useEffect(() => {
        if (items) {
            items.forEach((item, index) => { 
              retrieveBalances(item.product.id , item.store?.id , index)
            });
        }
    }, [items]);    
    

  return (
    <>
        {
        items
            .map((item, index) => (
            <React.Fragment key={index}>
                <Grid
                    container
                    spacing={1}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                        bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={0.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>{index + 1}.</Div>
                    </Grid>
                    <Grid item xs={9.5} md={8} lg={4}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Dispatched Product'>
                                <Typography>{item.product.name}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign={'center'} item xs={2} md={3.5} lg={1}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Dispatched Quantity'>
                                <Typography>{`${item.sale_item.measurement_unit?.symbol} ${item.quantity}`}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                        <Div sx={{ mt: 0.7, mb: 0.5 }}>
                            <StoreSelector
                                allowSubStores={true}
                                defaultValue={watch(`items.${index}.store`)}
                                proposedOptions={stores}
                                includeStores={authOrganization.stores}
                                frontError={errors?.items?.[index]?.store_id}  
                                onChange={(newValue) => {
                                    newValue !== null && retrieveBalances(item.product.id, newValue.id, index);
                                    setValue(`items.${index}.store_id`, newValue && newValue.id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={6} md={3} lg={2}>
                        <Div sx={{ mt: 0.7, mb: 0.5 }}>
                            {
                                isRetrieving[index] ? <LinearProgress /> :
                                <TextField
                                    label="Available Balance"
                                    fullWidth
                                    size='small'
                                    value={watch(`items.${index}.available_balance`)}
                                    InputProps={{ 
                                        readOnly: true,
                                        endAdornment: <span>{item.product && item.product.measurement_unit?.symbol}</span>
                                    }}
                                />
                            }
                        </Div>
                    </Grid>
                    <Grid item xs={6} md={3} lg={2}>
                        <Div sx={{ mt: 0.7, mb: 0.5 }}>
                            <TextField
                                label='Dispatch Quantity'
                                fullWidth
                                size='small'
                                error={!!errors?.items && !!errors.items[index] && !!errors.items[index].quantity}
                                helperText={errors?.items && errors.items[index] && errors.items[index].quantity?.message}
                                value={watch(`items.${index}.quantity`) || ''}
                                onChange={(e) => {
                                    setValue(`items.${index}.quantity`,  e.target.value, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    // Trigger Revalidation for the store field
                                    setValue(`items.${index}.store_id`, watch(`items.${index}.store_id`), {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                </Grid>
            </React.Fragment>
        ))}
    </>
  )
}

export default SalesEditDispatchItemForm