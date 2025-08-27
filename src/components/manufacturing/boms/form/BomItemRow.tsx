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
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close'
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

/**
 * ✅ Unified editor for BOM row (main or alternative).
 * Matches the behavior of AlternativeItemEditor for consistency.
 */
const BomsFormItemEditor: React.FC<{
  item: BOMItem;
  onUpdate: (item: BOMItem) => void;
  onCancel: () => void;
  isAlternative?: boolean;
  showAlternatives?: boolean;
  children?: React.ReactNode;
}> = ({ item, onUpdate, onCancel, isAlternative = false, showAlternatives = false, children }) => {
  const [product, setProduct] = React.useState<Product | null>(item.product ?? null);
  const [quantity, setQuantity] = React.useState<number | null>(item.quantity ?? null);
  const [selectedUnit, setSelectedUnit] = React.useState<number | null>(
    item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null
  );

  // Only reset state when the component first mounts or when explicitly needed
  React.useEffect(() => {
    setProduct(item.product ?? null);
    setQuantity(item.quantity ?? null);
    setSelectedUnit(item.measurement_unit_id ?? item.product?.primary_unit?.id ?? null);
  }, []);
  const combinedUnits: MeasurementUnit[] = React.useMemo(() => {
    const primary = product?.primary_unit ? [product.primary_unit] : [];
    const secondary = product?.secondary_units || [];
    return [...primary, ...secondary];
  }, [product]);

  const handleDone = React.useCallback(() => {
    if (!product || !quantity || quantity <= 0) {
      console.error('Please fill all required fields');
      return;
    }

    const selectedUnitData = combinedUnits.find(u => u.id === selectedUnit);

    onUpdate({
      ...item,
      product,
      product_id: product.id,
      quantity,
      measurement_unit_id: selectedUnit ?? item.measurement_unit_id,
      symbol: selectedUnitData?.unit_symbol ?? item.symbol,
      conversion_factor: selectedUnitData?.conversion_factor ?? item.conversion_factor ?? 1,
    });
  }, [product, quantity, selectedUnit, combinedUnits, onUpdate, item]);

  return (
    <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2, backgroundColor: 'white' }}>
      <Grid container spacing={2} alignItems="flex-end">
        {/* Product */}
        <Grid size={{xs:12, md:isAlternative ? 5 : 5.5}}>
          <ProductSelect
            label={isAlternative ? 'Alternative Product' : 'Input Product'}
            value={product}
            onChange={(newProduct:Product | null) => {
              setProduct(newProduct);
              const unitId = newProduct?.primary_unit?.id ?? newProduct?.measurement_unit?.id ?? null;
              setSelectedUnit(unitId);
            }}
          />
        </Grid>

        {/* Quantity + Unit */}
        <Grid size={{xs:12, md:isAlternative ? 3 : 4}}>
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
        {/* Actions */}
        <Grid size={{xs:12, md:isAlternative ? 2 : 2.5}}>
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Button variant="contained" size="small" onClick={handleDone} startIcon={<CheckOutlined />}>
              Done
            </Button>
            <IconButton
            size="small"
            onClick={onCancel}
            sx={{
              backgroundColor: green[500],    // green background
              color: '#fff',                   // white icon
              width: 32,                       // square width
              height: 32,                      // square height
              borderRadius: 1,                 // slightly rounded corners
              '&:hover': {
                backgroundColor: green[700],   // darker green on hover
              },
            }}
          >
           <CloseIcon fontSize="small" />
           </IconButton>
          </Box>
        </Grid>
      </Grid>

      {showAlternatives && children && <Box sx={{ mt: 2 }}>{children}</Box>}
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

  // Update alternatives when item changes
  React.useEffect(() => {
    setAlternatives(item.alternatives || []);
  }, [item.alternatives]);

  const handleRemove = React.useCallback(() => {
    setItems(items.filter((_, i) => i !== index));
  }, [items, setItems, index]);

  const handleUpdate = React.useCallback((updatedItem: BOMItem) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updatedItem, alternatives };
      return updated;
    });
    setIsEditingMain(false);
    setExpanded(true);
  }, [setItems, index, alternatives]);

  const handleUpdateAlternative = React.useCallback((updatedAlt: BOMItem, altIndex: number) => {
    const updatedAlternatives = [...alternatives];
    updatedAlternatives[altIndex] = updatedAlt;
    setAlternatives(updatedAlternatives);
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], alternatives: updatedAlternatives };
      return updated;
    });
    setEditingAlternativeIndex(null);
  }, [alternatives, setItems, index]);

  return (
    <>
      {isEditingMain ? (
        <BomsFormItemEditor
          item={item}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditingMain(false)}
          showAlternatives={true}
        >
          <Box sx={{ mt: 2 }}>
            {editingAlternativeIndex !== null && (
              <Box sx={{ mb: 2 }}>
                <BomsFormItemEditor
                  item={alternatives[editingAlternativeIndex]}
                  onUpdate={(updatedAlt) => handleUpdateAlternative(updatedAlt, editingAlternativeIndex)}
                  onCancel={() => setEditingAlternativeIndex(null)}
                  isAlternative={true}
                />
              </Box>
            )}
            <AlternativesForm
              item={item}
              alternatives={alternatives}
              setAlternatives={setAlternatives}
              onEditAlternative={setEditingAlternativeIndex}
            />
          </Box>
        </BomsFormItemEditor>
      ) : (
        <Accordion 
          expanded={expanded} 
          onChange={(_, exp) => setExpanded(exp)}
          sx={{ 
            mb: 1,
            '&.Mui-expanded': { margin: '8px 0' }
          }}
        >
          <AccordionSummary
            aria-controls={`bom-item-${index}-content`}
            id={`bom-item-${index}-header`}
            sx={{
              minHeight: '48px',
              py: 0,
              display: 'flex',
              alignItems: 'center',
              '& .MuiAccordionSummary-content': {
                m: 0,
                p: 0,
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {/* +/- box */}
            <Box
              sx={{
                width: 20,
                height: 20,
                border: '1px solid',
                borderColor: 'grey.500',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                flexShrink: 0,
                mr: 0.5,
              }}
            >
              {expanded ? '−' : '+'}
            </Box>

            {/* Product name */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                minWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                mr: 2,
              }}
            >
              {item.product?.name}
            </Typography>

            {/* Quantity + Unit */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                minWidth: 80, 
                flexShrink: 0, 
                mr: 18,
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {item.quantity}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.symbol || item.unit_symbol || item.measurement_unit?.symbol || ''}
              </Typography>
            </Box>
            
            {/* Action buttons - WRAPPED IN A DIV TO PREVENT NESTED BUTTONS */}
            <Box
              component="div" // Changed from span to div for better semantics
              onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when clicking buttons
              onFocus={(e) => e.stopPropagation()} // Also stop focus propagation
              sx={{
                display: 'flex',
                gap: 1,
                ml: 1,
              }}
            >
              <Tooltip title="Edit">
                {/* Use IconButton but prevent it from being a nested button */}
                <IconButton
                  aria-label="Edit item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingMain(true);
                    setExpanded(true);
                  }}
                  component="div" // Render as div instead of button
                  role="button" // Still maintain accessibility
                  tabIndex={0} // Make it focusable
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      setIsEditingMain(true);
                      setExpanded(true);
                    }
                  }}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  aria-label="Delete item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  component="div" // Render as div instead of button
                  role="button" // Still maintain accessibility
                  tabIndex={0} // Make it focusable
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleRemove();
                    }
                  }}
                >
                  <DeleteOutlined fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 1, pb: 2, borderTop: '1px solid #f0f0f0' }}>
            {editingAlternativeIndex !== null && (
              <Box sx={{ mb: 2 }}>
                <BomsFormItemEditor
                  item={alternatives[editingAlternativeIndex]}
                  onUpdate={(updatedAlt) => handleUpdateAlternative(updatedAlt, editingAlternativeIndex)}
                  onCancel={() => setEditingAlternativeIndex(null)}
                  isAlternative={true}
                />
              </Box>
            )}
            <AlternativesForm
              item={item}
              alternatives={alternatives}
              setAlternatives={setAlternatives}
              onEditAlternative={setEditingAlternativeIndex}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default BomItemRow;