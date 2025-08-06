import { 
  Grid, 
  TextField, 
  Button,
  Divider,
  Typography,
  LinearProgress,
  Box
} from '@mui/material';
import React, { useState } from 'react';
import { AddOutlined } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';

interface BomsFormItemProps {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  items: any[];
}

const BomsFormItem: React.FC<BomsFormItemProps> = ({ setItems, items }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>(''); // Changed to string and empty initial value
  const [isAdding, setIsAdding] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  const handleAddItem = () => {
  if (!product || !quantity) return;
  
  const newItem = {
    product_id: product.id, // Make sure this matches your form's expected structure
    quantity: Number(quantity),
    conversion_factor: 1 // Add if required
  };
  
  setItems(prev => [...prev, newItem]);
    
    // Reset form
    setProduct(null);
    setQuantity(''); // Reset to empty string
    setAlternatives([]);
    setShowAlternatives(false);
    
    setIsAdding(false);
  };

  const handleAddAlternative = () => {
    if (!product || !quantity) return;
    
    const newAlternative = {
      product,
      quantity: Number(quantity)
    };
    
    setAlternatives(prev => [...prev, newAlternative]);
    
    // Reset alternative fields
    setProduct(null);
    setQuantity(''); // Reset to empty string
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setQuantity(value);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="flex-end" mb={2}>
        <Grid size={12}>
          <Typography variant="subtitle1">Add Input Product</Typography>
          <Divider />
        </Grid>
        
        <Grid size={{xs: 12, md: 6}}>
          <ProductSelect
            label="Input Product"
            value={product}
            onChange={setProduct}
          />
        </Grid>
        
        <Grid size={{xs: 6, md: 4}}>
          <TextField
            label="Quantity"
            fullWidth
            size="small"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*\\.?[0-9]*'
            }}
          />
        </Grid>
        
        <Grid size={{xs: 6, md: 2}} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddItem}
            disabled={!product || !quantity || isAdding} // Added !quantity check
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

      <Box sx={{ mb: 2 }}>
        <Button
          size="small"
          onClick={() => setShowAlternatives(!showAlternatives)}
        >
          {showAlternatives ? 'Hide Alternatives' : 'Add Alternatives'}
        </Button>
      </Box>

      {showAlternatives && (
        <Box sx={{ pl: 4, borderLeft: '1px solid #eee', mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add Alternative Product
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{xs: 12, md: 6}}>
              <ProductSelect
                label="Alternative Product"
                value={product}
                onChange={setProduct}
              />
            </Grid>
            
            <Grid size={{xs: 6, md: 4}}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*\\.?[0-9]*'
                }}
              />
            </Grid>
            
            <Grid size={{xs: 6, md: 2}} textAlign="center">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddAlternative}
                disabled={!product || !quantity} // Added !quantity check
                startIcon={<AddOutlined />}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {alternatives.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Added Alternatives:
              </Typography>
              <ul>
                {alternatives.map((alt, index) => (
                  <li key={index}>
                    {alt.product?.name} - Qty: {alt.quantity}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BomsFormItem;