import { yupResolver } from '@hookform/resolvers/yup';
import Div from '@jumbo/shared/Div/Div';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { Button, Grid, IconButton, LinearProgress,TextField, Tooltip} from '@mui/material';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import LedgerSelect from '../../ledgers/forms/LedgerSelect';

function BudgetItemForm({ item = null, index = -1, setItems, items = [], setShowForm = null}) {

  // Define validation Schema
  const validationSchema = yup.object({
    ledger: yup.object().required("Ledger is required").typeError('Ledger is required'),
    amount: yup.number().required("Amount is required").positive("Amount is required").typeError('Amount is required'),
  });

  //Initialize react-hook-form
  const { setValue, handleSubmit,reset,formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ledger: item && item.ledger,
      amount: item && item.amount,
    }
  });

    //handle submission post react-hook-form
    const [isAdding, setIsAdding] = useState(false); 

    const updateItems = async (item) => {
      setIsAdding(true);
      if (index > -1) {
        // Replace the existing item with the edited item
        let updatedItems = [...items];
        updatedItems[index] = item;
        await setItems(updatedItems);
      } else {
        await setItems((items) => [...items, item]);
      }
  
      reset();
      setIsAdding(false);
      setShowForm && setShowForm(false);
    };

    if (isAdding) {
      return <LinearProgress/>
    }

  return (
    <form 
      autoComplete='off' 
      onSubmit={handleSubmit(updateItems)} 
    >
      <Grid container columnSpacing={1} rowSpacing={1} mb={1} mt={1}>
       <Grid item xs={12} lg={8}>
          <Div sx={{ mt: 1, mb: 1 }}>
          <LedgerSelect
            label='Ledger'
            frontError={errors.ledger}
            defaultValue={item && item.ledger.id}
            onChange={(newValue) => {
                setValue(`ledger`, newValue, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }}
          />
          </Div>
        </Grid>
        <Grid item xs={12} md={3}>
         <Div sx={{ mt: 1, mb: 1 }}>
          <TextField
              label="Amount"
              fullWidth
              size='small'
              InputProps={{
                inputComponent: CommaSeparatedField,
              }}
              error={!!errors?.amount}
              helperText={errors?.amount?.message}
              defaultValue={item && item?.amount}
              onChange={(e) => {
                const sanitizedValue = sanitizedNumber(e.target.value);
                setValue(`amount`, sanitizedValue ? sanitizedValue  : 0, {
                  shouldValidate: true,
                  shouldDirty: true
                });
              }}
            />
         </Div>
        </Grid>
        <Grid item xs={12} md={1}  textAlign={'end'}>
          <Div sx={{ mt: 1, mb: 1 }}>
            <Button
                variant='contained'
                size='small'
                type='submit'
              >
                {
                  item ? (
                    <><CheckOutlined fontSize='small' /> Done</>
                  ) : (
                    <><AddOutlined fontSize='small' /> Add</>
                  )
                }
              </Button>
              {
                item &&
                <Tooltip title='Close Edit'>
                  <IconButton size='small'
                    onClick={() => {
                      setShowForm(false);
                    }}
                  >
                    <DisabledByDefault fontSize='small' color='success' />
                  </IconButton>
                </Tooltip>
              }
          </Div>
        </Grid>
      </Grid>
    </form>
  )
}

export default BudgetItemForm;

