import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Alert, Dialog, Tooltip, IconButton} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form'
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import dayjs from 'dayjs';
import posServices from '../../pos-services';
import SaleItemForm from './SaleItemForm';
import { useCounter } from '../CounterProvider';
import SaleItemRow from './SaleItemRow';
import ProductsSaleSummary from './ProductsSaleSummary';
import SaleTopInformation from './SaleTopInformation';
import { HighlightOff } from '@mui/icons-material';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { MODULE_SETTINGS } from '@/utilities/constants/moduleSettings';

function SaleDialogForm({toggleOpen,sale = null}) {
    const [items, setItems] = useState([]);
    const {activeCounter} = useCounter();
    const [transaction_date] = useState(sale ? dayjs(sale.transaction_date) : dayjs());
    const [counterLedgers, setCounterLedgers] = useState([]);
    const {enqueueSnackbar} = useSnackbar();
    const {authOrganization : {organization},checkOrganizationPermission,moduleSetting} = useJumboAuth();
    const queryClient = useQueryClient();
    const [checkedForSuggestPrice, setCheckedForSuggestPrice] = useState(false);
    const [debitLedger, setDebitLedger] = useState(sale?.debit_ledger ?? sale?.debit_ledger);
    const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
    const [addedStakeholder, setAddedStakeholder] = useState(null);
    const [checkedForInstantSale, setCheckedForInstantSale] = useState(sale ? (!sale.is_instant_sale ? false : true) : true);

    const [showWarning, setShowWarning] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [clearFormKey, setClearFormKey] = useState(0);
    const [submitItemForm, setSubmitItemForm] = useState(false);

    useEffect(() => {
        if(activeCounter?.id){
            setCounterLedgers(activeCounter.ledgers);
            setValue('sales_outlet_counter_id',activeCounter.id);
        }
    }, [activeCounter]);

    const validationSchema = yup.object({
        sales_outlet_counter_id: yup
            .number()
            .required('Sales Outlet is required')
            .typeError('Sales Outlet is required'),
        currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
        transaction_date: yup.string().required('Sales Date is required').typeError('Sales Date is required'),
        payment_method: yup.string().required('Payment method is required'),
        submitType: yup
            .string()
            .required('Submit type is required')
            .oneOf(['complete', 'pending'], 'Submit type must be either "complete" or "pending"'),
        debit_ledger_id: yup.number()
            .when('submitType', (submitType, schema) => {
                return submitType === 'complete' 
                ? schema.required('Debit account is required').typeError('Debit account is required')
                : schema.nullable();
        }),
        items: yup.array()
            .min(1, "You must add at least one item")
            .of(
                yup.object().shape({
                product_id: yup.number().required("Product is required").positive('Product is required'),
                quantity: yup.number().required("Quantity is required").positive("Quantity is required"),
                rate: yup.number().required("Price is required").positive("Price is required"),
                })
            )
        .required("You must add at least one item"),
    });

    const {setValue, setError, register, handleSubmit, watch, clearErrors, formState : {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            transaction_date : transaction_date.toISOString(),
            currency_id: sale?.currency_id ? sale.currency_id : 1,
            exchange_rate: sale?.exchange_rate ? sale.exchange_rate : 1,
            vat_registered: !!organization.settings?.vat_registered,
            vat_percentage: sale ? sale.vat_percentage : !!moduleSetting(MODULE_SETTINGS.POS_DEFAULT_VAT_INCLUSIVE) ? (!!organization.settings?.vat_registered && organization.settings.vat_percentage) : 0,
            reference: sale && sale.reference,
            id: sale && sale.id,
            stakeholder_id: sale?.stakeholder.id ? sale.stakeholder.id : null,
            debit_ledger_id: !!sale?.debit_ledger?.id ? sale.debit_ledger.id : null,
            sales_outlet_counter_id: activeCounter?.id,
            payment_method: !!sale && sale.payment_method === "On Account" ? 'on_account' : 'instant',
            items: items,
            major_info_only: !!sale && (!!sale.is_invoiced || !!sale?.has_receipts || (
                //BackDate Control
                !checkOrganizationPermission(PERMISSIONS.SALES_BACKDATE) && sale.transaction_date < dayjs().startOf('day').toISOString()
                && 
                (sale.status !== 'Pending' || sale.status !== 'Ordered') //Allow BackDate if Sale is pending or ordered and doesn't have receipts nor invoices
            )),
            submitType: 'complete',
            remarks: sale && sale?.remarks,
            instant_sale: checkedForInstantSale,
        }
    });

    const vat_percentage = watch('vat_percentage');
    const stakeholder_id = watch('stakeholder_id');
    const salesDate = watch(`transaction_date`);
    const majorInfoOnly = watch('major_info_only');
    const currencyId = watch('currency_id');

    const getLastPriceItems = {
        stakeholder_id : stakeholder_id,
        currency_id: currencyId,
        date: salesDate,
    }

    // setvalues from coming addedStakeholder
    useEffect(() => {
        if(addedStakeholder?.id){
          setValue('stakeholder_id', addedStakeholder.id);
          setValue('tin', addedStakeholder.tin, {
            shouldTouch: true,
          });
          setValue('vrn', addedStakeholder.vrn);
          setStakeholderQuickAddDisplay(false)
        }
      }, [addedStakeholder])

    // Reset switch to off if stakeholder is null
    useEffect(() => {
        if (!stakeholder_id || !checkedForSuggestPrice) {
            if(!stakeholder_id){
                setCheckedForInstantSale(true);
            }
          setCheckedForSuggestPrice(false);    
        }
    }, [stakeholder_id]);

    //Load Stakeholder debit ledgers
    const { data: stakeholderReceivableLedgers, isLoading: isLoadingReceivableLedgers } = useQuery({
        queryKey: ['stakeholderReceivableLedgers', { stakeholderId: stakeholder_id }],
        queryFn: async () => {
            let retVal = [];
            if (stakeholder_id && sale) { // when sale available on Edit
               retVal = await stakeholderServices.getLedgers({ stakeholder_id, type: 'all' });
            } else if (stakeholder_id) {
               retVal = await stakeholderServices.getLedgers({ stakeholder_id, type: 'all' });
            }
            return retVal;
        },
        enabled: !majorInfoOnly
    });

    const addSale = useMutation({
        mutationFn: posServices.addSale,
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['counterSales'] });
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const updateSale = useMutation({
        mutationFn: posServices.updateSale,
        onSuccess: (data) => {
            toggleOpen(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['counterSales'] });
        },
        onError: (error) => {
            error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    });

    const saveMutation = React.useMemo(() => {
        return sale?.id ? updateSale : addSale
    },[updateSale,addSale]);

    useEffect(() => {
        if (!!sale?.sale_items) {
            setItems(sale.sale_items.map(item => {
                return {...item, store_id: item?.inventory_movement?.store_id}
            }));
        }
    }, [sale]);

    const onSubmit = async (data) => {
        if (items.length === 0) {
            setError("items", { type: "manual", message: "You must add at least one item" });
            return;
        }

        if (isDirty) {
            setShowWarning(true);
            return;
        }

        try {
            const updatedData = { ...data, items };
            await saveMutation.mutateAsync(updatedData);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };
      
    const handleConfirmSubmitWithoutAdd = async (data) => {
        handleSubmit((data) => handleSubmitForm(data))();
        setIsDirty(false);
        setShowWarning(false);
        setClearFormKey((prev) => prev + 1);
    };
    
    const handleSubmitForm = async (data) => {
        const updatedData = { ...data, items };
        await saveMutation.mutate(updatedData);
    };

  return (
    <FormProvider {...{ 
        salesDate, getLastPriceItems, checkedForSuggestPrice, items, setItems, counterLedgers,
        setAddedStakeholder, debitLedger, setDebitLedger, isLoadingReceivableLedgers, 
        stakeholderReceivableLedgers, addedStakeholder, stakeholderQuickAddDisplay, 
        setStakeholderQuickAddDisplay, sale, setCheckedForSuggestPrice, vat_percentage, organization,
        checkedForInstantSale, setCheckedForInstantSale,setValue,register, handleSubmit, 
        watch, clearErrors, errors
    }}>
        <DialogTitle>
            <Grid container columnSpacing={2}>
                <Grid textAlign={'center'} size={12} mb={3}>
                    {!sale ? 'New Sale' : `Edit: ${sale.saleNo} `}
                </Grid>

                <Grid size={{xs: 12, md: 9}} mb={2}>
                    <SaleTopInformation />
                </Grid>
                
                <Grid size={{xs: 12, md: 3}}>
                    <ProductsSaleSummary />
                </Grid>
                
                {
                    !majorInfoOnly &&
                    <Grid size={12}>
                        <SaleItemForm setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} key={clearFormKey} setIsDirty={setIsDirty} vat_percentage={vat_percentage} />
                    </Grid>
                }
            </Grid>
        </DialogTitle>
        {
            !majorInfoOnly &&
            <DialogContent>
                {
                    errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
                }
                {
                    items.map((item,index) => {
                        return <SaleItemRow setClearFormKey={setClearFormKey} submitMainForm={handleSubmit((data) => saveMutation.mutate(data))} submitItemForm={submitItemForm} setSubmitItemForm={setSubmitItemForm} setIsDirty={setIsDirty} key={index} item={item} index={index} vat_percentage={vat_percentage} />
                    })
                }

                <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
                    <DialogTitle>            
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid size={11}>
                                Unsaved Changes
                            </Grid>
                            <Grid size={1} textAlign="right">
                                <Tooltip title="Close">
                                    <IconButton
                                        size="small" 
                                        onClick={() => setShowWarning(false)}
                                    >
                                        <HighlightOff color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        Last item was not added to the list
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => {setSubmitItemForm(true); setShowWarning(false);}}>
                            Add and Submit
                        </Button>
                        <Button size="small" onClick={handleConfirmSubmitWithoutAdd} color="secondary">
                            Submit without add
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
        }
        <DialogActions>
            <Button size='small' onClick={() => toggleOpen(false)}>
                Cancel
            </Button>
            {
                !stakeholderQuickAddDisplay &&
            <>
                {
                    !majorInfoOnly &&
                    <LoadingButton
                        loading={addSale.isPending || updateSale.isPending}
                        size='small'
                        variant='contained'
                        onClick={(e) => {
                            setValue('submitType','pending');
                            handleSubmit(onSubmit)(e)
                        }}
                    >
                        Suspend
                    </LoadingButton>
                }
                {
                    checkOrganizationPermission(PERMISSIONS.SALES_COMPLETE) &&
                    <LoadingButton
                        loading={addSale.isPending || updateSale.isPending}
                        size='small'
                        type='submit'
                        color='success'
                        variant='contained'
                        onClick={handleSubmit(onSubmit)}
                    >
                        Checkout
                    </LoadingButton>
                }
            </>
            }
        </DialogActions>
    </FormProvider>


  )
}

export default SaleDialogForm