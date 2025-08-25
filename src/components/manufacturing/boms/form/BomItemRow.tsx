import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Tooltip,
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import AlternativesForm from '../alternatives/AlternativesForm';
import { BOMItem } from '../BomType';

export interface BomFormRowProps {
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

const BomsFormItemEditor: React.FC<{
  item: BOMItem;
  onUpdate: (item: BOMItem) => void;
  onCancel: () => void;
  isAlternative?: boolean;
}> = ({ 
  item, 
  onUpdate, 
  onCancel,
  isAlternative = false
}) => {
  const [product, setProduct] = React.useState<Product | null>(item.product ?? null);
  const [quantity, setQuantity] = React.useState<number | null>(item.quantity ?? null);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit ?? item.product?.primary_unit?.id ?? null
  );

  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : [])
  ];

  const handleDone = () => {
    const selectedUnitData = combinedUnits.find((u) => u.id === selectedUnit);
    
    if (!selectedUnitData) {
      console.error('Selected unit data not found');
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

  const onProductChange = ({
    product: newProduct,
    measurement_unit_id,
    measurement_unit,
    conversion_factor
  }: {
    product: Product | null;
    measurement_unit_id: number | null;
    measurement_unit: { id: number; symbol: string; name: string } | null;
    conversion_factor: number;
  }) => {
    setProduct(newProduct);
    setSelectedUnit(measurement_unit_id);
    // Optionally update parent state immediately if needed
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid size={{ xs: 12, md: isAlternative ? 6 : 5.5 }}>
          <ProductSelect
            key={`product-select-${item.product?.id || 'empty'}`}
            label={isAlternative ? "Alternative Product" : "Input Product"}
            value={product}
            onChange={(newProduct: Product | null) => {
              if (newProduct) {
                const primaryUnit = newProduct.primary_unit;
                const defaultUnit = primaryUnit ?? (newProduct.measurement_unit ? {
                  id: newProduct.measurement_unit.id,
                  symbol: newProduct.measurement_unit.unit_symbol,
                  name: newProduct.measurement_unit.name,
                } : null);

                const unitId = defaultUnit?.id ?? null;
                const conversionFactor = primaryUnit?.conversion_factor ?? 1;

                setProduct(newProduct);
                setSelectedUnit(unitId);

                onProductChange({
                  product: newProduct,
                  measurement_unit_id: unitId,
                  measurement_unit: defaultUnit
                    ? { id: defaultUnit.id, symbol: defaultUnit.symbol, name: defaultUnit.name ?? '' }
                    : null,
                  conversion_factor: conversionFactor,
                });
              } else {
                setProduct(null);
                setSelectedUnit(null);

                onProductChange({
                  product: null,
                  measurement_unit_id: null,
                  measurement_unit: null,
                  conversion_factor: 1,
                });
              }
            }}
            sx={{
              '& .MuiInputBase-root': { 
                paddingRight: '8px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: isAlternative ? 4 : 4 }}>
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
        <Grid size={{ xs: 12, md: isAlternative ? 2 : 2 }}>
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

const BomItemRow: React.FC<BomFormRowProps> = ({
  item,
  index,
  items,
  setItems,
}) => {
  const [isEditingMain, setIsEditingMain] = React.useState(false);
  const [editingAlternativeIndex, setEditingAlternativeIndex] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [alternatives, setAlternatives] = React.useState<BOMItem[]>(item.alternatives || []);

  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (updatedItem: BOMItem) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updatedItem, alternatives };
      return updated;
    });
    setIsEditingMain(false);
    setExpanded(true); // Keep accordion expanded to show alternatives
  };

  const handleUpdateAlternative = (updatedAlt: BOMItem, altIndex: number) => {
    const updatedAlternatives = [...alternatives];
    updatedAlternatives[altIndex] = updatedAlt;
    setAlternatives(updatedAlternatives);
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], alternatives: updatedAlternatives };
      return updated;
    });
    setEditingAlternativeIndex(null);
  };

  const handleAddAlternative = (newAlternative: BOMItem) => {
    const updatedAlternatives = [...alternatives, newAlternative];
    setAlternatives(updatedAlternatives);
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], alternatives: updatedAlternatives };
      return updated;
    });
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
        aria-controls={`bom-item-${index}-content`}
        id={`bom-item-${index}-header`}
        sx={{
          minHeight: '48px',
          py: 0,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 15,
            m: 0,
          },
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            minWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {item.product?.name}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 0.5,
          minWidth: 80,
          flexShrink: 0,
        }}>
          <Typography variant="body2" fontWeight="medium">
            {item.quantity}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {item.unit_symbol}
          </Typography>
        </Box>

        <Box 
          onClick={(e) => e.stopPropagation()} 
          sx={{ 
            display: 'flex', 
            gap: 1,
            ml: 1
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              aria-label="Edit item"
              onClick={() => {
                setIsEditingMain(true);
                setExpanded(true);
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
              aria-label="Delete item"
              onClick={handleRemove}
              sx={{
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <DeleteOutlined fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 1, pb: 2, borderTop: '1px solid #f0f0f0' }}>
        {(isEditingMain || editingAlternativeIndex !== null) && (
          <Box sx={{ mb: 2 }}>
            {isEditingMain && (
              <BomsFormItemEditor
                item={item}
                onUpdate={handleUpdate}
                onCancel={() => setIsEditingMain(false)}
                key={`main-edit-${item.product?.id || 'new'}`}
              />
            )}
            {editingAlternativeIndex !== null && (
              <BomsFormItemEditor
                item={alternatives[editingAlternativeIndex]}
                onUpdate={(updatedAlt) => handleUpdateAlternative(updatedAlt, editingAlternativeIndex)}
                onCancel={() => setEditingAlternativeIndex(null)}
                isAlternative={true}
                key={`alt-edit-${editingAlternativeIndex}-${alternatives[editingAlternativeIndex]?.product?.id || 'new'}`}
              />
            )}
          </Box>
        )}
        <AlternativesForm
          item={item}
          alternatives={alternatives}
          setAlternatives={setAlternatives}
          onEditAlternative={setEditingAlternativeIndex}
          onAddAlternative={handleAddAlternative}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default BomItemRow;