import {
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { BOMItem } from '../../BomType';
import AlternativesRow from './AlternativesRow';

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

    const newAlternatives = [...alternatives, { ...newAlternative }];
    setAlternatives(newAlternatives);
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: newAlternatives } : prevItem
      )
    );

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
    const newAlternatives = alternatives.filter((_, i) => i !== altIndex);
    setAlternatives(newAlternatives);
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: newAlternatives } : prevItem
      )
    );

    if (editingIndex === altIndex) {
      setEditingIndex(null);
    }
  };

  const handleUpdateAlternative = (altIndex: number, updatedItem: BOMItem) => {
    if (!updatedItem.product || updatedItem.quantity === null || updatedItem.quantity <= 0) {
      setWarning('Please select a product and enter a valid quantity.');
      return;
    }

    if (updatedItem.product.id === item.product?.id) {
      setWarning(`⚠️ ${updatedItem.product.name} is already the main input product.`);
      return;
    }

    if (
      alternatives.some(
        (alt, index) => index !== altIndex && alt.product?.id === updatedItem.product?.id
      )
    ) {
      setWarning(`⚠️ ${updatedItem.product.name} has already been added as an alternative.`);
      return;
    }

    const updatedAlternatives = [...alternatives];
    updatedAlternatives[altIndex] = { ...updatedItem };
    setAlternatives(updatedAlternatives);
    setItems((prevItems) =>
      prevItems.map((prevItem, i) =>
        i === index ? { ...prevItem, alternatives: updatedAlternatives } : prevItem
      )
    );

    setEditingIndex(null);
    setWarning(null);
  };

  const handleStartEdit = (altIndex: number) => {
    setEditingIndex(altIndex);
    setWarning(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setWarning(null);
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

      {!isEditing && (
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

      {alternatives.length > 0 && (
        <Box>
          {alternatives.map((alternative, altIndex) => (
            <AlternativesRow
              key={altIndex}
              alternative={alternative}
              index={altIndex}
              onUpdate={(updatedItem) => handleUpdateAlternative(altIndex, updatedItem)}
              onRemove={() => handleRemoveAlternative(altIndex)}
              onStartEdit={() => handleStartEdit(altIndex)}
              onCancelEdit={handleCancelEdit}
              isEditing={editingIndex === altIndex}
              isDisabled={isEditing && editingIndex !== altIndex}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AlternativesForm;