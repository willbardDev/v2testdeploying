import React, { useEffect, useState } from 'react';
import { Box, Button, DialogActions, DialogContent, DialogTitle,Divider,Grid, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import inventoryTransferServices from '../inventoryTransfer-services';
import Div from '@jumbo/shared/Div';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import StoreSelector from '../../../StoreSelector';
import { useStoreProfile } from '../../StoreProfileProvider';

function InventoryTransferReceiveForm({ toggleOpen, transfer }) {
  const { mainStore } = useStoreProfile();
  const { items } = transfer;
  const [date_received] = useState(dayjs());

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const validationSchema = yup.object({
    date_received: yup.string().required('Receive Date is required'),
    store_id: yup.number().required('Destination Store is Required').typeError('Destination Store is required'),
    remarks: yup.string().required('Remark is required'),
    items: yup.array().of(
      yup.object().shape({
        quantity: yup
          .number()
          .required('Quantity is Required')
          .typeError('Quantity is required')
          .test('maxQuantity', 'Quantity cannot exceed unreceived quantity', function (
            value
          ) {
            const unreceivedQuantity = this.parent.unreceived_quantity;
            return value <= unreceivedQuantity;
          }),
      })
    ),
  });
  
  const { register, getValues, setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: transfer?.id,
      date_received: date_received.toISOString(),
      items: items
        .filter(item => item.unreceived_quantity !== 0)
        .map(item => ({
          unreceived_quantity: item.unreceived_quantity,
          quantity: item.unreceived_quantity,
          inventory_transfer_item_id: item.id,
        })),
    },
  });

  useEffect(() => {
    // Update the quantity field whenever unreceived_quantity changes
    items
      .filter(item => item.unreceived_quantity !== 0)
      .forEach((item, index) => {
        setValue(`items.${index}.quantity`, item.unreceived_quantity);
      });
  }, [items]);

  const validateItems = (data) => {
    return data.items.filter((item) => item.quantity > 0);
  };

  const handleSubmitForm = async (data) => {
    const validItems = validateItems(data);
    await saveMutation({ ...data, items: validItems });
  };  
  
  const receiveInventoryTransfer = useMutation(inventoryTransferServices.receive, {
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['inventoryTransfers']);
      queryClient.invalidateQueries(['inventoryTrns']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const saveMutation = React.useMemo(() => {
    return receiveInventoryTransfer.mutate
  }, [receiveInventoryTransfer]);

  return (
    <React.Fragment>
      <DialogTitle>
        <form autoComplete='off'>
          <Grid container spacing={1}>
            <Grid item xs={12} textAlign={"center"} mb={1}> 
            {`Receive ${transfer.transferNo}`}
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Div sx={{ mt: 1 }}>
                <DateTimePicker
                  fullWidth
                  label="Receive Date"
                  defaultValue={date_received}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      readOnly: true,
                    }
                  }}
                  onChange={(newValue) => {
                    setValue(`date_received`, newValue ? newValue.toISOString() : null, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Div sx={{ mt: 1 }}>
                <StoreSelector
                  allowSubStores={true}
                  proposedOptions={[mainStore]}
                  label="Destination Store"
                  frontError={errors.store_id}
                  onChange={(newValue) => {
                    setValue(`store_id`, newValue ? newValue.id : '', {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </Div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight:'bold' }}>Cost Center:</Typography>
                <Typography>{transfer.destination_cost_center?.name}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogTitle>  
      <DialogContent>
        <Tabs value={0}>
          <Tab label="ITEMS" />
        </Tabs>

        {items.filter(item => item.unreceived_quantity !== 0).map((item, index) => (
          <React.Fragment key={item.id}>
            <Grid container
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Grid item xs={0.5}>
                <Box sx={{ mt: 1.7, mb: 1.7 }}>
                  {index + 1}.
                </Box>
              </Grid>
              <Grid item xs={10} md={5} lg={5}>
                <Box sx={{ mt: 1.7, mb: 1.7 }}>
                  <Tooltip title="Product">
                    <Typography>
                      {item.product.name}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid textAlign={'center'} item xs={1.5} md={3}>
                <Box sx={{ mt: 1.7, mb: 1.7 }}>
                  <Tooltip title="Quantity">
                    <Typography textAlign="center">
                      {item.unreceived_quantity} {item.measurement_unit?.symbol}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12} md={3.5} lg={3.5}>
                <Box sx={{ mt: 0.7, mb: 0.5 }}>
                  <TextField
                    label="Receive"
                    fullWidth
                    size="small"
                    error={!!errors?.items && !!errors.items[index] && !!errors.items[index].quantity}
                    helperText={errors?.items && errors.items[index] && errors.items[index].quantity?.message}
                    defaultValue={item.unreceived_quantity}
                    {...register(`items.${index}.quantity`, {
                      validate: (value) => value <= item.unreceived_quantity,
                    })}
                  />
                </Box>
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Div sx={{ mt: 1, mb: 1 }}>
            <TextField
              label='Remarks'
              fullWidth
              multiline={true}
              minRows={2}
              error={!!errors?.remarks}
              helperText={errors?.remarks?.message}
              {...register('remarks')}
            />
          </Div>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={receiveInventoryTransfer.isLoading}
          variant='contained'
          size='small'
          onClick={handleSubmit(() => handleSubmitForm(getValues()))} //calling lastest values
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </React.Fragment>
  )
}

export default InventoryTransferReceiveForm;