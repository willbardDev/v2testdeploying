import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BomsFormRow from './BomFormRow';
import { AddOutlined, HighlightOff } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import bomsServices from '../boms-services';
import BomsFormItem from './BomFormItem';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import { BOMPayload } from '../BomType';


interface BomsFormProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  bom?: any;
  onSuccess?: () => void;
}

function BomsForm({ open, toggleOpen, bom = null, onSuccess }: BomsFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>(bom?.items || []);
  const [outputProduct, setOutputProduct] = useState<Product | null>(bom?.output_product || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitItemForm, setSubmitItemForm] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);
  const [formData, setFormData] = useState({
    output_quantity: bom?.output_quantity || null,
  });
  const schema = yup.object().shape({
  output_product_id: yup.number().required().positive(),
  output_quantity: yup.number().required().min(0),
  items: yup.array().of(
    yup.object().shape({
      product_id: yup.number().required().positive(),
      quantity: yup.number().required().min(0),
      measurement_unit_id: yup.number().required().positive(),
      conversion_factor: yup.number().required().min(1)
    })
  )
});

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitted },
    trigger,
  } = useForm<BOMPayload>({
    resolver: yupResolver(schema) as any,
  defaultValues: {
  product_id: bom?.output_product?.id || undefined,
  output_quantity: bom?.output_quantity || 0,
  items: bom?.items || [],
},
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue('items', items, { shouldValidate: false });
  }, [items, setValue]);

  useEffect(() => {
    if (isSubmitted) {
      trigger('items');
    }
  }, [items, isSubmitted, trigger]);

   const handleReset = () => {
  setItems([]);
  setOutputProduct(null);
  setClearFormKey(prev => prev + 1);
  setFormData({ output_quantity: null });

  // Fully reset react-hook-form state
  reset({
    product_id: undefined,
    output_quantity: 0,
    items: [],
  });

  setSubmitItemForm(false);
};


   const handleClose = () => {
    handleReset();
    toggleOpen(false);
  };

  const addBomMutation = useMutation({
    mutationFn: bomsServices.add,
    onSuccess: (data) => {
      handleClose();
      setIsSubmitting(false);
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const updateBomMutation = useMutation({
    mutationFn: ({ id, bom }: { id: number, bom: BOMPayload }) => bomsServices.update(id, bom),
    onSuccess: (data) => {
      handleClose();
      setIsSubmitting(false);
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to update BOM', { variant: 'error' });
    }
  });


    const onSubmit = async (data: BOMPayload) => {
  try {
    // Validate before submission
    const isValid = await trigger();
    if (!isValid) return;

    if (!outputProduct?.id) {
      enqueueSnackbar('Output product is required', { variant: 'error' });
      return;
    }

    if (items.length === 0) {
      enqueueSnackbar('Please add at least one item', { variant: 'error' });
      return;
    }

    const payload: BOMPayload = {
      product_id: Number(outputProduct?.id),
      output_quantity: Number(data.output_quantity) || 0,
      items: items.map(item => ({
        product_id: Number(item.product?.id || item.product_id),
        quantity: Number(item.quantity),
        measurement_unit_id: Number(item.measurement_unit_id),
        conversion_factor: Number(item.conversion_factor) || 1
      }))
    };

    console.log("Payload being sent to backend:", JSON.stringify(payload, null, 2));

    setIsSubmitting(true);
   if (bom) {
  updateBomMutation.mutate({ id: bom.id, bom: payload }, {
    onSuccess: () => {
      handleReset(); // Only reset on success
    }
  });
} else {
  addBomMutation.mutate(payload, {
    onSuccess: () => {
      handleReset(); // Only reset on success
    }
  });
}
  if (bom) {
      await updateBomMutation.mutateAsync({ id: bom.id, bom: payload });
    } else {
      await addBomMutation.mutateAsync(payload);
    }
    
  } catch (error) {
    // Error handling remains
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open}onClose={() => {handleReset(); toggleOpen(false);}} maxWidth="md" fullWidth>
      <DialogTitle component="div"> 
        <Typography variant="h4" component="h2" textAlign="center" mb={2}>
          {!bom ? 'New Bill of Material' : `Edit ${bom.id}`}
        </Typography>
      </DialogTitle>
      <DialogContent>
         <Grid container spacing={2} mb={3} sx={{ pt: 2 }}> 
           <Grid size={{xs:12, md:8}}>
            <ProductSelect
              label="Output Product"
              value={outputProduct}
              onChange={(product: Product | null) => {
                setOutputProduct(product);
                setValue('product_id', product?.id ?? 0);
              }}
              error={!!errors.product_id}
              helperText={errors.product_id?.message}
            />
          </Grid>
          <Grid size={{xs: 12, md:4}}>
             <TextField
              label="Quantity"
              size="small"
              fullWidth
              value={formData.output_quantity ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  output_quantity: value === '' ? null : Number(value)
                }));
                setValue('output_quantity', value === '' ? 0 : Number(value));
              }}
              error={!!errors.output_quantity}
              helperText={errors.output_quantity?.message as string}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <BomsFormItem
              setItems={setItems}
              items={items}
              key={clearFormKey}
              setClearFormKey={setClearFormKey}
              setSubmitItemForm={setSubmitItemForm}
              submitItemForm={submitItemForm}
              submitMainForm={handleSubmit(onSubmit)}
            />
          </Grid>

          <Grid size={12}>
            {errors.items?.message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.items.message}
              </Alert>
            )}

            {items.map((item, index) => (
              <BomsFormRow
                key={index}
                index={index}
                item={item as any}
                items={items as any}
                setItems={setItems as any}
                setClearFormKey={setClearFormKey}
                setSubmitItemForm={setSubmitItemForm}
                submitItemForm={submitItemForm}
                submitMainForm={handleSubmit(onSubmit)}
              />
            ))}
          </Grid>
        </Grid>

        {isSubmitting && <LinearProgress />}
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          onClick={() => {
            handleReset();
            toggleOpen(false);
          }}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {bom ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default BomsForm;