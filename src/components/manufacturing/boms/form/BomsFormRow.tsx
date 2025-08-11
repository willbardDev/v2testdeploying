import { 
  Grid, 
  IconButton, 
  Typography,
  Divider,
  Tooltip,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';

interface BomsFormRowProps {
  item: any;
  index: number;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const BomsFormRow: React.FC<BomsFormRowProps> = ({ 
  item, 
  index, 
  items, 
  setItems 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleUpdate = (updatedItem: any) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <BomsFormItemEditor
        item={item}
        onUpdate={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <Box sx={{ py: 1, '&:hover': { backgroundColor: 'action.hover' } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={1}>
            <Typography variant="body2">{index + 1}.</Typography>
          </Grid>
          
          <Grid size={5}>
            <Typography>{item.product?.name || 'Unknown Product'}</Typography>
          </Grid>
          
          <Grid size={3}>
            <Typography>
              {item.quantity} {item.unit_symbol || ''}
            </Typography>
          </Grid>
          
          <Grid size={3} textAlign="right">
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleRemove} color="error">
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </>
  );
};

// Helper component for inline editing
const BomsFormItemEditor: React.FC<{ 
  item: any; 
  onUpdate: (item: any) => void; 
  onCancel: () => void;
}> = ({ item, onUpdate, onCancel }) => {
  const [product, setProduct] = useState(item.product);
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedUnit, setSelectedUnit] = useState(item.measurement_unit_id);
  
  // Get combined units (primary + secondary)
  const combinedUnits = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : []),
  ];

  const handleSave = () => {
    const selectedUnitData = combinedUnits.find(u => u.id === selectedUnit);
    onUpdate({ 
      ...item, 
      product,
      quantity,
      measurement_unit_id: selectedUnit,
      unit_symbol: selectedUnitData?.unit_symbol,
      conversion_factor: selectedUnitData?.conversion_factor ?? 1
    });
  };

  return (
    <Box sx={{ mb: 2, pt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'primary.main' }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid  size={{xs:12, md:5}}>
        <ProductSelect
          label="Product"
          value={product}
          onChange={(newProduct: Product | null) => {
            setProduct(newProduct);
            if (newProduct) {
              // Reset to primary unit when product changes
              setSelectedUnit(newProduct.primary_unit?.id);
            }
          }}
        />
        </Grid>
        
       <Grid  size={{xs:6, md:3}}>
          <TextField
            label="Quantity"
            fullWidth
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{
              inputComponent: CommaSeparatedField
            }}
          />
        </Grid>

        <Grid  size={{xs:6, md:3}}>
          <FormControl fullWidth size="small">
            <Select
              value={selectedUnit || ''}
              onChange={(e) => setSelectedUnit(e.target.value as number)}
              variant="standard"
              displayEmpty
            >
              {combinedUnits.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.unit_symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid  size={{xs:12, md:1}} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={onCancel}
            sx={{ mt: 1 }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BomsFormRow;