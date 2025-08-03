import { 
  Grid, 
  IconButton, 
  Typography,
  Divider,
  Tooltip,
  TextField,
  Button
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material';
import React, { useState } from 'react';

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
      <Grid 
        container 
        spacing={2} 
        alignItems="center" 
        sx={{ 
          py: 1,
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        <Grid size={1}>
          <Typography variant="body2">{index + 1}.</Typography>
        </Grid>
        
        <Grid size={5}>
          <Typography>{item.product?.name || 'Unknown Product'}</Typography>
        </Grid>
        
        <Grid size={3}>
          <Typography>
            {item.quantity} {item.unit?.symbol || ''}
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
  const [unit, setUnit] = useState(item.unit);

  const handleSave = () => {
    onUpdate({ ...item, product, quantity, unit });
  };

  return (
    <Grid container spacing={2} alignItems="flex-end" mb={2} pt={1}>
      <Grid size= {{xs:12, md:5}}>
        <ProductSelector
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
        <MeasurementUnitSelector
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
  );
};

export default BomsFormRow;