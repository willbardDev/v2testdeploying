import { Button,DialogActions, DialogContent, DialogTitle, Grid, TextField,Typography } from '@mui/material'
import React, { useState } from 'react'
import dayjs from 'dayjs'; 
import Div from '@jumbo/shared/Div/Div';
import { DatePicker } from '@mui/x-date-pickers';
import CurrencySelector from '../../../masters/Currencies/CurrencySelector';
import { LoadingButton } from '@mui/lab';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import BudgetTabs from '../BudgetTabs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function BudgetForm({setOpenDialog}) {
  const {authOrganization} = useJumboAuth();
  const [incomeItems, setIncomeItems] = useState([]); // Array for Income items
  const [expenseItems, setExpenseItems] = useState([]); // Array for Expenses items
  const [items, setItems] = useState([]); // Array for items
  


  const validationSchema = yup.object({
    currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
    start_date: yup.string().required('Budget date is required').typeError('Budget date is required'),
    end_date: yup.string().required('Ending date is required').typeError('Budget Ending date is required'),
    cost_centers: yup.string().required('Cost Center is required').typeError('Cost Center is required'),
    exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
    items: yup.array().min(1, "You must add at least one item").typeError('You must add at least one item').of(
        yup.object().shape({
            ledger: yup.object().required("Ledger is required").typeError('Ledger is required'),
            amount: yup.number().required("Amount is required").positive("Amount is required").typeError('Amount is required'),
        })
      ).min(1,'At least one item required'),
  });
  
  const {setValue,handleSubmit,watch, clearErrors, formState : {errors}} = useForm({
      resolver: yupResolver(validationSchema),
  });

  
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <React.Fragment>
    <DialogTitle>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} textAlign={"center"} mb={2}>
          <Typography variant='h4'>New Budget Form</Typography>
        </Grid>
        <Grid item xs={12} md={8} lg={12}>
          <form autoComplete='off'>
            <Grid container columnSpacing={1}>
              <Grid item xs={12} md={6} lg={3}>
                <Div sx={{ mt: 1, mb: 1 }}>
                <DatePicker
                  fullWidth
                  label="Start Date (MM/DD/YYYY)"  
                  minDate={dayjs(authOrganization.organization.recording_start_date)}            
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      readOnly: true,
                    }
                  }}
                  onChange={(newValue) => {
                    setValue('start_date', newValue ? newValue.toISOString() : null,{
                        shouldValidate: true,
                        shouldDirty: true
                    });
                }}
                />
                </Div>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Div sx={{ mt: 1, mb: 1 }}>
                    <DatePicker
                      fullWidth
                      label="End Date (MM/DD/YYYY)" 
                      minDate={dayjs(watch('start_date'))}           
                      slotProps={{
                        textField:{
                          size: 'small',
                          fullWidth: true,
                          readOnly: true,
                        }
                      }}
                      onChange={(newValue) => {
                        setValue('end_date', newValue ? newValue.toISOString() : null,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                    />
                  </Div>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Div sx={{mt: 1, mb: 1}}>
                  <CostCenterSelector
                    label="Cost Centers"
                    onChange={(newValue) => {
                      setValue('cost_centers', newValue);
                  }}
                  />
                </Div>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Div sx={{ mt: 1, mb: 1 }}>
                  <CurrencySelector
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
              {
              watch('currency_id') > 1 &&
              <Grid item xs={12} md={3}>
                  <Div sx={{mt: 1, mb: 1}}>
                      <TextField
                        label="Exchange Rate"
                        fullWidth
                        size='small'
                        error={!!errors?.exchange_rate}
                        helperText={errors?.exchange_rate?.message}
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
              </Grid>
              }
            </Grid>
          </form>
        </Grid>
        </Grid>
    </DialogTitle>
    <DialogContent>
      {/* Pass the arrays to BudgetTabs */}
      <BudgetTabs incomeItems={incomeItems} setIncomeItems={setIncomeItems} expenseItems={expenseItems} setExpenseItems={setExpenseItems} setItems={setItems}/>
    </DialogContent>
    <DialogActions>
        <Button size='small' onClick={() => setOpenDialog(false)}>
            Cancel
        </Button>
        <LoadingButton
            // loading={addBudgetInvoice.is Loading || updateBudgetInvoice.isLoading}
            variant='contained' 
            size='small'
            onClick={handleSubmit(onSubmit)}
        >
            Submit
        </LoadingButton>
    </DialogActions>
    </React.Fragment>
  )
}

export default BudgetForm