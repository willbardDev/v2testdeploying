import {
  Grid,
  TextField,
  Button,
  Box,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { CheckOutlined, DisabledByDefault, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import { Product } from '@/components/productAndServices/products/ProductType';
import ProductSelect from '@/components/productAndServices/products/ProductSelect';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { BOMItem } from '../../BomType';

interface AlternativesRowProps {
  alternative: BOMItem;
  index: number;
  onUpdate: (updatedItem: BOMItem) => void;
  onRemove: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  isDisabled: boolean;
}

const AlternativesRow: React.FC<AlternativesRowProps> = ({
  alternative,
  index,
  onUpdate,
  onRemove,
  onStartEdit,
  onCancelEdit,
  isEditing,
  isDisabled
}) => {
  const [editAlternative, setEditAlternative] = useState<BOMItem>({...alternative});
  const [selectedUnit, setSelectedUnit] = useState<number | null>(alternative.measurement_unit_id);

  const handleSaveEdit = () => {
    onUpdate(editAlternative);
  };

  const handleCancel = () => {
    setEditAlternative({...alternative});
    setSelectedUnit(alternative.measurement_unit_id);
    onCancelEdit();
  };

  if (isEditing) {
    return (
      <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{xs:12, md:6}}>
            <ProductSelect
              label="Alternative Product"
              defaultValue={editAlternative.product}
              onChange={(product: Product | null) => {
                if (product) {
                  const unitId = product.primary_unit?.id ?? product.measurement_unit_id ?? null;
                  const Symbol = product.primary_unit?.unit_symbol ?? product.measurement_unit?.symbol ?? '';
                  const conversionFactor = product.primary_unit?.conversion_factor ?? 1;

                  setEditAlternative((prev) => ({
                    ...prev,
                    product,
                    measurement_unit_id: unitId,
                    symbol: Symbol,
                    conversion_factor: conversionFactor
                  }));
                  setSelectedUnit(unitId);
                }
              }}
            />
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <TextField
              label="Quantity"
              fullWidth
              size="small"
              value={editAlternative.quantity ?? ''}
              onChange={(e) =>
                setEditAlternative((prev) => ({
                  ...prev,
                  quantity: e.target.value === '' ? null : Number(e.target.value)
                }))
              }
              InputProps={{
                inputComponent: CommaSeparatedField,
                endAdornment: editAlternative.product ? (
                  <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                    <Select
                      value={selectedUnit ?? ''}
                      onChange={(e) => {
                        const unitId = e.target.value as number;
                        setSelectedUnit(unitId);

                        const combinedUnits = [
                          ...(editAlternative.product?.secondary_units || []),
                          ...(editAlternative.product?.primary_unit ? [editAlternative.product.primary_unit] : [])
                        ];

                        const unit = combinedUnits.find((u) => u.id === unitId);
                        if (unit) {
                          setEditAlternative((prev) => ({
                            ...prev,
                            measurement_unit_id: unit.id,
                            symbol: unit.unit_symbol,
                            conversion_factor: unit.conversion_factor ?? 1
                          }));
                        }
                      }}
                      size="small"
                    >
                      {[
                        ...(editAlternative.product?.secondary_units || []),
                        ...(editAlternative.product?.primary_unit ? [editAlternative.product.primary_unit] : [])
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

          <Grid size={{xs:12, md:2}} textAlign="right">
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveEdit}
            >
              <CheckOutlined fontSize="small" /> Done
            </Button>
            <Tooltip title="Cancel">
              <IconButton size="small" onClick={handleCancel}>
                <DisabledByDefault fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    );
  }

   return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
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
          <IconButton size="small" onClick={onStartEdit}color="primary">
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