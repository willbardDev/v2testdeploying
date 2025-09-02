import * as React from 'react';
import {
  Typography,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import { BOMItem } from '../../BomType';

interface AlternativesRowProps {
  alternative: BOMItem;
  index: number;
  onEdit: (updatedItem: BOMItem) => void;
  onRemove: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
}

const AlternativesRow: React.FC<AlternativesRowProps> = ({
  alternative,
  index,
  onEdit,
  onRemove,
  isEditing = false,
  onCancelEdit,
  onStartEdit,
}) => {
  const handleUpdate = (updated: BOMItem) => {
    onEdit(updated);
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  if (isEditing) {
    return (
      <AlternativeItemForm
        item={alternative}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        mb: 1,
        bgcolor: 'background.default',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Grid container alignItems="center">
        <Grid size={1}>
          <Typography variant="body2" color="text.secondary">
            {index + 1}.
          </Typography>
        </Grid>

        <Grid size={5}>
          <Typography variant="body2" fontWeight="medium">
            {alternative.product?.name}
          </Typography>
        </Grid>

        <Grid size={3} textAlign="right">
          <Typography variant="body2">
            {alternative.quantity} {alternative.symbol}
          </Typography>
        </Grid>

        <Grid size={3} textAlign="right">
          <IconButton size="small" onClick={onStartEdit} sx={{ mr: 0.5 }}>
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onRemove}>
            <DeleteOutlined fontSize="small" color="error" />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlternativesRow;
