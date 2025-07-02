import Div from '@jumbo/shared/Div';
import {Divider, Grid, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import productServices from 'app/prosServices/prosERP/productAndServices/products/product-services';
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { useCounter } from '../../CounterProvider';
import StoreSelector from 'app/prosServices/prosERP/procurement/stores/StoreSelector';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function SalesDispatchItemForm() {
    const {outlet} = useCounter();//From counter provider
    const { stores, cost_center } = outlet; //Destructure outlet to get needed content
    const {setValue, errors, sale_items, watch} = useFormContext();
    const { authOrganization} = useJumboAuth();

    const [isRetrieving, setIsRetrieving] = useState({});

    const retrieveBalances = async( productId, storeId, measurement_unit_id, index) => {
        if(productId && storeId !== null){
            setIsRetrieving(prevState => ({ ...prevState, [index]: true }));
            const balances = await productServices.getStoreBalances({
                as_at: watch(`dispatch_date`),
                productId: productId,
                storeIds: [storeId],
                costCenterId : cost_center?.id,
                sales_outlet_id : outlet.id,
                measurement_unit_id: measurement_unit_id
            });

            const availableBalance = balances.stock_balances.find(storeBalance => storeBalance.store_id === storeId && storeBalance.cost_center_id === outlet?.cost_center?.id)?.balance;
            const currentBalance = balances.stock_balances.find(storeBalance => storeBalance.store_id === storeId && storeBalance.cost_center_id === outlet?.cost_center?.id)?.current_balance;

            await setValue(`items.${index}.measurement_unit_id`,measurement_unit_id);
            await setValue(`items.${index}.available_balance`,availableBalance === undefined ? 0 : availableBalance);
            await setValue(`items.${index}.current_balance`, currentBalance === undefined ? 0 : currentBalance);

            setIsRetrieving(prevState => ({ ...prevState, [index]: false }));
        } else {
            setValue(`items.${index}.available_balance`,0);
        }
    }

    // Update the quantity field whenever undispatched_quantity changes
    useEffect(() => {
        sale_items
        .filter(item => item.undispatched_quantity !== 0)
        .forEach((item, index) => {
            setValue(`items.${index}.quantity`, item.undispatched_quantity);
        });
    }, [sale_items]);

    useEffect(() => {
        sale_items
          .filter((item) => item.undispatched_quantity > 0)
          .forEach((item, index) => {
            retrieveBalances(watch(`items.${index}.product_id`), watch(`items.${index}.store_id`),item.measurement_unit_id, index);
          });
    }, [watch(`dispatch_date`)]);

  return (
    <>
        {sale_items
            .filter((item) => item.undispatched_quantity !== 0)
            .map((item, index) => (
            <React.Fragment key={item.id}>
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
                            <Tooltip title='Product'>
                                <Typography>{item.product.name}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign={'center'} item xs={2} md={3.5} lg={1}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Undispatched Quantity'>
                                <Typography>{`${item.measurement_unit.symbol} ${item.undispatched_quantity}`}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                        <Div sx={{ mt: 0.7, mb: 0.5 }}>
                            <StoreSelector
                                allowSubStores={true}
                                proposedOptions={stores}
                                includeStores={authOrganization.stores}
                                frontError={errors?.items?.[index]?.store_id}  
                                onChange={(newValue) => {
                                    newValue !== null && retrieveBalances(item.product.id, newValue.id,item.measurement_unit_id, index);
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
                                        endAdornment: <span>{item.product && item.measurement_unit.symbol}</span>
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

export default SalesDispatchItemForm