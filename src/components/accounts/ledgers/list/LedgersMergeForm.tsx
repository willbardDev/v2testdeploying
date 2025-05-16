'use client'

import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material'
import React, { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { useSnackbar } from 'notistack'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import ledgerServices from '../ledger-services'
import LedgerSelect from '../forms/LedgerSelect'
import { useLedgerSelect } from '../forms/LedgerSelectProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Ledger {
  id: number;
  name: string;
  alias: string | null;
  ledger_group: {
    name: string;
    nature: {
      name: string;
    };
  };
  ledger_group_id?: number;
}

interface FormValues {
  remaining_ledger_id: number | null;
  dissolved_ledgers_ids: number[];
}

interface LedgersMergeFormProps {
  toggleOpen: (open: boolean) => void;
}

function LedgersMergeForm({ toggleOpen }: LedgersMergeFormProps) {
  const { ungroupedLedgerOptions } = useLedgerSelect();
  const [selectedDissolveLedgers, setSelectedDissolveLedgers] = useState<Ledger[]>([]);
  const [selectedRemainLedger, setSelectedRemainLedger] = useState<Ledger | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [serverError, setServerError] = useState<Record<string, string> | null>(null);

const newLedgerOptions: Ledger[] = selectedRemainLedger
  ? ungroupedLedgerOptions.filter(
      (ledger) =>
        ledger.id !== selectedRemainLedger.id &&
        ledger.ledger_group_id === selectedRemainLedger.ledger_group_id
    )
  : ungroupedLedgerOptions;


  const mergeLedgers = useMutation(ledgerServices.mergeLedgers, {
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['ledgers-list'] });
    },
    onError: (error: any) => {
      if (error.response) {
        if (error.response.status === 400) {
          setServerError(error.response?.data?.validation_errors);
        } else {
          enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
        }
      }
    }
  });

  const validationSchema = yup.object().shape({
    remaining_ledger_id: yup
      .number()
      .required('Please select a ledger to remain')
      .typeError('Please select a ledger to remain'),
    dissolved_ledgers_ids: yup
      .array()
      .required('Please select ledgers to dissolve')
      .min(1, 'Please select at least one ledger to dissolve')
  });

  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any
  });

  const saveMutation = React.useMemo(() => {
    return mergeLedgers.mutate;
  }, [mergeLedgers]);

  return (
    <form autoComplete='off' onSubmit={handleSubmit(saveMutation)}>
      <DialogTitle>
        <Grid textAlign={'center'}>Ledgers Merge</Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={2} rowSpacing={1} mt={1}>
          <Grid item xs={12} md={6}>
            <LedgerSelect
              label='Ledger To Remain'
              frontError={errors.remaining_ledger_id}
              onChange={(newValue) => {
                setSelectedDissolveLedgers([]);
                setValue('dissolved_ledgers_ids', []);
                newValue?.id && clearErrors('remaining_ledger_id');
                setSelectedRemainLedger(newValue ?? null);
                setValue('remaining_ledger_id', newValue ? newValue.id : null);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete<Ledger, true>
              multiple
              options={newLedgerOptions}
              getOptionLabel={(ledger) => ledger.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedDissolveLedgers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors?.dissolved_ledgers_ids}
                  helperText={errors?.dissolved_ledgers_ids?.message}
                  size='small'
                  label='Ledgers To Dissolve'
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...restProps } = getTagProps({ index });
                  return (
                    <Chip
                      {...restProps}
                      key={`${option.id}-${key}`}
                      label={option.name}
                    />
                  );
                })
              }
              renderOption={(props, option, { selected }) => {
                const { key, ...restProps } = props;
                return (
                  <li {...restProps} key={`${option.id}-${key}`}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                      checkedIcon={<CheckBoxIcon fontSize='small' />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name}
                  </li>
                );
              }}
              onChange={(e, newValue: Ledger[]) => {
                setServerError(null);
                newValue && clearErrors('dissolved_ledgers_ids');
                setValue(
                  'dissolved_ledgers_ids',
                  newValue.map((ledger) => ledger.id)
                );
                setSelectedDissolveLedgers(newValue);
              }}
            />
          </Grid>

          <Grid item xs={12} textAlign={{ md: 'center' }}>
            {serverError &&
              Object.keys(serverError).map((key) => {
                const match = key.match(/\d+/);
                const index = match ? Number(match[0]) : null;

                if (index === null || !selectedDissolveLedgers?.[index]) return null;

                const ledger = selectedDissolveLedgers[index];
                return (
                  <span
                    key={`${ledger.id}-${index}`}
                    style={{ color: 'red', display: 'block' }}
                  >
                    {`${ledger.name} - This stakeholder ledger cannot be dissolved.`}
                  </span>
                );
              })}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleOpen(false)}>Cancel</Button>
        <LoadingButton
          type='submit'
          loading={mergeLedgers.isPending}
          variant='contained'
          size='small'
        >
          Merge
        </LoadingButton>
      </DialogActions>
    </form>
  );
}

export default LedgersMergeForm;
