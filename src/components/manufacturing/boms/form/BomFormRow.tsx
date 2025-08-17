import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Box,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Stack
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  AddOutlined
} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';

interface BOMItem {
  product?: Product | null;
  product_id?: number;
  quantity: number | null;
  measurement_unit_id?: number | null;
  unit_symbol?: string | null;
  conversion_factor?: number | null;
  alternatives?: BOMItem[];
}

interface BomsFormRowProps {
  item: BOMItem;
  index: number;
  items: BOMItem[];
  setItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  setClearFormKey?: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm?: () => void;
  submitItemForm?: boolean;
  setSubmitItemForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BomsFormRow: React.FC<BomsFormRowProps> = ({
  item,
  index,
  items,
  setItems,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null
  );
  const [alternatives, setAlternatives] = React.useState<BOMItem[]>(item.alternatives || []);
  const [newAlternative, setNewAlternative] = React.useState<BOMItem>({
    product: null,
    quantity: null,
    measurement_unit_id: null,
    unit_symbol: null,
    conversion_factor: 1
  });

  const combinedUnits: MeasurementUnit[] = [
    ...(item.product?.secondary_units || []),
    ...(item.product?.primary_unit ? [item.product.primary_unit] : [])
  ];

  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (updatedItem: BOMItem) => {
    const updated = [...items];
    updated[index] = {
      ...updatedItem,
      alternatives: alternatives
    };
    setItems(updated);
    setIsEditing(false);
    setExpanded(false);
  };

  const handleAddAlternative = () => {
    if (newAlternative.product && newAlternative.quantity !== null && newAlternative.quantity > 0) {
      const updatedAlternative = {
        ...newAlternative,
        measurement_unit_id: newAlternative.product.primary_unit?.id ?? newAlternative.product.measurement_unit_id,
        unit_symbol: newAlternative.product.primary_unit?.unit_symbol ?? newAlternative.product.measurement_unit?.unit_symbol,
        conversion_factor: newAlternative.product.primary_unit?.conversion_factor ?? 1
      };
      
      setAlternatives(prev => [...prev, updatedAlternative]);
      setNewAlternative({
        product: null,
        quantity: 0,
        measurement_unit_id: null,
        unit_symbol: null,
        conversion_factor: 1
      });
    }
  };

  const handleRemoveAlternative = (altIndex: number) => {
    setAlternatives(prev => prev.filter((_, i) => i !== altIndex));
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={(_, exp) => setExpanded(exp)}
      sx={{ 
        mb: 1,
        '&.Mui-expanded': {
          margin: '8px 0'
        }
      }}
    >
      <AccordionSummary
  expandIcon={<ArrowDropDownIcon />}
  sx={{
    minHeight: '48px',
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12// Added gap between elements
    }
  }}
>
 <Box 
  sx={{ 
    display: 'flex',
    alignItems: 'center',
    gap: 1,  // Adjust this for spacing between product name and quantity-unit group
    p: 1,
    borderRadius: 1,
    width: '100%'
  }}
>
  {/* Product Name */}
  <Typography 
    variant="body2" 
    sx={{ 
      fontWeight: 500,
      minWidth: 120,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flex: 1
    }}
  >
    {item.product?.name || 'No product selected'}
  </Typography>

  {/* Quantity and Unit (grouped together) */}
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    gap: 0.5,
    minWidth: 80
  }}>
    <Typography variant="body2">
      {item.quantity}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {item.unit_symbol || 'Pcs'}
    </Typography>
  </Box>
</Box>
  {/* Actions */}
  <Box onClick={(e) => e.stopPropagation()} sx={{ 
    display: 'flex', 
    gap: 1,
    ml: 1
  }}>
    <Tooltip title="Edit">
  <IconButton 
    size="small"
    onClick={() => {
      setIsEditing(true);
      setExpanded(true);   // <-- force accordion open when editing
    }}
    sx={{
      '&:hover': { 
        backgroundColor: 'primary.light',
        color: 'primary.main'
      }
    }}
  >
    <EditOutlined fontSize="small" />
  </IconButton>
</Tooltip>

    <Tooltip title="Delete">
      <IconButton 
        size="small"
        onClick={handleRemove}
        sx={{
          border: '1px solid',
          borderColor: 'error.main',
          color: 'error.main',
          '&:hover': { 
            backgroundColor: 'error.light',
          }
        }}
      >
        <DeleteOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
</AccordionSummary>

      <AccordionDetails sx={{ pt: 1, pb: 2, borderTop: '1px solid #f0f0f0' }}>
        {isEditing ? (
          <BomsFormItemEditor
            item={item}
            onUpdate={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Alternative Input Products
            </Typography>
            
            <Grid container spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <ProductSelect
                  label="Product"
                  value={newAlternative.product}
                  onChange={(product: Product | null) => {
                    setNewAlternative(prev => ({
                      ...prev,
                      product,
                      measurement_unit_id: product?.primary_unit?.id ?? product?.measurement_unit_id ?? null,
                      unit_symbol: product?.primary_unit?.unit_symbol ?? product?.measurement_unit?.unit_symbol ?? null,
                      conversion_factor: product?.primary_unit?.conversion_factor ?? 1
                    }));
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Quantity"
                  fullWidth
                  size="small"
                  type="number"
                  value={newAlternative.quantity}
                  onChange={(e) =>
                    setNewAlternative((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value)
                    }))
                  }
                  InputProps={{
                    inputComponent: CommaSeparatedField,
                    endAdornment:
                      newAlternative.product && selectedUnit ? (
                        <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                          <Select
                            value={selectedUnit}
                            onChange={(e) => {
                              const unitId = e.target.value as number;
                              setSelectedUnit(unitId);
                              const unit = combinedUnits.find((u) => u.id === unitId);
                              if (unit) {
                                setNewAlternative((prev) => ({
                                  ...prev,
                                  measurement_unit_id: unit.id,
                                  unit_symbol: unit.unit_symbol,
                                  conversion_factor: unit.conversion_factor ?? 1
                                }));
                              }
                            }}
                          >
                            {combinedUnits.map((unit) => (
                              <MenuItem key={unit.id} value={unit.id}>
                                {unit.unit_symbol}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : null
                  }}
                />

              </Grid>
            <Grid size={{xs:12, md:12}} container justifyContent="flex-end">
              {/* Add Alternative Button */}
              <Button
                variant="contained"
                size="small"
                startIcon={<AddOutlined />}
                onClick={handleAddAlternative}
              >
                Add
              </Button>
            </Grid>
            </Grid>

            {alternatives.length > 0 && (
              <Stack spacing={1}>
                {alternatives.map((alt, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 22, flex: 1 }}>
                    <Typography variant="body2">{alt.product?.name}</Typography>
                    <Typography variant="body2"></Typography>
                    <Typography variant="body2">
                      {alt.quantity} {alt.unit_symbol}
                    </Typography>
                  </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAlternative(idx)}
                      color="error"
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const BomsFormItemEditor: React.FC<{
  item: BOMItem;
  onUpdate: (item: BOMItem) => void;
  onCancel: () => void;
}> = ({ item, onUpdate, onCancel }) => {
  const [product, setProduct] = React.useState<Product | null>(item.product ?? null);
  const [quantity, setQuantity] = React.useState<number | null>(item.quantity);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null
  );

  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : [])
  ];

  const handleDone = () => {
    const selectedUnitData = combinedUnits.find((u) => u.id === selectedUnit);
    onUpdate({
      ...item,
      product,
      quantity,
      measurement_unit_id: selectedUnit ?? undefined,
      unit_symbol: selectedUnitData?.unit_symbol ?? item.unit_symbol,
      conversion_factor: selectedUnitData?.conversion_factor ?? item.conversion_factor ?? 1
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="flex-end">
       <Grid size={{ xs: 12, md: 5.5 }}>
          <ProductSelect
            label="Product"
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

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Quantity"
            fullWidth
            size="small"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{
              inputComponent: CommaSeparatedField,
              inputProps: { min: 0.01, step: "any" }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleDone}
              startIcon={<CheckOutlined />}
              fullWidth
            >
              Done
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BomsFormRow;