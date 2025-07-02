import { yupResolver } from '@hookform/resolvers/yup';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div';
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Button, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup'
import SalesDispatchItemForm from './SalesDispatchItemForm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import posServices from '../../../pos-services';
import SalesEditDispatchItemForm from './SalesEditDispatchItemForm';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function SalesDispatchForm({toggleOpen, sale = null, deliveryData = null}) {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); 
    const [dispatch_date] = useState(deliveryData ? dayjs(deliveryData.dispatch_date) : dayjs());
    const {authOrganization : {organization}} = useJumboAuth();
    const { items, sale_items } = deliveryData ? deliveryData : sale;
    const {checkOrganizationPermission} = useJumboAuth();

    // Mutation method
    const newDispatchSale = useMutation(posServices.dispatchSale, {
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['counterSales']);
            queryClient.invalidateQueries(['saleDeliveryNotes']);
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const updateDeliveryNote = useMutation(posServices.updateDeliveryNote, {
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['counterSales']);
            queryClient.invalidateQueries(['saleDeliveryNotes']);
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const saveMutation = React.useMemo(() => {
        return deliveryData?.id ? updateDeliveryNote.mutate : newDispatchSale.mutate
    },[updateDeliveryNote, newDispatchSale]);

    const validationSchema = yup.object({
        dispatch_date: yup.string().required('Dispatch Date is required').typeError('Delivery Date is required'),
        dispatch_from: yup.string().required('Dispatch From is required').typeError('Dispatch From is required'),
        destination: yup.string().required('Dispatch Destination is required').typeError('Destination is required'),
        items: yup.array().of(
            yup.object().shape({
              quantity: yup
                .number()
                .required('Quantity is Required').typeError('Quantity is required')
                .test('maxQuantity', 'Quantity cannot exceed Available Balance', function (value) {
                  const availableBalance = this.parent.available_balance;
                  const currentBalance = this.parent.current_balance;
                  // 'this' refers to the current item object being validated
                  if (availableBalance <= currentBalance && value > availableBalance) {
                    return false; // Validation will be performed only if both conditions are met
                  }
                  return true; // Validation will be skipped if the conditions are not met         
                })
                .test('maxQuantityyy', 'This quantity will lead to negative balance', function (value) {
                    const availableBalance = this.parent.available_balance;
                    const currentBalance = this.parent.current_balance;
                    // 'this' refers to the current item object being validated
                    if (availableBalance > currentBalance && value > currentBalance) {
                       return false; // Validation will be performed only if both conditions are met
                    }
                    return true; // Validation will be skipped if the conditions are not met
                })
                .test('OverQuantityRequired', 'Quantity cannot exceed Quantity Required to Dispatch', function (value) {
                    const requiredDispatchQuantity = this.parent.undispatched_quantity;
                    // 'this' refers to the current item object being validated
                    if (value > requiredDispatchQuantity) {
                      return false; // Validation will be performed only if both conditions are met
                    }
                    return true; // Validation will be skipped if the conditions are not met                  
                }),
                store_id: yup.number().when('quantity', {
                    is: quantity => quantity > 0,
                    then: yup.number().required('Store is Required').typeError('Store is Required'),
                    otherwise: yup.number().nullable() // No validation if quantity is 0
                })
            })
        ),
      }
    );

    const { setValue, register, getValues, setError, clearErrors, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            sale_id: deliveryData ? deliveryData.sale_id : sale?.id,
            id: deliveryData && deliveryData.id ,
            dispatch_from: deliveryData && deliveryData.dispatch_from,
            destination: sale ? sale.stakeholder.address : deliveryData?.destination,
            vehicle_information: deliveryData && deliveryData.vehicle_information,
            driver_information: deliveryData && deliveryData.driver_information,
            remarks: deliveryData && deliveryData.remarks,
            dispatch_date: dispatch_date.toISOString(),
            items: deliveryData ?
            items.map(item => ({
                undispatched_quantity: item.quantity,
                quantity : item.quantity,
                sale_item_id: item.sale_item.id,
                available_balance: 0,
                store_id: item.store.id, 
                store: item.store
            })) 
            : 
            sale_items?.filter(item => item.undispatched_quantity > 0).map(item => ({
                undispatched_quantity : item.undispatched_quantity,
                quantity : item.undispatched_quantity,
                sale_item_id: item.id,
                product_id: item.product_id,
                available_balance: 0,
                store_id: null
            })),
        }
    });

    // Removing items which quantity <=0
    const validateItems = (data) => {
        return data.items.filter((item) => item.quantity > 0);
    };

    const handleSubmitForm = async (data) => {
        const validItems = validateItems(data);
        const updatedData = { ...data, items: validItems}
        // Continue with the form submission using newData
        await saveMutation(updatedData);
    }; 

  const { data: suggestions, isLoading: isFetchingAddresses } = useQuery('address', posServices.getAddresses);
  
  if (isFetchingAddresses) {
    return <LinearProgress />;
  }

  return (
    <FormProvider {...{errors, setError, clearErrors, setValue, sale_items, watch, items}}>
        <DialogTitle>
            <form autoComplete='off'>
                <Grid container spacing={1}>
                    <Grid item xs={12} textAlign={"center"} mb={2}> 
                        {items ? `Edit Dispatch for ${deliveryData.deliveryNo}` : `Dispatch for ${sale.saleNo}`}
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <DateTimePicker
                                label='Dispatch Date'
                                fullWidth
                                minDate={checkOrganizationPermission(PERMISSIONS.SALES_DISPATCH_BACKDATE) ? dayjs(organization.recording_start_date) : dayjs().startOf('day')}
                                maxDate={checkOrganizationPermission(PERMISSIONS.SALES_DISPATCH_POSTDATE) ? dayjs().add(10,'year').endOf('year') : dayjs().endOf('day')}
                                defaultValue={dispatch_date}
                                readOnly={!!deliveryData}
                                slotProps={{
                                    textField : {
                                        size: 'small',
                                        fullWidth: true,
                                        readOnly: true,
                                        error: !!errors?.dispatch_date,
                                        helperText: errors?.dispatch_date?.message
                                    }
                                }}
                                onChange={(newValue) => {
                                    setValue('dispatch_date', newValue ? newValue.toISOString() : null,{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <Autocomplete
                                id="checkboxes-dispatchFrom"
                                freeSolo
                                options={suggestions.sources}
                                isOptionEqualToValue={(option,value) => option === value}
                                getOptionLabel={(option) => option}
                                defaultValue={deliveryData?.dispatch_from}
                                renderInput={
                                    (params) => 
                                    <TextField 
                                        {...params} 
                                        label="Dispatch From" 
                                        size="small" 
                                        fullWidth 
                                        error={!!errors.dispatch_from}
                                        helperText={errors.dispatch_from?.message}
                                    />
                                }
                                onChange={(e, newValue) => {
                                    setValue('dispatch_from', newValue && newValue , {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                onInputChange={(event, newValue) => {
                                    setValue('dispatch_from',newValue ? newValue : '',{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <Autocomplete
                                id="checkboxes-destination"
                                freeSolo
                                options={suggestions.destinations}
                                isOptionEqualToValue={(option,value) => option === value}
                                getOptionLabel={(option) => option}
                                defaultValue={sale ? sale.stakeholder.address : deliveryData?.destination}
                                renderInput={
                                    (params) => 
                                    <TextField 
                                        {...params} 
                                        label="Destination" 
                                        size="small" 
                                        fullWidth 
                                        error={!!errors.destination}
                                        helperText={errors.destination?.message}
                                    />
                                }
                                onChange={(e, newValue) => {
                                    setValue('destination', newValue && newValue , {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                onInputChange={(event, newValue) => {
                                    setValue('destination',newValue ? newValue : '',{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <Autocomplete
                                id="checkboxes-vehicles"
                                freeSolo
                                options={suggestions.vehicles}
                                isOptionEqualToValue={(option,value) => option === value}
                                getOptionLabel={(option) => option}
                                defaultValue={deliveryData?.vehicle_information}
                                renderInput={
                                    (params) => 
                                    <TextField 
                                        {...params} 
                                        label="Vehicle Information" 
                                        size="small" 
                                        fullWidth 
                                    />
                                }
                                onChange={(e, newValue) => {
                                    setValue('vehicle_information', newValue && newValue , {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                onInputChange={(event, newValue) => {
                                    setValue('vehicle_information',newValue ? newValue : '',{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Div sx={{ mt: 1, mb: 1 }}>
                            <Autocomplete
                                id="checkboxes-drivers"
                                freeSolo
                                options={suggestions.drivers}
                                isOptionEqualToValue={(option,value) => option === value}
                                getOptionLabel={(option) => option}
                                defaultValue={deliveryData?.driver_information}
                                renderInput={
                                    (params) => 
                                    <TextField 
                                        {...params} 
                                        label="Driver Information" 
                                        size="small" 
                                        fullWidth
                                    />
                                }
                                onChange={(e, newValue) => {
                                    setValue('driver_information', newValue && newValue , {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                onInputChange={(event, newValue) => {
                                    setValue('driver_information',newValue ? newValue : '',{
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            size='small'
                            multiline={true}
                            rows={2}
                            defaultValue={deliveryData?.remarks}
                            fullWidth
                            label={'Remarks'}
                            {...register('remarks')}
                        />
                  </Grid>
                </Grid>
            </form>
        </DialogTitle>
        <DialogContent>
            {deliveryData ? <SalesEditDispatchItemForm/> : <SalesDispatchItemForm/>}
        </DialogContent>
        <DialogActions>
            <Button size='small' onClick={() => toggleOpen(false)}>
                Cancel
            </Button>
            <LoadingButton
                loading={newDispatchSale.isLoading || updateDeliveryNote.isLoading}
                disabled={getValues().items.every(item => item.quantity <= 0)} 
                size='small'
                type='submit'
                variant='contained' 
                onClick={handleSubmit(() => handleSubmitForm(getValues()))} //calling lastest values
            >
                Dispatch
            </LoadingButton>
        </DialogActions>
    </FormProvider>
  )
}

export default SalesDispatchForm