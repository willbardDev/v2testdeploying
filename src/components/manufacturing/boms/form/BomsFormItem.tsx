import { 
  Grid, 
  IconButton, 
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
  const [quantity, setQuantity] = useState<number>(1);
  const [conversionFactor, setConversionFactor] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  const handleAddItem = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    const newItem = {
      product,
      quantity,
      conversion_factor: conversionFactor,
      alternatives: [...alternatives]
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Reset form
    setProduct(null);
    setQuantity(1);
    setConversionFactor(1);
    setAlternatives([]);
    setShowAlternatives(false);
    
    setIsAdding(false);
  };

  const handleAddAlternative = () => {
    if (!product) return;
    
    const newAlternative = {
      product,
      quantity,
      conversion_factor: conversionFactor
    };
    
    setAlternatives(prev => [...prev, newAlternative]);
    
    // Reset alternative fields
    setProduct(null);
    setQuantity(1);
    setConversionFactor(1);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="flex-end" mb={2}>
        <Grid size={12}>
          <Typography variant="subtitle1">Add Input Product</Typography>
          <Divider />
        </Grid>
        
        <Grid size={{xs:12, md:5}}>
          <ProductSelect
            label="Input Product"
            value={product}
            onChange={setProduct}
          />
        </Grid>
        
        <Grid size={{xs:6, md:3}}>
          <TextField
            label="Quantity"
            fullWidth
            size="small"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Grid>
        
        <Grid size={{xs:5, md:3}}>
          <TextField
            label="Conversion Factor"
            fullWidth
            size="small"
            type="number"
            value={conversionFactor}
            onChange={(e) => setConversionFactor(Number(e.target.value))}
          />
        </Grid>
        
        <Grid size={{xs:1, md:1}} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddItem}
            disabled={!product || isAdding}
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
            <Grid size={{xs:12, md:5}}>
              <ProductSelect
                label="Alternative Product"
                value={product}
                onChange={setProduct}
              />
            </Grid>
            
            <Grid size={{xs:6, md:3}}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Grid>
            
            <Grid size={{xs:5, md:3}}>
              <TextField
                label="Conversion Factor"
                fullWidth
                size="small"
                type="number"
                value={conversionFactor}
                onChange={(e) => setConversionFactor(Number(e.target.value))}
              />
            </Grid>
            
            <Grid size={{xs:1, md:1}} textAlign="center">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddAlternative}
                disabled={!product}
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
                    {alt.product?.name} - Qty: {alt.quantity}, Conv: {alt.conversion_factor}
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