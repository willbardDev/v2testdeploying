import { LoadingButton } from '@mui/lab'
import { Button, DialogActions, Grid, Input } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers';
import React from 'react'
import { useForm } from 'react-hook-form'
import LedgerSelect from '../../accounts/ledgers/forms/LedgerSelect';
import { useMutation, useQueryClient } from 'react-query';
import productServices from './product-services';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'

function ProductsExcelImport({setOpenDialog}) {
      //Validation schema
    const validationSchema = yup.object({
        stock_as_at: yup
            .string()
            .required('Stock Date is required').typeError('Stock Date is required'),
        stock_complement_ledger_id: yup
                .number().positive('Complement Ledger is required')
                .required('Complement Ledger is required').typeError('Complement Ledger is required'),
    });

    const {register, handleSubmit, setValue, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            stock_as_at: dayjs().toISOString()
        }
    });
    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();
    const {authOrganization} = useJumboAuth();

    const uploadExcel = useMutation(productServices.importProductsExcel,{
        onSuccess: (data) => {
            data?.message && enqueueSnackbar(data.message,{variant:'success'});
            setOpenDialog(false);
            queryClient.invalidateQueries('productParams');
            queryClient.invalidateQueries('products');
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
        }
    }); 
  return (
    <form autoComplete='off' onSubmit={handleSubmit(uploadExcel.mutate)}>
        <Grid container mt={3} py={1} spacing={2}>

            <Grid item xs={12}>
                <Input
                    label={'Products Excel'}
                    type="file"
                    required
                    id="excel-import"
                    {...register("products_excel")}
                />
            </Grid>
            <Grid item xs={12}  md={6}>
                <DateTimePicker
                    label="Stock As at"
                    fullWidth
                    defaultValue={dayjs()}
                    minDate={dayjs(authOrganization.organization.recording_start_date)}
                    slotProps={{
                        textField : {
                            size: 'small',
                            fullWidth: true,
                            readOnly: true,
                            error: !!errors?.stock_as_at,
                            helperText: errors?.stock_as_at?.message
                        }
                    }}
                    onChange={(newValue) => {
                        setValue('stock_as_at', newValue ? newValue.toISOString() : null,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Grid>
            <Grid item xs={12}  md={6}>
                <LedgerSelect
                    label={'Stock Complement Ledger'}
                    allowedGroups={['Capital','Expenses','Accounts Payable']}
                    frontError={errors.stock_complement_ledger_id}
                    onChange={(newValue) => setValue('stock_complement_ledger_id', !!newValue ? newValue.id : null,{
                        shouldValidate: true,
                        shouldDirty: true
                    })}
                />
            </Grid>
        </Grid>
        <DialogActions>
            <Button
                size='small'
                onClick={() => setOpenDialog(false)}
            >
            Cancel
            </Button>
            <LoadingButton
                size='small'
                loading={uploadExcel.isLoading}
                type='submit'
                variant='contained'
                color='success'
            >
                Upload
            </LoadingButton>
        </DialogActions>
    </form>
  )
}

export default ProductsExcelImport