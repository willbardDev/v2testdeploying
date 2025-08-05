import { 
  Grid, 
  IconButton, 
  Typography,
  Divider,
  Tooltip,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { EditOutlined, DeleteOutlined, AddOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';

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
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleUpdate = (updatedItem: any) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    setIsEditing(false);
  };

  const handleAddAlternative = (alternative: any) => {
    const newItems = [...items];
    if (!newItems[index].alternatives) {
      newItems[index].alternatives = [];
    }
    newItems[index].alternatives.push(alternative);
    setItems(newItems);
  };

  if (isEditing) {
    return (
      <BomsFormItemEditor
        item={item}
        onUpdate={handleUpdate}
        onCancel={() => setIsEditing(false)}
        onAddAlternative={handleAddAlternative}
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
            <Typography variant="caption" color="text.secondary">
              Conversion: {item.conversion_factor || 1}
            </Typography>
          </Grid>
          
          <Grid size={3}>
            <Typography>
              {item.quantity}
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

          {item.alternatives?.length > 0 && (
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary">
                Alternatives:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                {item.alternatives.map((alt: any, altIndex: number) => (
                  <ListItem key={altIndex} sx={{ py: 0 }}>
                    <ListItemText
                      primary={`${alt.product?.name} - Qty: ${alt.quantity}`}
                      secondary={`Conversion: ${alt.conversion_factor || 1}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
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
  onAddAlternative: (alternative: any) => void;
}> = ({ item, onUpdate, onCancel, onAddAlternative }) => {
  const [product, setProduct] = useState(item.product);
  const [quantity, setQuantity] = useState(item.quantity);
  const [conversionFactor, setConversionFactor] = useState(item.conversion_factor || 1);
  const [showAltForm, setShowAltForm] = useState(false);
  const [altProduct, setAltProduct] = useState<any>(null);
  const [altQuantity, setAltQuantity] = useState(1);
  const [altConversion, setAltConversion] = useState(1);

  const handleSave = () => {
    onUpdate({ 
      ...item, 
      product, 
      quantity, 
      conversion_factor: conversionFactor,
      alternatives: item.alternatives || []
    });
  };

  const handleAddAlt = () => {
    if (!altProduct) return;
    
    onAddAlternative({
      product: altProduct,
      quantity: altQuantity,
      conversion_factor: altConversion
    });
    
    // Reset form
    setAltProduct(null);
    setAltQuantity(1);
    setAltConversion(1);
    setShowAltForm(false);
  };

  return (
    <Box sx={{ mb: 2, pt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'primary.main' }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid size={{xs:12, md:5}}>
          <ProductSelect
            label="Product"
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

        <Grid size={12}>
          <Button
            size="small"
            startIcon={<AddOutlined />}
            onClick={() => setShowAltForm(!showAltForm)}
          >
            {showAltForm ? 'Hide Alternative Form' : 'Add Alternative'}
          </Button>
        </Grid>

        {showAltForm && (
          <>
            <Grid size={{xs:12, md:5}}>
              <ProductSelect
                label="Alternative Product"
                value={altProduct}
                onChange={setAltProduct}
              />
            </Grid>
            
            <Grid size={{xs:6, md:3}}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                type="number"
                value={altQuantity}
                onChange={(e) => setAltQuantity(Number(e.target.value))}
              />
            </Grid>
            
            <Grid size={{xs:5, md:3}}>
              <TextField
                label="Conversion Factor"
                fullWidth
                size="small"
                type="number"
                value={altConversion}
                onChange={(e) => setAltConversion(Number(e.target.value))}
              />
            </Grid>
            
            <Grid size={{xs:1, md:1}}textAlign="center">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddAlt}
                disabled={!altProduct}
              >
                Add
              </Button>
            </Grid>
          </>
        )}

        {item.alternatives?.length > 0 && (
          <Grid size={12}>
            <Typography variant="subtitle2">Current Alternatives:</Typography>
            <List dense>
              {item.alternatives.map((alt: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${alt.product?.name} - Qty: ${alt.quantity}`}
                    secondary={`Conversion: ${alt.conversion_factor || 1}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BomsFormRow;