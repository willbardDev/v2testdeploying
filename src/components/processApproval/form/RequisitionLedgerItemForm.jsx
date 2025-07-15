import { yupResolver } from '@hookform/resolvers/yup';
import Div from '@jumbo/shared/Div';
import { Autocomplete, Button, Divider, Grid, IconButton, LinearProgress, TextField, Tooltip } from '@mui/material';
import { readableDate, sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import LedgerSelect from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelect';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import MeasurementSelector from '../../masters/measurementUnits/MeasurementSelector';
import requisitionsServices from '../requisitionsServices';

function RequisitionLedgerItemForm({setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, requisition_ledger_items, setRequisition_ledger_items, ledger_item = null,index = -1, setShowForm = null}) {
  const [isAdding, setIsAdding] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [relatedTransactions, setRelatedTransactions] = useState([]);
  const [selectedRelated, setSelectedRelated] = useState(null);

  const relatableTypes = [{
    value: 'purchase',
    label: 'Purchase',
  }]

  const validationSchema = yup.object({
    ledger_id: yup.number().required("Expense name is required").typeError('Expense name is required'),
    quantity: yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive")
      .typeError('Quantity is required'),
    rate: yup.number()
      .required("Rate is required")
      .positive("Rate must be positive")
      .typeError('Rate is required'),
    amount: yup
      .number()
      .nullable()
      .when('relatable', (relatable, schema) => 
        relatable?.id
          ? schema
              .required("Amount is required")
              .test('max-amount', `Amount should not exceed unapproved amount (${relatable?.unapproved_amount?.toLocaleString()}) of selected relatable`, function (value) {
                return value <= (relatable?.unapproved_amount);
              })
          : schema.nullable()
      ),
    measurement_unit_id: yup.number().required("Measurement Unit is required").typeError('Measurement Unit is required'),
  });

  const {setValue, handleSubmit, watch, register, reset, formState: {errors, dirtyFields}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ledger_id: ledger_item && ledger_item.ledger_id,
      ledger: ledger_item && ledger_item.ledger,
      quantity: ledger_item && ledger_item.quantity,
      rate: ledger_item && ledger_item.rate,
      relatable_type: ledger_item && ledger_item.relatable_type,
      relatable: ledger_item && ledger_item.relatable,
      relatable_id: ledger_item && ledger_item.relatable_id,
      measurement_unit_id: ledger_item && (ledger_item.measurement_unit_id ? ledger_item.measurement_unit_id : ledger_item.measurement_unit.id),
      unit_symbol: ledger_item && (ledger_item.measurement_unit?.symbol ? ledger_item.measurement_unit?.symbol : ledger_item.unit_symbol),
      remarks: ledger_item && ledger_item.remarks
    }
  });

  useEffect(() => {
    setIsDirty(Object.keys(dirtyFields).length > 0); // Update dirty state
  }, [dirtyFields, setIsDirty, watch]);

  const calculateAmount = () => {
    const quantity = parseFloat(watch(`quantity`)) || ledger_item?.quantity || 0;
    const rate = parseFloat(watch(`rate`)) || (ledger_item?.rate || 0);

    if (quantity && rate) {
      setValue(`amount`, quantity*rate,{
        shouldValidate: true,
        shouldDirty: true,
      })
      return quantity * rate;
    }
  };

  useEffect(() => {
    const amount = calculateAmount();
    setCalculatedAmount(amount);
  }, [watch('quantity'), watch('rate')]);

  const updateItems = async (ledger_item) => {
    setIsAdding(true);
    if (index > -1) {
      // Replace the existing item with the edited item
      let updatedItems = [...requisition_ledger_items];
      updatedItems[index] = ledger_item;
      await setRequisition_ledger_items(updatedItems);
      setClearFormKey(prevKey => prevKey + 1);
    } else {
      // Add the new item to the items array
      await setRequisition_ledger_items((requisition_ledger_items) => [...requisition_ledger_items, ledger_item]);
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

  const getRelatedTransactions= async () => {
    const ledgerId = watch(`ledger_id`);
    const relatable_type = watch(`relatable_type`);
    setIsRetrieving(true);

    if (ledgerId && relatable_type) {
      const fetchedRelatedTransactions =  await requisitionsServices.getRelatedTransactions({
        ledger_id: ledgerId,
        type: relatable_type,
        payment_status: 'partially_and_not_approved'
      })
      await setRelatedTransactions(fetchedRelatedTransactions)

      if (ledger_item){
        setSelectedRelated(fetchedRelatedTransactions?.find(link => link.id ===  watch(`relatable_id`)))
      }
    }
    
    setIsRetrieving(false);
  }

  useEffect(() => {
    getRelatedTransactions()
  },[ledger_item]);

  if(isAdding){
    return <LinearProgress/>
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit(updateItems)}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Div sx={{ mt: 0.3 }}>
            <LedgerSelect
              multiple={false}
              label="Ledger Name"
              allowedGroups={['Accounts Receivable','Accounts Payable','Expenses', 'Liabilities']}
              defaultValue={ledger_item && ledger_item.ledger}
              frontError={errors?.ledger_id}
              onChange={(newValue) => {
                setValue(`ledger`, newValue);
                setValue(`ledger_id`, newValue ? newValue.id : null,{
                  shouldValidate: true,
                  shouldDirty: true
                })
                setValue(`relatable_id`, null);
                setValue(`relatable`, null);
                setSelectedRelated(null)
                setRelatedTransactions([])
                getRelatedTransactions()
              }} 
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={2}>
          <Div sx={{ mt: 0.3}}>
            <MeasurementSelector
              label='Unit'
              frontError={errors && errors?.measurement_unit_id}
              defaultValue={ledger_item?.measurement_unit_id}
              onChange={(newValue) => {
                setValue(`unit_symbol`, newValue?.symbol);
                setValue(`measurement_unit_id`, newValue ? newValue.id : null,{
                  shouldDirty: true,
                  shouldValidate: true
                })
              }}      
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Div sx={{mt: 0.3}}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              defaultValue={ledger_item && ledger_item.quantity}
              InputProps={{
                inputComponent: CommaSeparatedField,
              }}
              error={errors && !!errors?.quantity}
              helperText={errors && errors?.quantity?.message}
              onChange={(e) => {
                setValue(`quantity`,e.target.value ? sanitizedNumber(e.target.value) : 0,{
                  shouldValidate: true,
                  shouldDirty: true
                });
              }}
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Div sx={{mt: 0.3}}>
            <TextField
              label="Rate"
              fullWidth
              size="small"
              defaultValue={ledger_item && ledger_item.rate}
              error={errors && !!errors?.rate}
              helperText={errors && errors?.rate?.message}
              InputProps={{
                inputComponent: CommaSeparatedField,
              }}
              onChange={(e) => {
                setValue(`rate`,e.target.value ? sanitizedNumber(e.target.value) : 0,{
                  shouldValidate: true,
                  shouldDirty: true
                });
              }}
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Div sx={{mt: 0.3}}>
            <TextField
              label="Amount"
              fullWidth
              size='small'
              value={calculatedAmount}
              error={errors && !!errors?.amount}
              helperText={errors && errors?.amount?.message}
              InputProps={{
                inputComponent: CommaSeparatedField,
                readOnly: true
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={3}>
          <Div sx={{  mt: 0.3  }}>
            <Autocomplete
              id="checkboxes-linked_to_types"
              options={relatableTypes}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              defaultValue={ledger_item && relatableTypes.find(link => link.value ===  watch(`relatable_type`))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Linked To"
                  size="small"
                  fullWidth
                />
              )}
              onChange={(e, newValue) => {
                if (newValue) {
                  setSelectedRelated(null)
                  setValue(`relatable_type`, newValue.value);
                  setValue(`relatable_id`, null);
                  getRelatedTransactions()
                } else {
                  setValue(`relatable_type`, null);
                  setValue(`relatable`, null);
                  setSelectedRelated(null)
                  setRelatedTransactions([])
                }
              }}
            />
          </Div>
        </Grid>
        { 
          isRetrieving && relatedTransactions ?
            <Grid item xs={12} md={2}>
              <LinearProgress /> 
            </Grid>
          :
            <Grid item xs={12} md={2}>
              <Div sx={{  mt: 0.3  }}>
                <Autocomplete
                  id="checkboxes-related_transitions"
                  key={watch(`relatable_type`)}
                  options={relatedTransactions}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.relatableNo} (${readableDate(option.order_date, false)} - ${option.total_amount?.toLocaleString('en-US', 
                    {
                      style: 'currency',
                      currency: option.currency?.code,
                    })})`}
                  value={selectedRelated}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Relatable To"
                      size="small"
                      fullWidth
                    />
                  )}
                  onChange={(e, newValue) => {
                    setSelectedRelated(newValue);
                    setValue(`relatable`, newValue ? newValue : null);
                    setValue(`relatable_id`, newValue ? newValue.id : null);
                    setValue(`amount`, watch(`amount`),{
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
              </Div>
            </Grid>
        }
        <Grid item xs={12} md={7} lg={7}>
          <Div sx={{mt: 0.3}}>
            <TextField
              label="Remarks"
              fullWidth
              size="small"
              {...register('remarks')}
            />
          </Div>
        </Grid>
        <Grid item xs={12} md={12} lg={12} textAlign={'end'} paddingBottom={0.5}>
          <Button
            variant='contained'
            size='small'
            type='submit'
            onClick={()=> setIsDirty(false)}
          >
            {
              ledger_item ? (
                <><CheckOutlined fontSize='small' /> Done</>
              ) : (
                <><AddOutlined fontSize='small' /> Add</>
              )
            }
          </Button>
          {
            ledger_item && 
            <Tooltip title='Close Edit'>
              <IconButton size='small' 
                onClick={() => {
                  setShowForm(false);
                  setIsDirty(false)
                }}
              >
                <DisabledByDefault fontSize='small' color='success'/>
              </IconButton>
            </Tooltip>
          }
        </Grid>
      </Grid>
    </form>
  )
}

export default RequisitionLedgerItemForm