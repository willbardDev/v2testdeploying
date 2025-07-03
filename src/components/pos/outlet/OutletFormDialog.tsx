import React, { useMemo } from 'react';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import LedgerSelect from '@/components/accounts/ledgers/forms/LedgerSelect';
import UsersSelector from '@/components/sharedComponents/UsersSelector';
import StoreSelector from '@/components/procurement/stores/StoreSelector';

import outletService from './OutletServices';
import type { Outlet } from './OutletType';
import { Div } from '@jumbo/shared';

interface OutletFormDialogProps {
  setOpenDialog: (open: boolean) => void;
  outlet?: Outlet | null;
}

interface FormData {
  name: string;
  address: string;
  type: string;
  counters: { name: string; ledger_ids: number[] }[]; 
  user_ids: number[]; 
  stores: { id: number; name: string }[]; 
}


const OUTLET_TYPES = [
  { value: 'work center', name: 'Work Center' },
  { value: 'shop', name: 'Shop' },
];

const validationSchema = yup.object().shape({
  name: yup.string().required('Outlet name is required'),
  address: yup.string().required('Address is required'),
  type: yup.string().required('Outlet type is required'),
  counters: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Counter name is required'),
      ledger_ids: yup.array().of(yup.number().required()).min(1),
    })
  ),
  user_ids: yup.array().of(yup.number().required()).min(1),
  stores: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      name: yup.string().required(),
    })
  ).min(1),
});

const OutletFormDialog: React.FC<OutletFormDialogProps> = ({ setOpenDialog, outlet = null }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: outlet?.name || '',
      address: outlet?.address || '',
      type: outlet?.type || '',
      counters: outlet?.counters || [{ name: '', ledger_ids: [] }],
      user_ids: outlet?.user_ids || [],
      stores: outlet?.stores || [],
    },
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'counters',
  });

  const { mutate: addOutlet, isPending: addLoading } = useMutation({
    mutationFn: outletService.add,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['Outlet'] });
      setOpenDialog(false);
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Something went wrong', {
        variant: 'error',
      });
    },
  });

  const { mutate: updateOutlet, isPending: updateLoading } = useMutation({
    mutationFn: outletService.update,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['Outlet'] });
      setOpenDialog(false);
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Something went wrong', {
        variant: 'error',
      });
    },
  });

  const saveMutation = useMemo(() => {
    return outlet?.id ? updateOutlet : addOutlet;
  }, [outlet, updateOutlet, addOutlet]);

  
const onSubmit = (formData: FormData) => {
  const data = outlet?.id ? { id: outlet.id, ...formData } : formData;
  saveMutation(data);
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>Outlet Form</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid size={{xs: 12, md: 6}}>
           <Div sx={{ mt: 1, mb: 1 }}>
            <TextField
              fullWidth
              label="Name"
              size="small"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            </Div>
          </Grid>

          {/* Type */}
         <Grid size={{xs: 12, md: 6}}>
          <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={OUTLET_TYPES}
                  getOptionLabel={(opt) => opt.name}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  onChange={(_, val) => field.onChange(val?.value)}
                  value={OUTLET_TYPES.find((opt) => opt.value === field.value) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type"
                      size="small"
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    />
              
                  )}
                />
              )}
            />
          </Div>
          </Grid>

          {/* Address */}
           <Grid size={12}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <TextField
              fullWidth
              label="Address"
              size="small"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            </Div>
          </Grid>

          {/* Counters */}
           <Grid size={12}>
            <Typography fontWeight="bold" mb={1}>Counters</Typography>
            {fields.map((item, index) => (
              <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mb: 1 }}>
                 <Grid size={{xs: 12, md: 5}}>
                  <Div sx={{ mt: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Counter Name"
                    {...register(`counters.${index}.name`)}
                    error={!!errors?.counters?.[index]?.name}
                    helperText={errors?.counters?.[index]?.name?.message}
                  />
                  </Div>
                </Grid>
                 <Grid size={{xs: 12, md: 5}}>
                  <Div sx={{ mt: 1, mb: 1 }}>
                  <Controller
                    control={control}
                    name={`counters.${index}.ledger_ids`}
                    render={({ field }) => (
                      <LedgerSelect
                        multiple
                        label="Ledger Accounts"
                        onChange={(val) => field.onChange(val.map((v) => v.id))}
                        frontError={errors?.counters?.[index]?.ledger_ids}
                      />
                    )}
                  />
                  </Div>
                </Grid>
                 <Grid size={{xs: 12, md: 2}}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => append({ name: '', ledger_ids: [] })}
            >
              Add Counter
            </Button>
          </Grid>

          {/* Stores */}
          <Grid size={12}>
            <Controller
              name="stores"
              control={control}
              render={({ field }) => (
                <StoreSelector
                  multiple
                  defaultValue={field.value}
                  onChange={field.onChange}
                  frontError={errors.stores}
                />
              )}
            />
          </Grid>

          {/* Users */}
          <Grid size={12}>
            <Controller
              name="user_ids"
              control={control}
              render={({ field }) => (
                <UsersSelector
                  multiple
                  defaultValue={field.value}
                  onChange={field.onChange}
                  frontError={errors.user_ids}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} size="small">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          loading={addLoading || updateLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default OutletFormDialog;
