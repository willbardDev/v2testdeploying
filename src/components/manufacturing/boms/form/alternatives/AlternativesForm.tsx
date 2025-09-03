// AlternativesForm.tsx
import {
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { AddOutlined, CheckOutlined, CancelOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { BOMItem } from '../../BomType';

interface AlternativesFormProps {
  item: BOMItem;
  alternatives: BOMItem[];
  setAlternatives: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  setItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  index: number;
  isEditing: boolean;
}

const AlternativesForm: React.FC<AlternativesFormProps> = ({
  item,
  alternatives,
  setAlternatives,
  setItems,
  index,
  isEditing,
}) => {
  const [newAlternative, setNewAlternative] = useState<BOMItem>({
    product_id: null,
    product: null,
    quantity: null,
    measurement_unit_id: null,
    conversion_factor: 1,
    symbol: '',
  });
  const [warning, setWarning] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<BOMItem | null>(null);

  const handleAddAlternative = () => {
    if (!newAlternative.product || newAlternative.quantity === null || newAlternative.quantity <= 0) {
      setWarning('Please select a product and enter a valid quantity.');
      return;
    }

    if (newAlternative.product.id === item.product?.id) {
      setWarning(`⚠️ ${newAlternative.product.name} is already the main input product.`);
      return;
    }

    if (alternatives.some((alt) => alt.product?.id === newAlternative.product?.id)) {
      setWarning(`⚠️ ${newAlternative.product.name} has already been added as an alternative.`);
      return;
    }

    // Update alternatives
    const newAlternatives = [...alternatives, { ...newAlternative }];
    setAlternatives(newAlternatives);

    // Update parent items state
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: newAlternatives } : prevItem
      )
    );

    // Reset form
    setNewAlternative({
      product_id: null,
      product: null,
      quantity: null,
      measurement_unit_id: null,
      conversion_factor: 1,
      symbol: '',
    });
    setSelectedUnit(null);
    setWarning(null);
  };

  const handleRemoveAlternative = (altIndex: number) => {
    // Update alternatives
    const newAlternatives = alternatives.filter((_, i) => i !== altIndex);
    setAlternatives(newAlternatives);

    // Update parent items state
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: newAlternatives } : prevItem
      )
    );

    if (editingIndex === altIndex) {
      setEditingIndex(null);
      setEditFormData(null);
    }
  };

  const handleUpdateAlternative = () => {
    if (editingIndex === null || !editFormData) return;

    if (!editFormData.product || editFormData.quantity === null || editFormData.quantity <= 0) {
      setWarning('Please select a product and enter a valid quantity.');
      return;
    }

    if (editFormData.product.id === item.product?.id) {
      setWarning(`⚠️ ${editFormData.product.name} is already the main input product.`);
      return;
    }

    if (
      alternatives.some(
        (alt, index) => index !== editingIndex && alt.product?.id === editFormData.product?.id
      )
    ) {
      setWarning(`⚠️ ${editFormData.product.name} has already been added as an alternative.`);
      return;
    }

    // Update alternatives
    const updatedAlternatives = [...alternatives];
    updatedAlternatives[editingIndex] = { ...editFormData };
    setAlternatives(updatedAlternatives);

    // Update parent items state
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: updatedAlternatives } : prevItem
      )
    );

    setEditingIndex(null);
    setEditFormData(null);
    setWarning(null);
  };

  const handleStartEdit = (index: number) => {
    const alternative = alternatives[index];
    setEditingIndex(index);
    setEditFormData({ ...alternative });
    setWarning(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditFormData(null);
    setWarning(null);
  };

  const handleEditFormChange = (field: keyof BOMItem, value: BOMItem[keyof BOMItem]) => {
    if (editFormData) {
      setEditFormData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleEditUnitChange = (product: Product | null) => {
    if (product && editFormData) {
      const unitId = product.primary_unit?.id ?? product.measurement_unit_id ?? null;
      const symbol = product.primary_unit?.unit_symbol ?? product.measurement_unit?.symbol ?? '';
      const conversionFactor = product.primary_unit?.conversion_factor ?? 1;

      setEditFormData((prev) => ({
        ...prev!,
        product,
        product_id: product.id,
        measurement_unit_id: unitId,
        symbol,
        conversion_factor: conversionFactor,
      }));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        Alternative Input Products
      </Typography>

      {warning && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {warning}
        </Alert>
      )}

      {editingIndex === null && (
        <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProductSelect
              key={newAlternative.product ? `alt-product-${newAlternative.product.id}` : 'alt-product-empty'}
              label="Alternative Input Product"
              defaultValue={newAlternative.product}
              onChange={(product: Product | null) => {
                if (product) {
                  const unitId = product.primary_unit?.id ?? product.measurement_unit_id ?? null;
                  const symbol = product.primary_unit?.unit_symbol ?? product.measurement_unit?.symbol ?? '';
                  const conversionFactor = product.primary_unit?.conversion_factor ?? 1;

                  setNewAlternative((prev) => ({
                    ...prev,
                    product,
                    product_id: product.id,
                    measurement_unit_id: unitId,
                    symbol,
                    conversion_factor: conversionFactor,
                  }));
                  setSelectedUnit(unitId);
                } else {
                  setNewAlternative({
                    product: null,
                    product_id: null,
                    quantity: null,
                    measurement_unit_id: null,
                    conversion_factor: 1,
                    symbol: '',
                  });
                  setSelectedUnit(null);
                }
                setWarning(null);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              type="number"
              value={newAlternative.quantity ?? ''}
              onChange={(e) =>
                setNewAlternative((prev) => ({
                  ...prev,
                  quantity: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              InputProps={{
                inputComponent: CommaSeparatedField,
                endAdornment: newAlternative.product ? (
                  <Box sx={{ minWidth: 80, ml: 1, display: 'inline-flex', alignItems: 'center' }}>
                    {newAlternative.symbol}
                  </Box>
                ) : null,
              }}
            />
          </Grid>
          <Grid size={12} container justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddOutlined />}
              onClick={handleAddAlternative}
              sx={{ mt: 1 }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      )}

      {editingIndex !== null && editFormData && (
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Editing Alternative
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductSelect
                label="Alternative Input Product"
                defaultValue={editFormData.product}
                onChange={(product: Product | null) => {
                  handleEditUnitChange(product);
                  setWarning(null);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                value={editFormData.quantity ?? ''}
                onChange={(e) =>
                  handleEditFormChange('quantity', e.target.value === '' ? null : Number(e.target.value))
                }
                InputProps={{
                  inputComponent: CommaSeparatedField,
                  endAdornment: editFormData.product ? (
                    <Box sx={{ minWidth: 80, ml: 1, display: 'inline-flex', alignItems: 'center' }}>
                      {editFormData.symbol}
                    </Box>
                  ) : null,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckOutlined />}
                  onClick={handleUpdateAlternative}
                >
                  Done
                </Button>
                <Tooltip title="Cancel">
                  <IconButton size="small" onClick={handleCancelEdit}>
                    <CancelOutlined fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {alternatives.length > 0 && (
        <Box>
          {alternatives.map((alternative, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'grey.50',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {alternative.product?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {alternative.quantity} {alternative.symbol}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleStartEdit(index)}
                    disabled={editingIndex !== null && editingIndex !== index}
                    sx={{ mr: 0.5 }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveAlternative(index)}
                    disabled={editingIndex !== null}
                  >
                    <DeleteOutlined fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AlternativesForm;