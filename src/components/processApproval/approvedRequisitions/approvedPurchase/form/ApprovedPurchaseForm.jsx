import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup  from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import purchaseServices from 'app/prosServices/prosERP/procurement/purchases/purchase-services'
import PurchaseOrderSummary from 'app/prosServices/prosERP/procurement/purchases/purchaseOrderForm/PurchaseOrderSummary'
import PurchaseOrderPaymentAndReceive from 'app/prosServices/prosERP/procurement/purchases/purchaseOrderForm/PurchaseOrderPaymentAndReceive'
import ApprovedPurchaseItemForm from './ApprovedPurchaseItemForm'
import ApprovedPurchaseTopInformation from './ApprovedPurchaseTopInformation'
import stakeholderServices from 'app/prosServices/prosERP/masters/stakeholders/stakeholder-services'
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers'

function ApprovedPurchaseForm({toggleOpen, approvedDetails, approvedRequisition, order, prevApprovedDetails}) {
  const {authOrganization} = useJumboAuth();
  const {costCenters} = authOrganization;
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatableAmount, setVatableAmount] = useState(0);
  const [order_date] = useState(order ? dayjs(order.order_date) : dayjs());
  const [checked, setChecked] = useState(false);
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();
  const [displayStoreSelector, setDisplayStoreSelector] = useState(false);
  const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
  const [addedStakeholder, setAddedStakeholder] = useState(null);
  
  const [items, setItems] = useState(() => {
    if (order) {
      return order.purchase_order_items?.map((orderItem) => {
        const prevItem = prevApprovedDetails?.items.find(
          (prevItem) => prevItem.id === orderItem.requisition_approval_product_item_id
        );
  
        return {
          ...orderItem,
          quantity: sanitizedNumber(orderItem.quantity),
          unordered_quantity: prevItem ? (orderItem.quantity + prevItem.unordered_quantity) : 0,
          requisition_approval_product_item_id: orderItem.requisition_approval_product_item_id,
        };
      });
    } else if (approvedDetails) {
      return approvedDetails.items.filter(item => item.unordered_quantity > 0).map((item) => ({
        ...item,
        quantity: item.unordered_quantity,
        vat_percentage: item.vat_percentage,
        requisition_approval_product_item_id: item.id,
      }));
    }
    return [];
  });

  const validationSchema = yup.object({
    order_date: yup.string().required('Order date is required'),
    currency_id: yup.number().positive('Currency is required').required('Currency is required').typeError('Currency is required'),
    cost_centers: yup.array().min(1, 'At least one cost center must be selected').required('Cost Center is required').typeError('At least one cost center must be selected'),
    exchange_rate: yup.number().positive('Exchange rate is required').required('Exchange rate is required').typeError('Exchange rate is required'),
    stakeholder_id: yup.number().positive().nullable(),
    instant_pay : yup.boolean(),
    instant_receive : yup.boolean(),
    credit_ledger_id: yup.mixed().when(['instant_pay'],{
      is: (instant_pay) => !!instant_pay,
      then: yup.number().positive('Credit Account(From) is required').required('Credit Account(From) is required').typeError('Credit Account(From) is required'),
      otherwise: yup.mixed().nullable()
    }),
    store_id: yup.number().when('instant_receive',{
      is: (instant_receive) => !!instant_receive && !!displayStoreSelector,
      then: yup.number().positive('Receiving store is required').required('Receiving store is required').typeError('Receiving store is required'),
      otherwise: yup.number().positive().nullable()
    }),
    stakeholder_ledger_id: yup.number().when(['instant_pay','stakeholder_id','instant_receive'],{
      is: (instant_pay,stakeholder_id,instant_receive) => !!instant_pay && !!stakeholder_id && !instant_receive,
      then: yup.number().positive(`Selected supplier doesn't have any account`).required(`Selected supplier doesn't have any account`).typeError(`Selected supplier doesn't have any account`),
      otherwise: yup.number().positive().nullable()
    }),
    items: yup.array().min(1, "You must add at least one item").typeError('You must add at least one item').of(
      yup.object().shape({
        product_id: yup.number().required("Product is required").positive('Product is required').typeError('Product is required'),
        quantity: yup.number().required("Quantity is required").positive("Quantity is required").typeError('Quantity is required'),
        rate: yup.number().required("Price is required").positive("Price is required").typeError('Price is required'),
      })
    ),
  });

  const {register,setValue, handleSubmit, clearErrors, watch, formState : {errors}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: order ? order.id : null,
      requisition_approval_id: approvedDetails?.id,
      order_date: order_date.toISOString(),
      currency_id: approvedDetails?.currency.id ? approvedDetails.currency.id : order.currency_id,
      exchange_rate: approvedDetails?.currency ? approvedDetails.currency.exchangeRate : order.exchange_rate,
      vat_registered: !!authOrganization.organization.settings?.vat_registered,
      reference: order ? order.reference : '',
      stakeholder_id: order ? order.stakeholder.id : null,
      store_id: order && !!order.instant_receive ? order.store.id : null,
      date_required: order && order.date_required,
      instant_pay: order ? !!order.instant_pay : true,
      instant_receive: order ? order.instant_receive : false,
      credit_ledger_id: (order && order.instant_pay) ? order.credit_ledger.id : null,
      cost_centers: approvedRequisition ? [approvedRequisition.requisition.cost_center] : order.cost_centers,
      items: items    
    }
  });

  const rowAmount = (index) => {
    const quantity = parseFloat(watch(`items.${index}.quantity`)) || 0;
    const rate = parseFloat(watch(`items.${index}.rate`)) || 0;
    return quantity * rate;
  }

  //Set Item values and calculate total amount
  const orderTotalAmount = () => {
    let total = 0;
    let vatableAmount = 0;

      //Total For all Items
      async function loopItems(){
        await setValue(`items`,null);
        await items.filter(item => item.unordered_quantity > 0).forEach((item,index) => {
          total += item.rate*item.quantity
          setValue(`items.${index}.requisition_approval_product_item_id`, item?.requisition_approval_product_item_id);
          setValue(`items.${index}.product_id`, item?.product?.id ? item.product.id : item.product_id);
          setValue(`items.${index}.quantity`, sanitizedNumber(item.quantity));
          setValue(`items.${index}.measurement_unit_id`, item.measurement_unit.id);
          setValue(`items.${index}.rate`, item.rate);
          setValue(`items.${index}.vat_percentage`, item.vat_percentage);
        });
        setTotalAmount(total);
      }

      //Total For only Items require VAT Inclusive
      async function loopItemsForVAT(){
        await setValue(`items`,null);
        await items.filter(item => item.unordered_quantity > 0).forEach((item) => {
          vatableAmount += (item.quantity*item.rate*(item.vat_percentage*0.01 || 0))
        });
        setVatableAmount(vatableAmount);
      }
    loopItems();
    loopItemsForVAT();
  }

  const instant_pay = watch('instant_pay');
  const instant_receive = watch('instant_receive');
  const stakeholder_id = watch('stakeholder_id');

  React.useEffect(() => {
    orderTotalAmount();
  },[rowAmount]);

  //Load Stakeholder credit ledgers
  const {data: stakeholderPayableLedgers} = useQuery(['stakeholderPayableLedgers',{ stakeholderId : watch('stakeholder_id')}], async() => {
    const stakeholder_id = watch('stakeholder_id');
    let retVal = [];
    if(stakeholder_id){
      retVal = await stakeholderServices.getLedgers({stakeholder_id,type: 'all'});
    }
    if(retVal.length > 0){
      setValue('stakeholder_ledger_id',retVal[0].id);
    } else {
      setValue('stakeholder_ledger_id',null);
    }
    return retVal;
  });
  
  const addPurchaseOrder = useMutation(purchaseServices.add,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvedRequisitions']);
      queryClient.invalidateQueries(['approvedPurchaseOrders']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })
  
  const updatePurchaseOrder = useMutation(purchaseServices.update,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvedRequisitions']);
      queryClient.invalidateQueries(['approvedPurchaseOrders']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  });

  const handleItemChange = (index, key, value) => {
    let updatedItems;
  
    if (key === 'delete' && value === true) {
      // Remove the item at the specified index
      updatedItems = items.filter((_, itemIndex) => itemIndex !== index);
    } else {
      // Update the item at the specified index
      updatedItems = [...items.filter(item => item.unordered_quantity > 0)];
      updatedItems[index][key] = value;
    }
  
    setItems(updatedItems);
  };

  useEffect(() => {
    const currentItems = (approvedDetails?.items || order?.purchase_order_items || [])
    .map((item) => {
      if (order) {
        const prevItem = prevApprovedDetails?.items?.find(
          (prevItem) => prevItem.id === item.requisition_approval_product_item_id
        );
    
        return {
          ...item,
          vendors: prevItem.vendors,
          quantity: sanitizedNumber(item.quantity),
          unordered_quantity: prevItem ? (item.quantity + prevItem.unordered_quantity) : 0,
          requisition_approval_product_item_id: item.requisition_approval_product_item_id,
        };
      } else {
        return {
          ...item,
          quantity: sanitizedNumber(item.unordered_quantity),
          unordered_quantity: item.unordered_quantity,
          requisition_approval_product_item_id: item.id,
        };
      }
    });
    
    const filteredItems = !!stakeholder_id
      ? currentItems?.filter(item =>
        item.vendors?.some(vendor => vendor.id === stakeholder_id) || item.vendors?.length === 0
      )
      : currentItems

      setItems(filteredItems);
}, [stakeholder_id]);

  const saveMutation = React.useMemo(() => {
    return order ? updatePurchaseOrder.mutate : addPurchaseOrder.mutate
  },[order, updatePurchaseOrder, addPurchaseOrder]);

  return (
    <FormProvider {...{setAddedStakeholder, addedStakeholder, setStakeholderQuickAddDisplay, stakeholderQuickAddDisplay, order, approvedRequisition, items, instant_receive, instant_pay, displayStoreSelector, setDisplayStoreSelector, order_date, costCenters, totalAmount, vatableAmount, checked, setChecked, setValue, errors, approvedDetails, clearErrors, watch, register}}>
      <DialogTitle>
        <Grid container columnSpacing={2}>
          <Grid textAlign={'center'} item xs={12} mb={3}>
            {order ? `Edit Order` : `New Approved Purchase Order`}
          </Grid>
          <Grid item xs={12} md={8} lg={9} mb={2}>
            <form autoComplete='off'>
              <ApprovedPurchaseTopInformation/>
            </form>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <PurchaseOrderSummary isApprovedPurchase={true}/>
          </Grid>

          <PurchaseOrderPaymentAndReceive/>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {
          errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>
        }
        <ApprovedPurchaseItemForm approvedDetails={approvedDetails} items={items} handleItemChange={handleItemChange}/>
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        {items?.length > 0 &&
          <LoadingButton 
            variant='contained' 
            size='small'
            onClick={handleSubmit(saveMutation)}
            loading={addPurchaseOrder.isLoading || updatePurchaseOrder.isLoading}>
              Submit
          </LoadingButton>
        }
      </DialogActions>
    </FormProvider>
  )
}

export default ApprovedPurchaseForm