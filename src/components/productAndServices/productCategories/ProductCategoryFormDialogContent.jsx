import { LoadingButton } from '@mui/lab';
import { Autocomplete, DialogContent, DialogTitle, DialogActions, Grid, TextField, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import LedgerSelect from '../../accounts/ledgers/forms/LedgerSelect';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import productCategoryServices from './productCategoryServices';

const ProductCategoryFormDialogContent = ({
  title = 'New Category',
  onClose,
  productCategory = null,
  productCategories,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const addProductCategory = useMutation({
    mutationFn: productCategoryServices.add,
    onSuccess: (data) => {
      onClose();
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    },
  });

  const updateProductCategory = useMutation({
    mutationFn: productCategoryServices.update,
    onSuccess: (data) => {
      onClose();
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['productCategoryOptions'] });
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    },
  });

  const saveMutation = React.useMemo(() => {
    return productCategory?.id ? updateProductCategory.mutate : addProductCategory.mutate;
  }, [productCategory, updateProductCategory, addProductCategory]);

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Category Name is required'),
    parent_id: yup
      .number()
      .nullable(),
    income_ledger_id: yup
      .number()
      .required('Income ledger is required')
      .positive('Income ledger is required'),
    expense_ledger_id: yup
      .number()
      .required('Expense ledger is required')
      .positive('Expense ledger is required'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      parent_id: productCategory?.parent_id ?? null,
      name: productCategory?.name ?? '',
      description: productCategory?.description ?? '',
      id: productCategory?.id,
      income_ledger_id: productCategory?.income_ledger_id ?? 0,
      expense_ledger_id: productCategory?.expense_ledger_id ?? 0,
    },
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit(saveMutation)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container p={1} spacing={1} rowGap={1}>
          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              label="Category Name"
              size="small"
              error={Boolean(
                errors.name || 
                addProductCategory.error?.response?.data?.validation_errors?.name || 
                updateProductCategory.error?.response?.data?.validation_errors?.name
              )}
              helperText={
                errors.name?.message || 
                addProductCategory.error?.response?.data?.validation_errors?.name || 
                updateProductCategory.error?.response?.data?.validation_errors?.name
              }
              {...register('name')}
            />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <Autocomplete
              size="small"
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={productCategories}
              getOptionLabel={(option) => option.name}
              defaultValue={productCategories.find((parent) => parent.id === productCategory?.parent_id) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent Category"
                  error={Boolean(errors.parent_id)}
                  helperText={errors.parent_id?.message}
                />
              )}
              onChange={(event, newValue) => {
                if (productCategory && productCategory?.id === newValue?.id) {
                  setValue('parent_id', null);
                  setError('parent_id', { message: "Cannot be a parent of its own" });
                } else {
                  setValue('parent_id', newValue ? newValue.id : null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <LedgerSelect
              label="Income Ledger"
              allowedGroups={['Sales and Revenue']}
              frontError={errors.income_ledger_id}
              defaultValue={productCategory?.income_ledger || undefined}
              onChange={(newValue) => {
                setValue('income_ledger_id', newValue ? newValue.id : 0, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <LedgerSelect
              label="Expense Ledger"
              allowedGroups={['Direct Expenses', 'Indirect Expenses']}
              frontError={errors.expense_ledger_id}
              defaultValue={productCategory?.expense_ledger || undefined}
              onChange={(newValue) => {
                setValue('expense_ledger_id', newValue ? newValue.id : 0, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              multiline
              label="Description"
              fullWidth
              size="small"
              rows={2}
              {...register('description')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          loading={addProductCategory.isPending || updateProductCategory.isPending}
          size="small"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default ProductCategoryFormDialogContent;