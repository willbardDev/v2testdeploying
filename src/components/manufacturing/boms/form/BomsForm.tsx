import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BomsFormRow from './BomsFormRow';
import { AddOutlined, HighlightOff } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import bomsServices from '../boms-services';
import BomsFormItem from './BomsFormItem';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';

interface BomsFormProps {
  toggleOpen: (open: boolean) => void;
  bom?: any;
  onSuccess?: () => void;
}

interface BomsFormValues {
  output_product_id?: number;
  output_quantity: number;
  items: {
    product_id?: number;
    quantity: number;
    alternatives?: {
      product_id?: number;
      quantity: number;
    }[];
  }[];
}

function BomsForm({ toggleOpen, bom = null, onSuccess }: BomsFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>(bom?.items || []);
  const [outputProduct, setOutputProduct] = useState<Product | null>(bom?.output_product || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitItemForm, setSubmitItemForm] = useState(false);
  const [clearFormKey, setClearFormKey] = useState(0);

  const validationSchema = yup.object({
    output_product_id: yup.number().required("Output product is required"),
    output_quantity: yup.number().positive("Quantity is required").required("Quantity is required"),
    items: yup.array().min(1, "At least one input item is required").of(
      yup.object().shape({
        product_id: yup.number().required("Product is required"),
        quantity: yup.number().required("Quantity is required").positive("Quantity must be positive"),
        alternatives: yup.array().of(
          yup.object().shape({
            product_id: yup.number().required("Product is required"),
            quantity: yup.number().required("Quantity is required").positive("Quantity must be positive"),
          })
        ),
      })
    ),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BomsFormValues>({
    resolver: yupResolver(validationSchema as any),
    defaultValues: {
      output_product_id: bom?.output_product?.id || null,
      output_quantity: bom?.output_quantity || '',
      items: bom?.items || [],
    }
  });

  const addBomMutation = useMutation({
    mutationFn: bomsServices.add,
    onSuccess: (data) => {
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
    mutationFn: ({ id, bom }: { id: number, bom: BomsFormValues }) => bomsServices.update(id, bom),
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to update BOM', { variant: 'error' });
    }
  });

  const onSubmit = (data: BomsFormValues) => {
    if (items.length === 0) {
      setValue('items', [], { shouldValidate: true });
      return;
    }

    const payload: BomsFormValues = {
      ...data,
      items: items.map(item => ({
        ...item,
        product_id: item.product?.id || item.product_id,
        alternatives: item.alternatives?.map(alt => ({
          ...alt,
          product_id: alt.product?.id || alt.product_id
        }))
      })),
      output_product_id: outputProduct?.id || data.output_product_id
    };

    if (bom) {
      updateBomMutation.mutate({ id: bom.id, bom: payload });
    } else {
      addBomMutation.mutate(payload);
    }
  };

  return (
    <React.Fragment>
      <DialogTitle>
        <Typography variant="h4" textAlign="center" mb={2}>
          {!bom ? 'New Bill of Material' : `Edit ${bom.id}`}
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid size={{xs:12, md:8}}>
            <ProductSelect
              label="Output Product"
              value={outputProduct}
              onChange={(product: Product | null) => {
                setOutputProduct(product);
                setValue('output_product_id', product?.id);
              }}
              error={!!errors.output_product_id}
              helperText={errors.output_product_id?.message}
            />
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              type="number"
              {...register('output_quantity')}
              error={!!errors.output_quantity}
              helperText={errors.output_quantity?.message}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                step: 'any'
              }}
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
                submitMainForm={handleSubmit(onSubmit)}
                submitItemForm={submitItemForm}
                setSubmitItemForm={setSubmitItemForm}
              />
            ))}
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        {isSubmitting && <LinearProgress />}
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          onClick={() => toggleOpen(false)}
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
          {bom ? 'Update' : 'submit'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

export default BomsForm;
