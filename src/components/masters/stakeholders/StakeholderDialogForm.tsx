import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import stakeholderServices from './stakeholder-services';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stakeholder } from './StakeholderType';
import { Div } from '@jumbo/shared';

interface StakeholderDialogFormProps {
  stakeholder?: Stakeholder | null;
  toggleOpen: (open: boolean) => void;
}

type FormData = {
  id?: number;
  name: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  tin?: string | null;
  vrn?: string | null;
  ledger_code?: string | null;
  create_receivable: boolean;
  create_payable: boolean;
  ledger_type?: string;
};

interface ApiResponse {
  message: string;
  validation_errors?: Record<string, string[]>;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      validation_errors?: Record<string, string[]>;
    };
  };
}

const stakeholderTypes = [
  'Individual',
  'Group',
  'Sole Proprietor',
  'Partnership',
  'Private Limited',
  'Public Liability',
  'Government Institution',
  'Non-Government Organization'
] as const;

const StakeholderDialogForm: React.FC<StakeholderDialogFormProps> = ({ stakeholder, toggleOpen }) => {
  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Stakeholder type is required').typeError('Stakeholder type is required'),
    email: yup.string().email('Please enter a valid email').nullable(),
    website: yup.string()
      .matches(
        /^$|((https?):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter a correct URL!'
      )
      .nullable(),
    create_receivable: yup.boolean(),
    create_payable: yup.boolean()
  }).test('at-least-one-button', 'Select one ledger type', function (value) {
    const { create_receivable, create_payable } = value;
    if (!create_receivable && !create_payable && !stakeholder) {
      return this.createError({ path: 'ledger_type', message: 'Select one ledger type' });
    }
    return true;
  });

  const { 
    register, 
    handleSubmit, 
    trigger, 
    setError, 
    setValue, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      id: stakeholder?.id,
      name: stakeholder?.name || '',
      type: stakeholder?.type || '',
      email: stakeholder?.email || null,
      phone: stakeholder?.phone || null,
      address: stakeholder?.address || null,
      website: stakeholder?.website || null,
      tin: stakeholder?.tin || null,
      vrn: stakeholder?.vrn || null,
      create_receivable: stakeholder?.create_receivable || false,
      create_payable: stakeholder?.create_payable || false,
    }
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
  
    setValue('create_receivable', value === 'receivable', {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('create_payable', value === 'payable', {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('ledger_type', value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    trigger('ledger_type');
  };

  const addStakeholder = useMutation<ApiResponse, ErrorResponse, FormData>({
    mutationFn: (formData: FormData) => stakeholderServices.add(formData),
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['stakeholders'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      errorMessage && enqueueSnackbar(errorMessage, { variant: 'error' });

      const validationErrors = error?.response?.data?.validation_errors;
      if (validationErrors) {
        Object.keys(validationErrors).forEach((fieldName) => {
          const errorMessages = validationErrors[fieldName];
          setError(fieldName as keyof FormData, {
            type: 'manual',
            message: errorMessages.join('<br/>')
          });
        });
      }
    }
  });

  const updateStakeholder = useMutation<ApiResponse, ErrorResponse, FormData>({
    mutationFn: (formData: FormData) => stakeholderServices.update(formData),
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['stakeholders'] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'An error occurred', {
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (stakeholder?.id) {
      updateStakeholder.mutate(data);
    } else {
      addStakeholder.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <DialogTitle textAlign={'center'}>
        {!stakeholder?.id ? 'New Stakeholder' : `Edit: ${stakeholder.name}`}
      </DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={1}>
          <Grid size={{xs: 12, md: 6}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='Name*'
                fullWidth
                defaultValue={stakeholder?.name}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                {...register('name')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <Autocomplete
                size="small"
                isOptionEqualToValue={(option, value) => option === value}
                options={stakeholderTypes}
                defaultValue={stakeholder?.type}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type*"
                    error={!!errors?.type}
                    helperText={errors?.type?.message}
                  />
                )}
                onChange={(event, newValue) => {
                  setValue('type', newValue ? newValue : '', {
                    shouldDirty: true,
                    shouldValidate: true
                  });
                }}
              />
            </Div>
          </Grid>
          {!stakeholder &&
            <Grid size={{xs: 12, md: 3}}>
              <Div sx={{ mt: 1, mb: 1 }}>
                <TextField
                  size='small'
                  label='Ledger Code'
                  fullWidth
                  error={!!errors?.ledger_code}
                  helperText={errors?.ledger_code?.message}
                  {...register('ledger_code')}
                />
              </Div>
            </Grid>
          }
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='Email'
                fullWidth
                defaultValue={stakeholder?.email}
                error={!!errors?.email}
                helperText={errors?.email?.message}
                {...register('email')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='Phone'
                fullWidth
                defaultValue={stakeholder?.phone}
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
                {...register('phone')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='TIN'
                fullWidth
                defaultValue={stakeholder?.tin}
                error={!!errors?.tin}
                helperText={errors?.tin?.message}
                {...register('tin')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='VRN'
                fullWidth
                defaultValue={stakeholder?.vrn}
                error={!!errors?.vrn}
                helperText={errors?.vrn?.message}
                {...register('vrn')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='Website'
                fullWidth
                defaultValue={stakeholder?.website}
                error={!!errors?.website}
                helperText={errors?.website?.message}
                {...register('website')}
              />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: stakeholder ? 12 : 9}}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <TextField
                size='small'
                label='Address'
                fullWidth
                defaultValue={stakeholder?.address}
                multiline={true}
                minRows={2}
                error={!!errors?.address}
                helperText={errors?.address?.message}
                {...register('address')}
              />
            </Div>
          </Grid>
          {
            !stakeholder ? 
            <Grid size={12}>
              <Div sx={{ mt: 1, mb: 1 }}>
                <FormLabel component="legend">Ledger Type</FormLabel>
                <RadioGroup
                  row
                  aria-label="ledger_type"
                  name="ledger_type"
                  onChange={handleRadioChange}
                >
                  <FormControlLabel value="receivable" control={<Radio />} label="Receivable Account" />
                  <FormControlLabel value="payable" control={<Radio />} label="Payable Ledger" />
                </RadioGroup>
                {errors.ledger_type && (
                  <FormHelperText error>{errors.ledger_type?.message}</FormHelperText>
                )}
              </Div>
            </Grid>
            : null
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleOpen(false)}>Cancel</Button>
        <LoadingButton 
          loading={addStakeholder.isPending || updateStakeholder.isPending} 
          type="submit" 
          variant="contained"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default StakeholderDialogForm;