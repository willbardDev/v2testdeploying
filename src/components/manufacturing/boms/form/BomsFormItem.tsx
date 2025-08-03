import { 
  Grid, 
  IconButton, 
  TextField, 
  Button,
  Divider,
  Typography,
  LinearProgress
} from '@mui/material';
import React, { useState } from 'react';
import { AddOutlined } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import MeasurementSelector from '@/components/masters/measurementUnits/MeasurementSelector';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';

interface BomsFormItemProps {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  items: any[];
}

const BomsFormItem: React.FC<BomsFormItemProps> = ({ setItems, items }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<MeasurementUnit | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = () => {
    if (!product || !unit) return;
    
    setIsAdding(true);
    
    const newItem = {
      product,
      quantity,
      unit,
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Reset form
    setProduct(null);
    setQuantity(1);
    setUnit(null);
    
    setIsAdding(false);
  };

  return (
    <Grid container spacing={2} alignItems="flex-end" mb={2}>
      <Grid size={12}>
        <Typography variant="subtitle1">Add Input Product</Typography>
        <Divider />
      </Grid>
      
      <Grid size= {{xs:12, md:5}}>
        <ProductSelect
          label="Input Product"
          value={product}
          onChange={setProduct}
        />
      </Grid>
      
      <Grid size= {{xs:6, md:3}}>
        <TextField
          label="Quantity"
          fullWidth
          size="small"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </Grid>
      
      <Grid size= {{xs:5, md:3}}>
        <MeasurementSelector
          label="Unit"
          value={unit}
          onChange={setUnit}
        />
      </Grid>
      
      <Grid size= {{xs:1, md:1}}textAlign="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddItem}
          disabled={!product || !unit || isAdding}
          startIcon={<AddOutlined />}
        >
          Add
        </Button>
      </Grid>
      
      {isAdding && (
        <Grid size={12}>
          <LinearProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default BomsFormItem;