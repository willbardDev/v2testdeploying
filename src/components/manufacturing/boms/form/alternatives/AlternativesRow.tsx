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
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import { BOMItem } from '../../BomType';

interface AlternativeRowProps {
  alternative: BOMItem;
  index: number;
  onEdit: (updatedItem: BOMItem) => void;
  onRemove: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

// Helper function to get combined units from a product
const getCombinedUnits = (product: Product | null): MeasurementUnit[] => {
  if (!product) return [];
  const primary = product.primary_unit ? [product.primary_unit] : [];
  const secondary = product.secondary_units || [];
  return [...primary, ...secondary];
};

export const AlternativeItemEditor: React.FC<{
  item: BOMItem;
  onUpdate: (item: BOMItem) => void;
  onCancel: () => void;
}> = ({ item, onUpdate, onCancel }) => {
  const [product, setProduct] = React.useState<Product | null>(item.product ?? null);
  const [quantity, setQuantity] = React.useState<number | null>(item.quantity ?? null);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit_id ?? item.measurement_unit?.id ?? null
  );

  const combinedUnits = React.useMemo(() => getCombinedUnits(product), [product]);

  // Reset state when item changes
  React.useEffect(() => {
    setProduct(item.product ?? null);
    setQuantity(item.quantity ?? null);
    setSelectedUnit(item.measurement_unit_id ?? item.measurement_unit?.id ?? null);
  }, [item]);

  const handleDone = () => {
    if (!product || quantity === null || quantity <= 0) return;

    const selectedUnitData = combinedUnits.find((u) => u.id === selectedUnit);
    const currentSymbol = selectedUnitData?.unit_symbol || item.symbol || '';

    onUpdate({
      ...item,
      product,
      quantity,
      measurement_unit_id: selectedUnit ?? item.measurement_unit_id,
      measurement_unit: selectedUnitData ? {
        id: selectedUnitData.id,
        name: selectedUnitData.name || '',
        symbol: selectedUnitData.unit_symbol || '',
        conversion_factor: selectedUnitData.conversion_factor ?? 1
      } : item.measurement_unit,
      symbol: currentSymbol,
      conversion_factor: selectedUnitData?.conversion_factor ?? item.conversion_factor ?? 1
    });
  };

  return (
    <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2, backgroundColor: 'white' }}>
      <Grid container spacing={2} alignItems="flex-end">
        {/* Product */}
        <Grid size={{xs:12, md:5}}>
          <ProductSelect
            label="Alternative Product"
            value={product}
            onChange={(newProduct: Product | null) => {
              setProduct(newProduct);
              // Set default unit when product changes
              if (newProduct) {
                const defaultUnitId = newProduct.primary_unit?.id ?? newProduct.measurement_unit_id;
                setSelectedUnit(defaultUnitId);
              } else {
                setSelectedUnit(null);
              }
            }}
          />
        </Grid>

        {/* Quantity + Unit */}
        <Grid size={{xs:12, md:3}}>
          <TextField
            label="Quantity"
            size="small"
            fullWidth
            type="number"
            value={quantity ?? ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{
              inputComponent: CommaSeparatedField as any,
              endAdornment: product && selectedUnit ? (
                <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                  <Select
                    value={selectedUnit ?? ''}
                    onChange={(e) => setSelectedUnit(Number(e.target.value))}
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
          />
        </Grid>

        {/* Display current symbol if available */}
        {item.symbol && (
          <Grid size={{xs:12, md:2}}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Current: {item.symbol}
            </Typography>
          </Grid>
        )}

        {/* Actions */}
        <Grid size={{xs:12, md:2}}>
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleDone}
              disabled={!product || !quantity || quantity <= 0}
              startIcon={<CheckOutlined />}
            >
              Done
            </Button>
            <IconButton
              size="small"
              onClick={onCancel}
              sx={{
                backgroundColor: 'error.main',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const AlternativesRow: React.FC<AlternativeRowProps> = ({
  alternative,
  index,
  onEdit,
  onRemove,
  isEditing = false,
  onCancelEdit = () => {}
}) => {
  const [localIsEditing, setLocalIsEditing] = React.useState(false);

  React.useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);

  const handleEditClick = () => setLocalIsEditing(true);

  const handleUpdate = (updatedItem: BOMItem) => {
    onEdit(updatedItem);
    setLocalIsEditing(false);
  };

  const handleCancel = () => {
    setLocalIsEditing(false);
    onCancelEdit();
  };

  if (localIsEditing) {
    return (
      <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
        <AlternativeItemEditor item={alternative} onUpdate={handleUpdate} onCancel={handleCancel} />
      </Box>
    );
  }

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
        sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center', color: 'text.secondary' }}
      >
        {index + 1}.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 22 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, mr: 2 }}>
          {alternative.product?.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
          <Typography variant="body2">{alternative.quantity}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{alternative.symbol || alternative.symbol || alternative.measurement_unit?.symbol || ''}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          <IconButton size="small" onClick={handleEditClick} color="primary">
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onRemove} color="error">
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AlternativesRow;