import * as React from 'react';
import {
  Typography,
  IconButton,
  Box,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined
} from '@mui/icons-material';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import { BOMItem } from '../BomType';

interface AlternativeRowProps {
  alternative: BOMItem;
  index: number;
  onEdit: (updatedItem: BOMItem) => void;
  onRemove: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

// Internal editor component for AlternativeRow
const AlternativeItemEditor: React.FC<{
  item: BOMItem;
  onUpdate: (item: BOMItem) => void;
  onCancel: () => void;
}> = ({ 
  item, 
  onUpdate, 
  onCancel
}) => {
  const [product, setProduct] = React.useState<Product | null>(item.product ?? null);
  const [quantity, setQuantity] = React.useState<number | null>(item.quantity ?? null);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null
  );

  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : [])
  ];

  const handleDone = () => {
    const selectedUnitData = combinedUnits.find((u) => u.id === selectedUnit);
    
    if (!product || quantity === null || quantity <= 0) {
      console.error('Please fill all required fields');
      return;
    }

    onUpdate({
      ...item,
      product,
      quantity,
      measurement_unit_id: selectedUnit !== null ? selectedUnit : item.measurement_unit_id,
      unit_symbol: selectedUnitData?.unit_symbol ?? item.unit_symbol,
      conversion_factor: selectedUnitData?.conversion_factor ?? item.conversion_factor ?? 1
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid size={{xs: 12, md: 6}}>
          <ProductSelect
            key={`alt-product-select-${item.product?.id || 'empty'}`}
            label="Alternative Product"
            value={product}
            onChange={(newProduct: Product | null) => {
              setProduct(newProduct);
              if (newProduct) {
                const unitId = newProduct.primary_unit?.id ?? newProduct.measurement_unit_id;
                setSelectedUnit(unitId);
              } else {
                setSelectedUnit(null);
              }
            }}
          />
        </Grid>

        <Grid size={{xs: 12, md: 4}}>
          <TextField
            label="Quantity"
            size="small"
            fullWidth
            type="number"
            value={quantity ?? ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{
              inputComponent: CommaSeparatedField,
              endAdornment: product && selectedUnit ? (
                <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                  <Select
                    value={selectedUnit ?? ''}
                    onChange={(e) => {
                      const unitId = e.target.value as number;
                      setSelectedUnit(unitId);
                    }}
                  >
                    {combinedUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.unit_symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null,
            }}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />
        </Grid>
        <Grid size={{xs: 12, md: 2}}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleDone}
              startIcon={<CheckOutlined />}
            >
              Done
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const AlternativeRow: React.FC<AlternativeRowProps> = ({
  alternative,
  index,
  onEdit,
  onRemove,
  isEditing = false,
  onCancelEdit = () => {}
}) => {
  const [localIsEditing, setLocalIsEditing] = React.useState(false);

  // Sync with parent editing state
  React.useEffect(() => {
    if (isEditing !== undefined) {
      setLocalIsEditing(isEditing);
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setLocalIsEditing(true);
  };

  const handleUpdate = (updatedItem: BOMItem) => {
    onEdit(updatedItem);
    setLocalIsEditing(false);
  };

  const handleCancel = () => {
    setLocalIsEditing(false);
    onCancelEdit();
  };

  // Display mode
  if (!localIsEditing) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          bgcolor: 'action.hover',
          borderRadius: 1
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            minWidth: 24,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          {index + 1}.
        </Typography>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 22
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              minWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              mr: 2
            }}
          >
            {alternative.product?.name}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5,
            minWidth: 60
          }}>
            <Typography variant="body2">
              {alternative.quantity}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {alternative.unit_symbol}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            <IconButton
              size="small"
              onClick={handleEditClick}
              color="primary"
            >
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onRemove}
              color="error"
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }

  // Edit mode
  return (
    <Box
    sx={{
        p: 2,
        bgcolor: 'transparent',  // 👈 no fill background
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'primary.main',
    }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 2, 
          fontWeight: 500, 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <CheckOutlined fontSize="small" />
        Editing Alternative #{index + 1}
      </Typography>
      
      <AlternativeItemEditor
        item={alternative}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default AlternativeRow;