import React, { useEffect, useState } from 'react';
import { Grid, IconButton, LinearProgress, TextField, Tooltip, Autocomplete } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import Div from '@jumbo/shared/Div';
import { useLedgerSelect } from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelectProvider';

function JournalItemForm({ setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, index = -1, setShowForm = null, item, items=[], setItems }) {
  const [isAdding, setIsAdding] = useState(false);
  const { ungroupedLedgerOptions } = useLedgerSelect();
  const dob = { id: 1, name: 'Diff. in Opening Balances' };

  // Combine dob with ungroupedLedgerOptions
  const options = [dob, ...ungroupedLedgerOptions];

  // Define validation schema
  const validationSchema = yup.object().shape({
    debit_ledger_id: yup
    .number()
    .required("Debit account is required")
    .positive("Debit account must be a positive number")
    .typeError("Debit account is required")
    .test('unique-ledgers', 'Debit and credit accounts cannot be the same', function (value) {
        return value !== this.parent.credit_ledger_id;
    }),
    credit_ledger_id: yup
    .number()
    .required("Credit account is required")
    .positive("Credit account must be a positive number")
    .typeError("Credit account is required")
    .test('unique-ledgers', 'Debit and credit accounts cannot be the same', function (value) {
      return value !== this.parent.debit_ledger_id;
    }),
    description: yup.string().required('Description is required').typeError('Description is required'),
    amount: yup.number().required("Amount is required").positive("Amount must be greater than 0").typeError('Amount must be a number'),
  });

  const { setValue, handleSubmit, watch, reset, formState: { errors, dirtyFields } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      credit_ledger: item && options.find(option => option.id === item.credit_ledger_id),
      credit_ledger_id: item && item.credit_ledger_id,
      debit_ledger: item && options.find(option => option.id === item.debit_ledger_id),
      debit_ledger_id: item && item.debit_ledger_id,
      amount: item && item.amount,
      description: item && item.description,
    }
  });

  useEffect(() => {
    setIsDirty(Object.keys(dirtyFields).length > 0); // Update dirty state
  }, [dirtyFields, setIsDirty, watch]);

    const updateItems = async (item) => {
      setIsAdding(true);
      if (index > -1) {
          // Replace the existing item with the edited item
          let updatedItems = [...items];
          updatedItems[index] = item;
          await setItems(updatedItems);
          setClearFormKey(prevKey => prevKey + 1);
      } else {
          // Add the new item to the items array
          await setItems((items) => [...items, item]);
          if (!!submitItemForm) {
            submitMainForm()
          }
          setSubmitItemForm(false)
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

  if (isAdding) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={1} marginTop={0.5}>
      <Grid item md={3} lg={3} xs={12}>
        <Div sx={{ mt: 1 }}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={options.find(option => option.id === watch(`debit_ledger_id`)) || null}
            onChange={(event, newValue) => {
              setValue('debit_ledger', newValue);
              setValue('debit_ledger_id', newValue ? newValue.id : null, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label="Debit"
                error={!!errors.debit_ledger_id}
                helperText={errors.debit_ledger_id?.message}
              />
            )}
          />
        </Div>
      </Grid>

      <Grid item md={3} lg={3} xs={12}>
        <Div sx={{ mt: 1 }}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={options.find(option => option.id === watch(`credit_ledger_id`)) || null}
            onChange={(event, newValue) => {
              setValue('credit_ledger', newValue);
              setValue('credit_ledger_id', newValue ? newValue.id : null, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label="Credit"
                error={!!errors.credit_ledger_id}
                helperText={errors.credit_ledger_id?.message}
              />
            )}
          />
        </Div>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
        <Div sx={{ mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            defaultValue={watch(`description`)}
            label="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            onChange={(e) => {
              setValue(`description`, e.target.value ? e.target.value : '', {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
          />
        </Div>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
        <Div sx={{ mt: 1 }}>
          <TextField
            label="Amount"
            fullWidth
            size='small'
            value={watch(`amount`)}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            InputProps={{
              inputComponent: CommaSeparatedField,
            }}
            onChange={(e) => {
              const value = sanitizedNumber(e.target.value);
              setValue('amount', value, { shouldValidate: true, shouldDirty: true });
            }}
          />
        </Div>
      </Grid>

      <Grid item xs={12} md={12} lg={12} textAlign={'end'}>
        <LoadingButton
          loading={false}
          variant='contained'
          size='small'
          onClick={handleSubmit(updateItems)}
          sx={{ marginBottom: 0.5 }}
        >
          {item ? (
            <><CheckOutlined fontSize='small' /> Done</>
          ) : (
            <><AddOutlined fontSize='small' /> Add</>
          )}
        </LoadingButton>
        {item &&
          <Tooltip title='Close Edit'>
            <IconButton size='small' onClick={() => setShowForm(false)}>
              <DisabledByDefault fontSize='small' color='success' />
            </IconButton>
          </Tooltip>
        }
      </Grid>
    </Grid>
  );
}

export default JournalItemForm;
