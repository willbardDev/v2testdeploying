import { LoadingButton } from '@mui/lab';
import { Grid, Input, Divider, Typography, Box, Stack, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import priceListServices from '../priceLists-services';
import OutletSelector from '../../outlets/OutletSelector';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function PriceListsExcel({ setOpenExcelDialog }) {
    const authObject = useJumboAuth();
    const { authOrganization } = authObject;
    const [isDownloadingTemplate, setIsDownloadingTemplate] = React.useState(false);
    const [uploadFieldsKey, setUploadFieldsKey] = useState(0)

    const validationSchema = yup.object({
      effective_date: yup
        .string()
        .required('Effective date is required')
        .typeError('Effective date is required'),
      sales_outlet_ids: yup
        .array()
        .min(1, 'At least one outlet must be selected')
        .required('At least one outlet must be selected'),
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const uploadExcel = useMutation(priceListServices.importPriceListsExcel, {
      onSuccess: (data) => {
        data?.message && enqueueSnackbar(data.message, { variant: 'success' });
        setOpenExcelDialog(false);
        queryClient.invalidateQueries('priceLists');
      },
      onError: (error) => {
        error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    });

    const downloadExcelTemplate = async () => {
      try {
        setIsDownloadingTemplate(true);
        setUploadFieldsKey((prevKey)=> prevKey + 1);
        const responseData = await priceListServices.downloadExcelTemplate();
        const blob = new Blob([responseData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Price List Excel Template.xlsx';
        link.click();
        setIsDownloadingTemplate(false);
      } catch (error) {
        enqueueSnackbar('Error downloading Excel template', { variant: 'error' });
        setIsDownloadingTemplate(false);
      }
    };

    // Watch the outlets to ensure at least one is selected
    const selectedOutlets = watch('sales_outlet_ids') || [];

    return (
      <>
        <DialogTitle textAlign={'center'}>{`Excel Template`}</DialogTitle>
        <DialogContent>
            <form autoComplete='off' key={uploadFieldsKey} onSubmit={handleSubmit(uploadExcel.mutate)}>
                <Grid container py={1} spacing={2}>
                    <Grid item xs={12} md={4} lg={4}>
                      <DatePicker
                        label="Effective Date"
                        fullWidth
                        name="Effective Date"
                        minDate={dayjs(authOrganization.organization.recording_start_date)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!errors?.effective_date,
                            helperText: errors?.effective_date?.message
                          }
                        }}
                        onChange={(newValue) => {
                          setValue('effective_date', newValue ? newValue.toISOString() : null, {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8} lg={8}>
                        <OutletSelector
                          multiple={true}
                          label='Outlets'
                          frontError={errors.sales_outlet_ids}
                          onChange={(newValue) => {
                            setValue('sales_outlet_ids', newValue.map(value => value.id), {
                              shouldValidate: true
                            });
                          }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label={'Price Lists Excel'}
                            type="file"
                            required
                            id="excel-import"
                            inputProps={{
                                accept: '.xlsx, .xls'
                            }}
                            {...register("price_lists_excel")}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                        <LoadingButton
                            size='small'
                            loading={uploadExcel.isLoading}
                            type='submit'
                            variant='contained'
                            color='success'
                            disabled={selectedOutlets.length === 0}
                        >
                            Upload
                        </LoadingButton>
                    </Stack>
                </Grid>
            </form>

            <Box sx={{ my: 2 }}>
                <Divider>
                    <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>
            </Box>

            <Box>
                <Typography variant="body1" gutterBottom>
                    Download Excel template to prepare your data:
                </Typography>
                <Grid item xs={12} mt={2}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                        <LoadingButton
                            size="small"
                            onClick={downloadExcelTemplate}
                            loading={isDownloadingTemplate}
                            variant="outlined"
                            color="primary"
                        >
                            Download Template
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            size='small'
            onClick={() => setOpenExcelDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    );
}

export default PriceListsExcel;