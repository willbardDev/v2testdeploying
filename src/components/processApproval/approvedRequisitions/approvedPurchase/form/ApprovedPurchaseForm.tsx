import { LoadingButton } from '@mui/lab';
import { Alert, Button, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import ApprovedPurchaseItemForm from './ApprovedPurchaseItemForm';
import ApprovedPurchaseTopInformation from './ApprovedPurchaseTopInformation';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sanitizedNumber } from '@/app/helpers/input-sanitization-helpers';
import stakeholderServices from '@/components/masters/stakeholders/stakeholder-services';
import purchaseServices from '@/components/procurement/purchases/purchase-services';
import PurchaseOrderSummary from '@/components/procurement/purchases/purchaseOrderForm/PurchaseOrderSummary';
import PurchaseOrderPaymentAndReceive from '@/components/procurement/purchases/purchaseOrderForm/PurchaseOrderPaymentAndReceive';
import { PurchaseApprovalRequisition } from '../../ApprovalRequisitionType';

interface Order {
  id?: number;
  order_date?: string;
  currency_id?: number;
  exchange_rate?: number;
  reference?: string;
  stakeholder?: { id: number };
  store?: { id: number };
  date_required?: string;
  instant_pay?: boolean;
  instant_receive?: boolean;
  credit_ledger?: { id: number };
  cost_centers?: any[];
  purchase_order_items?: Array<{
    requisition_approval_product_item_id: number;
    quantity: number;
    rate: number;
    measurement_unit: { id: number };
    vat_percentage: number;
    product: { id: number };
    vendors?: Array<{ id: number }>;
  }>;
}

interface FormValues {
  id?: number | null;
  requisition_approval_id?: number;
  order_date: string;
  currency_id: number;
  exchange_rate: number;
  vat_registered: boolean;
  reference: string;
  stakeholder_id: number | null;
  store_id: number | null;
  date_required?: string;
  instant_pay: boolean;
  instant_receive: boolean;
  credit_ledger_id: number | null;
  cost_centers: any[];
  items: Array<{
    requisition_approval_product_item_id: number;
    product_id: number;
    quantity: number;
    rate: number;
    measurement_unit_id: number;
    vat_percentage: number;
  }>;
  stakeholder_ledger_id?: number | null;
}

interface ApprovedPurchaseFormProps {
  toggleOpen: (open: boolean) => void;
  approvedDetails?: any;
  approvedRequisition?: PurchaseApprovalRequisition;
  order?: Order;
  prevApprovedDetails?: any;
}

const ApprovedPurchaseForm: React.FC<ApprovedPurchaseFormProps> = ({
  toggleOpen,
  approvedDetails,
  approvedRequisition,
  order,
  prevApprovedDetails
}) => {
  const { authOrganization } = useJumboAuth();
  const costCenters = authOrganization;
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatableAmount, setVatableAmount] = useState(0);
  const [order_date] = useState(order?.order_date ? dayjs(order.order_date) : dayjs());
  const [checked, setChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [displayStoreSelector, setDisplayStoreSelector] = useState(false);
  const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
  const [addedStakeholder, setAddedStakeholder] = useState<any>(null);

  const [items, setItems] = useState(() => {
    if (order?.purchase_order_items) {
      return order.purchase_order_items.map((orderItem) => {
        const prevItem = prevApprovedDetails?.items?.find(
          (prevItem: any) => prevItem.id === orderItem.requisition_approval_product_item_id
        );

        return {
          ...orderItem,
          quantity: sanitizedNumber(orderItem.quantity),
          unordered_quantity: prevItem ? (orderItem.quantity + prevItem.unordered_quantity) : 0,
          requisition_approval_product_item_id: orderItem.requisition_approval_product_item_id,
        };
      });
    } else if (approvedDetails?.items) {
      return approvedDetails.items
        .filter((item: any) => item.unordered_quantity > 0)
        .map((item: any) => ({
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
    instant_pay: yup.boolean(),
    instant_receive: yup.boolean(),
    credit_ledger_id: yup.mixed().when(['instant_pay'], {
      is: (instant_pay: boolean) => !!instant_pay,
      then: yup.number().positive('Credit Account(From) is required').required('Credit Account(From) is required').typeError('Credit Account(From) is required'),
      otherwise: yup.mixed().nullable()
    }),
    store_id: yup.number().when('instant_receive', {
      is: (instant_receive: boolean) => !!instant_receive && !!displayStoreSelector,
      then: yup.number().positive('Receiving store is required').required('Receiving store is required').typeError('Receiving store is required'),
      otherwise: yup.number().positive().nullable()
    }),
    stakeholder_ledger_id: yup.number().when(['instant_pay', 'stakeholder_id', 'instant_receive'], {
      is: (instant_pay: boolean, stakeholder_id: number, instant_receive: boolean) => !!instant_pay && !!stakeholder_id && !instant_receive,
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

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      id: order?.id || null,
      requisition_approval_id: approvedDetails?.id,
      order_date: order_date.toISOString(),
      currency_id: approvedDetails?.currency?.id || order?.currency_id || 1,
      exchange_rate: approvedDetails?.currency?.exchangeRate || order?.exchange_rate || 1,
      vat_registered: !!authOrganization?.organization.settings?.vat_registered,
      reference: order?.reference || '',
      stakeholder_id: order?.stakeholder?.id || null,
      store_id: (order?.instant_receive && order?.store) ? order.store.id : null,
      date_required: order?.date_required,
      instant_pay: order?.instant_pay ?? true,
      instant_receive: order?.instant_receive ?? false,
      credit_ledger_id: (order?.instant_pay && order?.credit_ledger) ? order.credit_ledger.id : null,
      cost_centers: approvedRequisition ? [approvedRequisition.requisition.cost_center] : order?.cost_centers || [],
      items: items
    }
  });

  const { register, setValue, handleSubmit, clearErrors, watch, formState: { errors } } = formMethods;

  const rowAmount = (index: number) => {
    const quantity = parseFloat(watch(`items.${index}.quantity`)) || 0;
    const rate = parseFloat(watch(`items.${index}.rate`)) || 0;
    return quantity * rate;
  };

  const orderTotalAmount = () => {
    let total = 0;
    let vatableAmount = 0;

    const calculateTotals = async () => {
      await setValue(`items`, []);
      items.filter(item => item.unordered_quantity > 0).forEach((item, index) => {
        total += item.rate * item.quantity;
        setValue(`items.${index}.requisition_approval_product_item_id`, item?.requisition_approval_product_item_id);
        setValue(`items.${index}.product_id`, item?.product?.id ? item.product.id : item.product_id);
        setValue(`items.${index}.quantity`, sanitizedNumber(item.quantity));
        setValue(`items.${index}.measurement_unit_id`, item.measurement_unit.id);
        setValue(`items.${index}.rate`, item.rate);
        setValue(`items.${index}.vat_percentage`, item.vat_percentage);
      });
      setTotalAmount(total);
    };

    const calculateVAT = async () => {
      await setValue(`items`, []);
      items.filter(item => item.unordered_quantity > 0).forEach((item) => {
        vatableAmount += (item.quantity * item.rate * (item.vat_percentage * 0.01 || 0));
      });
      setVatableAmount(vatableAmount);
    };

    calculateTotals();
    calculateVAT();
  };

  const instant_pay = watch('instant_pay');
  const instant_receive = watch('instant_receive');
  const stakeholder_id = watch('stakeholder_id');

  useEffect(() => {
    orderTotalAmount();
  }, [items]);

  const { data: stakeholderPayableLedgers } = useQuery({
    queryKey: ['stakeholderPayableLedgers', { stakeholderId: stakeholder_id }],
    queryFn: async () => {
      if (!stakeholder_id) return [];
      const ledgers = await stakeholderServices.getLedgers({ stakeholder_id, type: 'all' });
      if (ledgers.length > 0) {
        setValue('stakeholder_ledger_id', ledgers[0].id);
      } else {
        setValue('stakeholder_ledger_id', null);
      }
      return ledgers;
    },
    enabled: !!stakeholder_id
  });

  const addPurchaseOrder = useMutation({
    mutationFn: purchaseServices.add,
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['approvedRequisitions'] });
      queryClient.invalidateQueries({ queryKey: ['approvedPurchaseOrders'] });
    },
    onError: (error: any) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const updatePurchaseOrder = useMutation({
    mutationFn: purchaseServices.update,
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['approvedRequisitions'] });
      queryClient.invalidateQueries({ queryKey: ['approvedPurchaseOrders'] });
    },
    onError: (error: any) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const handleItemChange = (index: number, key: string, value: any) => {
    if (key === 'delete' && value === true) {
      setItems(items.filter((_: string, itemIndex: number) => itemIndex !== index));
    } else {
      const updatedItems = [...items];
      updatedItems[index][key] = value;
      setItems(updatedItems);
    }
  };

  useEffect(() => {
    const currentItems = (approvedDetails?.items || order?.purchase_order_items || [])
      .map((item: any) => {
        if (order) {
          const prevItem = prevApprovedDetails?.items?.find(
            (prevItem: any) => prevItem.id === item.requisition_approval_product_item_id
          );

          return {
            ...item,
            vendors: prevItem?.vendors,
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

    const filteredItems = stakeholder_id
      ? currentItems?.filter((item: any) =>
          item.vendors?.some((vendor: any) => vendor.id === stakeholder_id) || item.vendors?.length === 0
        )
      : currentItems;

    setItems(filteredItems || []);
  }, [stakeholder_id]);

  const saveMutation = useMemo(() => {
    return order ? updatePurchaseOrder.mutate : addPurchaseOrder.mutate;
  }, [order, updatePurchaseOrder, addPurchaseOrder]);

  return (
    <FormProvider {...formMethods}>
      <DialogTitle>
        <Grid container columnSpacing={2}>
          <Grid textAlign={'center'} size={12} mb={3}>
            {order ? `Edit Order` : `New Approved Purchase Order`}
          </Grid>
          <Grid size={{xs: 12, md: 8, lg: 9}} mb={2}>
            <form autoComplete='off'>
              <ApprovedPurchaseTopInformation
                setAddedStakeholder={setAddedStakeholder}
                addedStakeholder={addedStakeholder}
                setStakeholderQuickAddDisplay={setStakeholderQuickAddDisplay}
                stakeholderQuickAddDisplay={stakeholderQuickAddDisplay}
                order={order}
                approvedRequisition={approvedRequisition}
                items={items}
                instant_receive={instant_receive}
                instant_pay={instant_pay}
                displayStoreSelector={displayStoreSelector}
                setDisplayStoreSelector={setDisplayStoreSelector}
                order_date={order_date}
                costCenters={costCenters}
                totalAmount={totalAmount}
                vatableAmount={vatableAmount}
                checked={checked}
                setChecked={setChecked}
                setValue={setValue}
                errors={errors}
                approvedDetails={approvedDetails}
                clearErrors={clearErrors}
                watch={watch}
                register={register}
              />
            </form>
          </Grid>
          <Grid size={{xs: 12, md: 4, lg: 3}}>
            <PurchaseOrderSummary isApprovedPurchase={true} />
          </Grid>

          <PurchaseOrderPaymentAndReceive />
        </Grid>
      </DialogTitle>
      <DialogContent>
        {errors?.items?.message && items.length < 1 && <Alert severity='error'>{errors.items.message}</Alert>}
        <ApprovedPurchaseItemForm 
          approvedDetails={approvedDetails} 
          items={items} 
          handleItemChange={handleItemChange}
        />
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        {items?.length > 0 &&
          <LoadingButton
            variant='contained'
            size='small'
            onClick={handleSubmit((data) => saveMutation(data))}
            loading={addPurchaseOrder.isPending || updatePurchaseOrder.isPending}
          >
            Submit
          </LoadingButton>
        }
      </DialogActions>
    </FormProvider>
  );
};

export default React.memo(ApprovedPurchaseForm);