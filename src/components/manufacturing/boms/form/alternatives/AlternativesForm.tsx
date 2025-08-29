import * as React from 'react';
import {
  Typography,
  Box,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Stack
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Product } from '@/components/productAndServices/products/ProductType';
import { BOMItem } from '../../BomType';
import AlternativesRow from './AlternativesRow';

    interface AlternativesFormProps {
      item: BOMItem;
      alternatives: BOMItem[];
      setAlternatives: React.Dispatch<React.SetStateAction<BOMItem[]>>;
      onEditAlternative: (index: number) => void;
      isEditing: boolean; 
    }

    const AlternativesForm: React.FC<AlternativesFormProps> = ({
      item,
      alternatives,
      setAlternatives,
      onEditAlternative,
      isEditing = false
    }) => {
      const [newAlternative, setNewAlternative] = React.useState<BOMItem>({
        product_id: undefined,
        product: null,
        quantity: null,
        measurement_unit_id: null,
        conversion_factor: 1,
        symbol: null,
      });
      const [warning, setWarning] = React.useState<string | null>(null);
      const [selectedUnit, setSelectedUnit] = React.useState<number | null>(null);
      const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

      const handleAddAlternative = () => {
        if (!newAlternative.product || newAlternative.quantity === null || newAlternative.quantity <= 0) {
          setWarning("Please select a product and enter a valid quantity.");
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

        if (alternatives.some((alt) => alt.symbol === newAlternative.symbol)) {
          setWarning(`⚠️ Unit "${newAlternative.symbol}" is already used by another alternative.`);
          return;
        }

        setAlternatives((prev) => [...prev, { ...newAlternative }]);

        setNewAlternative({
          product_id: undefined,
          product: null,
          quantity: null,
          measurement_unit_id: null,
          conversion_factor: 1,
          symbol: null,
        });
        setSelectedUnit(null);
        setWarning(null);
      };

      const handleRemoveAlternative = (altIndex: number) => {
        setAlternatives(prev => prev.filter((_, i) => i !== altIndex));
        if (editingIndex === altIndex) setEditingIndex(null);
      };

      const handleUpdateAlternative = (altIndex: number, updatedItem: BOMItem) => {
        setAlternatives(prev => {
          const updated = [...prev];
          updated[altIndex] = updatedItem;
          return updated;
        });
        setEditingIndex(null);
      };

      const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        onEditAlternative(index);
      };

      const handleCancelEdit = () => setEditingIndex(null);

  return (
    <>
      {/* Only show the title if not in edit mode */}
      {!isEditing && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Alternative Input Products
        </Typography>
      )}

      {/* Only show the add form if not in edit mode */}
      {!isEditing && (
        <>
          <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
            <Grid size={{xs:12, md:8}}>
              <ProductSelect
                key={newAlternative.product ? `alt-product-${newAlternative.product.id}` : "alt-product-empty"}
                label="Alternative Input Product"
                value={newAlternative.product}
                onChange={(product: Product | null) => {
                  if (product) {
                    const unitId = product.primary_unit?.id ?? product.measurement_unit_id ?? null;
                    const Symbol = product.primary_unit?.unit_symbol ?? product.measurement_unit?.symbol ?? null;
                    const conversionFactor = product.primary_unit?.conversion_factor ?? 1;

                    setNewAlternative((prev) => ({
                      ...prev,
                      product,
                      measurement_unit_id: unitId,
                      symbol: Symbol,
                      conversion_factor: conversionFactor
                    }));
                    setSelectedUnit(unitId);
                  } else {
                    setNewAlternative({
                      product: null,
                      product_id: undefined,
                      quantity: null,
                      measurement_unit_id: null,
                      conversion_factor: 1,
                      symbol: null,
                    });
                    setSelectedUnit(null);
                  }
                }}
              />
              {warning && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {warning}
                </Typography>
              )}
            </Grid>
            <Grid size={{xs:12, md:4}}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                type="number"
                value={newAlternative.quantity ?? ''}
                onChange={(e) =>
                  setNewAlternative((prev) => ({
                    ...prev,
                    quantity: e.target.value === '' ? null : Number(e.target.value)
                  }))
                }
                InputProps={{
                  inputComponent: CommaSeparatedField,
                  endAdornment: newAlternative.product ? (
                    <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                      <Select
                        value={selectedUnit ?? ''}
                        onChange={(e) => {
                          const unitId = e.target.value as number;
                          setSelectedUnit(unitId);

                          const combinedUnits = [
                            ...(newAlternative.product?.secondary_units || []),
                            ...(newAlternative.product?.primary_unit ? [newAlternative.product.primary_unit] : [])
                          ];

                          const unit = combinedUnits.find((u) => u.id === unitId);
                          if (unit) {
                            setNewAlternative((prev) => ({
                              ...prev,
                              measurement_unit_id: unit.id,
                              symbol:unit.unit_symbol,
                              conversion_factor: unit.conversion_factor ?? 1
                            }));
                          }
                        }}
                        size="small"
                      >
                        {[
                          ...(newAlternative.product?.secondary_units || []),
                          ...(newAlternative.product?.primary_unit ? [newAlternative.product.primary_unit] : [])
                        ].map((unit) => (
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
            <Grid size={12} container justifyContent="flex-end">
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
        </>
      )}
      {alternatives.length > 0 && (
        <Stack spacing={1}>
          {alternatives.map((alt, idx) => (
            <AlternativesRow
              key={idx}
              alternative={alt}
              index={idx}
              onEdit={(updatedItem) => handleUpdateAlternative(idx, updatedItem)}
              onRemove={() => handleRemoveAlternative(idx)}
              isEditing={editingIndex === idx}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default AlternativesForm;