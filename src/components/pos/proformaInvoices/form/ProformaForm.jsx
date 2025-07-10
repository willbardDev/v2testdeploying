import { Alert, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, LinearProgress, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'; 
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div/Div';
import { DatePicker } from '@mui/x-date-pickers';
import CurrencySelector from '../../../masters/Currencies/CurrencySelector';
import StakeholderSelector from '../../../masters/stakeholders/StakeholderSelector';
import ProformaItemForm from './ProformaItemForm';
import ProformaItemRow from './ProformaItemRow';
import { LoadingButton } from '@mui/lab';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useSalesOutlet } from '../../outlets/OutletProvider';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import proformaServices from '../proforma-services';
import { useSnackbar } from 'notistack';
import { AddOutlined, HighlightOff } from '@mui/icons-material';
import StakeholderQuickAdd from 'app/prosServices/prosERP/masters/stakeholders/StakeholderQuickAdd';
import { MODULE_SETTINGS } from 'app/utils/constants/moduleSettings';

function ProformaForm({toggleOpen,proforma=null}) {
  const {authOrganization : {organization},moduleSetting} = useJumboAuth();
  const [proforma_date] = useState(proforma ? dayjs(proforma.proforma_date) : dayjs());
  const [expiry_date] = useState(proforma && proforma?.expiry_date && dayjs(proforma.expiry_date));
  const {activeOutlet} = useSalesOutlet();
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatableAmount, setVatableAmount] = useState(0);
  const [items, setItems] = useState(proforma ? proforma.items : []);
  const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
  const [addedStakeholder, setAddedStakeholder] = useState(null);
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [submitItemForm, setSubmitItemForm] = useState(false);

  const validationSchema = yup.object({
    proforma_date: yup.string().required('Proforma date is required').typeError('Sales date is required'),
    stakeholder_id: yup.number().required("Client is required").typeError('Client is required'),
    currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
    exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
    items: yup.array().min(1, "You must add at least one item").typeError('You must add at least one item').of(
      yup.object().shape({
        product_id: yup.number().required("Product is required").positive('Product is required').typeError('Product is required'),
        quantity: yup.number().required("Quantity is required").positive("Quantity is required").typeError('Quantity is required'),
        rate: yup.number().required("Price is required").positive("Price is required").typeError('Price is required'),
      })
    ),
  });

  const {setValue, setError, handleSubmit, watch, clearErrors, formState : {errors}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      proforma_date : proforma_date.toISOString(),
      expiry_date : expiry_date && expiry_date.toISOString(),
      currency_id: proforma?.currency_id ? proforma.currency_id : 1,
      exchange_rate: proforma?.exchange_rate ? proforma.exchange_rate : 1,
      vat_registered: !!organization.settings?.vat_registered,
      vat_percentage: !!proforma?.vat_percentage ? proforma.vat_percentage : !!moduleSetting(MODULE_SETTINGS.POS_DEFAULT_VAT_INCLUSIVE) ? (!!organization.settings?.vat_registered && organization.settings.vat_percentage) : 0,
      reference: proforma && proforma.reference,
      id: proforma && proforma.id,
      stakeholder_id: proforma && proforma.stakeholder.id,
      sales_outlet_id: activeOutlet?.id,
      items: proforma && proforma.items,
      remarks: proforma && proforma.remarks
    }
  });

  //Forms on Fly Calculations
  const rowAmount = (index) => {
    const quantity = parseFloat(watch(`items.${index}.quantity`)) || 0;
    const rate = parseFloat(watch(`items.${index}.rate`)) || 0;
    return quantity * rate;
  }

  //Set Item values and calculate total amount
  const orderTotalAmount = () => {
    let total = 0;
    let vatableTotal = 0;

      //Total For all Items
      async function loopItems(){
        await setValue(`items`,null);
        await items.forEach((item,index) => {
          total += item.rate*item.quantity
          setValue(`items.${index}.product_id`, item?.product?.id ? item.product.id : item.product_id);
          setValue(`items.${index}.product_type`, item?.product?.type && item.product.type);
          setValue(`items.${index}.quantity`, item.quantity);
          setValue(`items.${index}.measurement_unit_id`, item.measurement_unit_id ? item.measurement_unit_id : item.measurement_unit.id);
          setValue(`items.${index}.rate`, item.rate);
          setValue(`items.${index}.store_id`, item.store_id);
        });
        setTotalAmount(total);
      }

      //Total For only Items require VAT Inclusive
      async function loopItemsForVAT(){
        await setValue(`items`,null);
        await items.filter(item => item.product.vat_exempted !== 1).forEach((item) => {
          vatableTotal += item.rate*item.quantity
        });
        setVatableAmount(vatableTotal);
      }
    loopItems();
    loopItemsForVAT();
  }

  const vat_percentage = parseFloat(watch('vat_percentage'));
  const vatAmount = vatableAmount*vat_percentage/100;

  React.useEffect(() => {
    orderTotalAmount();
  },[rowAmount]);

  // setvalues from coming addedStakeholder
  useEffect(() => {
    if(addedStakeholder?.id){
      setValue('stakeholder_id', addedStakeholder.id);
      setStakeholderQuickAddDisplay(false)
    }
  }, [addedStakeholder])

  //Mutation methods
  const addProformaInvoice = useMutation(proformaServices.add,{
    onSuccess: (data) => {
        toggleOpen(false);
        enqueueSnackbar(data.message,{variant : 'success'});
        queryClient.invalidateQueries(['proformaInvoices']);
    },
    onError: (error) => {
        error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })
  
  const updateProformaInvoice = useMutation(proformaServices.update,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['proformaInvoices']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  });

  const saveMutation = React.useMemo(() => {
    return proforma ? updateProformaInvoice : addProformaInvoice
  },[updateProformaInvoice,addProformaInvoice]);

  const { data:proformaRemarks, isLoading:isFetchingProformaRemarks } = useQuery('proformaRemarks', proformaServices.getProformaRemarks);

  if (isFetchingProformaRemarks) {
    return <LinearProgress/>;
  }

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

  return (
    <React.Fragment>
    <DialogTitle>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} textAlign={"center"} mb={2}>
          {!proforma ? 'New Proforma' : `Edit ${proforma.proformaNo}`}
        </Grid>
        <Grid item xs={12} md={9} mb={2}>
          <form autoComplete='off'>
            <Grid container columnSpacing={1} rowSpacing={2}>
              <Grid item xs={12} md={4} lg={4}>
                <Div sx={{ mt: 0.3}}>
                  <DatePicker
                    fullWidth
                    label="Proforma Date" 
                    defaultValue={proforma_date}              
                    slotProps={{
                      textField:{
                        size: 'small',
                        fullWidth: true,
                        readOnly: true,
                      }
                    }}
                    onChange={(newValue) => {
                      setValue('proforma_date', newValue ? newValue.toISOString() : null,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Div sx={{ mt: 0.3}}>
                    <DatePicker
                      fullWidth
                      label="Expiry Date" 
                      minDate={dayjs(watch('proforma_date'))} 
                      defaultValue={expiry_date}              
                      slotProps={{
                        textField:{
                          size: 'small',
                          fullWidth: true,
                          readOnly: true,
                        }
                      }}

                      onChange={(newValue) => {
                        setValue('expiry_date', newValue ? newValue.toISOString() : null,{
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                    />
                  </Div>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Div sx={{ mt: 0.3}}>
                  <CurrencySelector
                    frontError={errors?.currency_id}
                    defaultValue={proforma ? proforma.currency_id : 1}
                    onChange={(newValue) => {
                      setValue('currency_id', newValue ? newValue.id : null,{
                        shouldDirty: true,
                        shouldValidate: true
                      });

                      clearErrors('exchange_rate');

                      setValue('exchange_rate', newValue?.exchangeRate ? newValue.exchangeRate : 1);

                    }}
                  />
                </Div>
              </Grid>
              { watch(`currency_id`) > 1 &&
              <Grid item xs={12} md={4} lg={4}>
                <Div sx={{ mt: 0.3}}>
                  <TextField
                    label="Exchange Rate"
                    fullWidth
                    size='small'
                    error={!!errors?.exchange_rate}
                    helperText={errors?.exchange_rate?.message}
                    disabled={watch('currency_id') === 1}
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                    }}
                    value={watch('exchange_rate')}
                    onChange={(e) => {
                      setValue(`exchange_rate`,e.target.value ? sanitizedNumber(e.target.value ): null,{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>}
              { !stakeholderQuickAddDisplay && 
                <Grid item xs={12} md={watch(`currency_id`) > 1 ? 4 : 6} lg={watch(`currency_id`) > 1 ? 8 : 4}>
                  <Div sx={{ mt: 0.3}}>
                    <StakeholderSelector
                      label='Client'
                      frontError={errors?.stakeholder_id}
                      defaultValue={proforma && proforma.stakeholder.id}
                      addedStakeholder={addedStakeholder}
                      onChange={(newValue) => {
                        setValue('stakeholder_id', newValue ? newValue.id: null,{
                          shouldDirty: true,
                          shouldValidate: true
                        });
                      }}
                      startAdornment= {
                        <Tooltip title={'Add Client'}>
                          <AddOutlined
                            onClick={() => setStakeholderQuickAddDisplay(true)}
                            sx={{
                              cursor: 'pointer',
                            }}
                          />
                        </Tooltip>
                      }
                    />
                  </Div>
                </Grid>
              }

              {stakeholderQuickAddDisplay && <StakeholderQuickAdd setStakeholderQuickAddDisplay={setStakeholderQuickAddDisplay} create_receivable={true} setAddedStakeholder={setAddedStakeholder}/>} 

              <Grid item xs={12} md={watch(`currency_id`) > 1 ? 4 : stakeholderQuickAddDisplay ? 12 : 6} lg={watch(`currency_id`) > 1 ? 12 : stakeholderQuickAddDisplay ? 12 : 8}>
                <Div sx={{ mt: 0.3 }}>
                  <Autocomplete
                    id="checkboxes-remarks"
                    freeSolo
                    options={proformaRemarks}
                    isOptionEqualToValue={(option,value) => option === value}
                    getOptionLabel={(option) => option}
                    defaultValue={proforma?.remarks}
                    renderInput={
                      (params) => 
                      <TextField 
                        {...params} 
                        label="Remarks" 
                        size="small" 
                        fullWidth 
                        multiline={true}
                        rows={2}
                        error={!!errors.remarks}
                        helperText={errors.remarks?.message}
                      />
                    }
                    onChange={(e, newValue) => {
                      setValue('remarks', newValue && newValue , {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    onInputChange={(event, newValue) => {
                      setValue('remarks',newValue ? newValue : '',{
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Grid container columnSpacing={1}>
            {/* Summary Starts here */}
              <Grid item xs={12}>
                <Typography align='center' variant='h3'>Summary</Typography>
                <Divider/>
              </Grid>
              <Grid item xs={5}>
                <Typography align='left' variant='body2'>Total:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography align='right' variant='h5'>{totalAmount.toLocaleString()}</Typography>
              </Grid>

              {
                watch('vat_registered') &&
                <React.Fragment>
                  <Grid item xs={5}>
                      <Typography align='left' variant='body2'>
                        VAT:
                        <Checkbox 
                          size='small'
                          checked={!!vat_percentage}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setValue('vat_percentage',checked ? organization.settings.vat_percentage : 0,{
                              shouldDirty: true,
                              shouldValidate: true
                            });
                        }} 
                        />
                      </Typography>
                  </Grid>
                  <Grid item xs={7} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                    <Typography align='right' variant='h5'>{vatAmount.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={5} >
                    <Typography align='left' variant='body2' noWrap>Grand Total:</Typography>
                  </Grid>
                  <Grid item xs={7} display={'flex'} alignItems={'end'} justifyContent={'end'}>
                    <Typography align='right' variant='h5'>{(totalAmount + vatAmount).toLocaleString()}</Typography>
                  </Grid>
                </React.Fragment>
              }
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
          <ProformaItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} setItems={setItems} vat_percentage={vat_percentage}/>
        </Grid>
        </Grid>
    </DialogTitle>
    <DialogContent>
       {
          errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
        }
        {
          items.map((item,index) => (
            <ProformaItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} vat_percentage={vat_percentage} key={index} index={index} setItems={setItems} items={items} item={item}/>
          ))
        }

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
        loading={addProformaInvoice.isLoading || updateProformaInvoice.isLoading}
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

export default ProformaForm