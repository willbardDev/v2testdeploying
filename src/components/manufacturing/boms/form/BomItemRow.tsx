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
    item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null
  );

  const combinedUnits: MeasurementUnit[] = [
    ...(product?.secondary_units || []),
    ...(product?.primary_unit ? [product.primary_unit] : [])
  ];

  const handleDone = () => {
    const selectedUnitData = combinedUnits.find((u) => u.id === selectedUnit);
    
    // Make sure selectedUnitData exists before accessing its properties
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

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid size={{xs: 12, md: isAlternative ? 6 : 5.5}}>
          <ProductSelect
            key={`product-select-${item.product?.id || 'empty'}`}
            label={isAlternative ? "Alternative Product" : "Input Product"}
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

        <Grid size={{xs: 12, md: isAlternative ? 4 : 4}}>
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
        <Grid size={{xs: 12, md: isAlternative ? 2 : 2}}>
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

  const combinedUnits: MeasurementUnit[] = [
    ...(item.product?.secondary_units || []),
    ...(item.product?.primary_unit ? [item.product.primary_unit] : [])
  ];

  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (updatedItem: BOMItem) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updatedItem, alternatives: prev[index].alternatives };
      return updated;
    });
    setIsEditingMain(false);
    setExpanded(false);
  };

  React.useEffect(() => {
    setItems(prevItems => {
      const updated = [...prevItems];
      updated[index] = {
        ...updated[index],
        alternatives,
      };
      return updated;
    });
  }, [alternatives, index, setItems]);

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
  expandIcon={false} // disable default right expand icon
  sx={{
    minHeight: '48px',
    '& .MuiAccordionSummary-content': {
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 0.5,
    },
  }}
>
  {/* Custom expand box aligned to start */}
  <Box
    sx={{
      width: 20,
      height: 20,
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 'bold',
      color: 'primary.main',
      bgcolor: expanded ? 'primary.main' : 'transparent',
      ...(expanded && { color: 'white' }),
    }}
  >
    {expanded ? '-' : '+'}
  </Box>

        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'start',
            gap: 1,
            p: 1,
            borderRadius: 1,
            width: '100%'
          }}
        >
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
            {item.product?.name}
          </Typography>

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
              {item.unit_symbol}
            </Typography>
          </Box>
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
            <Box
              onClick={() => {
                setIsEditingMain(true);
                setExpanded(true);
              }}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                '&:hover': { 
                  backgroundColor: 'primary.light',
                  color: 'primary.main'
                }
              }}
            >
              <EditOutlined fontSize="small" />
            </Box>
          </Tooltip>

          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              p: 0.5,
              borderRadius: '50%',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <DeleteOutlined fontSize="small" color="error" />
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 1, pb: 2, borderTop: '1px solid #f0f0f0' }}>
  {isEditingMain ? (
    <BomsFormItemEditor
      item={item}
      onUpdate={handleUpdate}
      onCancel={() => setIsEditingMain(false)}
      key={`main-edit-${item.product?.id || 'new'}`}
    />
  ) : editingAlternativeIndex !== null ? (
    <BomsFormItemEditor
      item={alternatives[editingAlternativeIndex]}
      onUpdate={(updatedAlt) => {
        const updatedAlternatives = [...alternatives];
        updatedAlternatives[editingAlternativeIndex] = updatedAlt;
        setAlternatives(updatedAlternatives);
        setEditingAlternativeIndex(null);
      }}
      onCancel={() => setEditingAlternativeIndex(null)}
      isAlternative={true}
      key={`alt-edit-${editingAlternativeIndex}-${alternatives[editingAlternativeIndex]?.product?.id || 'new'}`}
    />
  ) : (
    <AlternativesForm
      item={item}
      alternatives={alternatives}
      setAlternatives={setAlternatives}
      onEditAlternative={setEditingAlternativeIndex}
    />
  )}
</AccordionDetails>
    </Accordion>
  );
};

export default BomItemRow;