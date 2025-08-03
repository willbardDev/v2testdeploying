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
  Typography 
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import ProductSelector from '@/components/productAndServices/products/ProductSelector';
import BomsFormRow from './BomsFormRow';
import { AddOutlined, HighlightOff } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import bomsServices from '../boms-services';
import BomsFormItem from './BomsItemForm';

interface BomsFormProps {
  toggleOpen: (open: boolean) => void;
  bom?: any;
}

interface BomsFormValues {
  output_product_id?: number;
  output_quantity: number;
  output_unit_id?: number;
  items: {
    product_id?: number;
    quantity: number;
    unit_id?: number;
  }[];
}

function BomsForm({ toggleOpen, bom = null }: BomsFormProps) {
  const { authOrganization } = useJumboAuth();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>(bom?.items || []);
  const [outputProduct, setOutputProduct] = useState<Product | null>(bom?.output_product || null);
  const [outputUnit, setOutputUnit] = useState<MeasurementUnit | null>(bom?.output_unit || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    output_product_id: yup.number().required("Output product is required"),
    output_quantity: yup.number().positive("Quantity is required").required("Quantity is required"),
    output_unit_id: yup.number().required("Unit is required"),
    items: yup.array().min(1, "At least one input item is required").of(
      yup.object().shape({
        product_id: yup.number().required("Product is required"),
        quantity: yup.number().required("Quantity is required").positive("Quantity must be positive"),
        unit_id: yup.number().required("Unit is required"),
      })
    ),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BomsFormValues>({
    resolver: yupResolver(validationSchema as any),
    defaultValues: {
      output_quantity: bom?.output_quantity || 1,
      items: bom?.items || [],
    }
  });

  const addBom = async (data: BomsFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await bomsServices.add({
        ...data,
        organization_id: authOrganization?.organization.id,
      });
      enqueueSnackbar(response.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toggleOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create BOM', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBom = async (data: BomsFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await bomsServices.update(bom.id, data);
      enqueueSnackbar(response.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toggleOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update BOM', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: BomsFormValues) => {
    const finalData = {
      ...data,
      output_product_id: outputProduct?.id,
      output_unit_id: outputUnit?.id,
      items: items.map(item => ({
        product_id: item.product?.id,
        quantity: item.quantity,
        unit_id: item.unit?.id,
      }))
    };
    
    if (bom) {
      updateBom(finalData);
    } else {
      addBom(finalData);
    }
  };

  return (
    <React.Fragment>
      <DialogTitle>
        <Typography variant="h4" textAlign="center" mb={2}>
          {bom ? 'Edit Bill of Material' : 'New Bill of Material'}
        </Typography>
        
        <Grid container spacing={2} mb={3}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Output Product
            </Typography>
            <Divider />
          </Grid>
          
          <Grid size= {{xs:12, md:6}}>
            <ProductSelector
              label="Output Product"
              value={outputProduct}
              onChange={(product) => {
                setOutputProduct(product);
                setValue('output_product_id', product?.id);
              }}
              error={!!errors.output_product_id}
              helperText={errors.output_product_id?.message}
            />
          </Grid>
          
         <Grid size= {{xs:6, md:3}}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              type="number"
              {...register('output_quantity')}
              error={!!errors.output_quantity}
              helperText={errors.output_quantity?.message}
            />
          </Grid>
          
          <Grid size= {{xs:6, md:3}}>
            <MeasurementUnitSelector
              label="Unit"
              value={outputUnit}
              onChange={(unit) => {
                setOutputUnit(unit);
                setValue('output_unit_id', unit?.id);
              }}
              error={!!errors.output_unit_id}
              helperText={errors.output_unit_id?.message}
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Input Products
            </Typography>
            <Divider />
          </Grid>
          
          <Grid size={12}>
            <BomsFormItem 
              setItems={setItems}
              items={items}
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
                item={item}
                index={index}
                items={items}
                setItems={setItems}
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
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {bom ? 'Update' : 'Create'} BOM
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

export default BomsForm;