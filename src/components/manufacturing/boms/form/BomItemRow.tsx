import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import React from 'react';
import { BOMItem } from '../BomType';
import BomItemForm from './BomItemForm';
import AlternativesForm from './alternatives/AlternativesForm';

interface BomItemRowProps {
  item: BOMItem;
  index: number;
  items: BOMItem[];
  setItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
}

const BomItemRow: React.FC<BomItemRowProps> = ({
  item,
  index,
  items,
  setItems,
  setClearFormKey,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  // Local state for alternatives
  const [alternatives, setAlternatives] = React.useState<any[]>([]);
  const [editingAlternativeIndex, setEditingAlternativeIndex] =
    React.useState<number | null>(null);

  const handleRemove = () => {
    setItems(items.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <BomItemForm
        item={item}
        index={index}
        setItems={setItems}
        items={items}
        setShowForm={setIsEditing}
        setClearFormKey={setClearFormKey}
        submitMainForm={() => {}}
        submitItemForm={false}
        setSubmitItemForm={() => {}}
      />
    );
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, exp) => setExpanded(exp)}
      sx={{
        mb: 1,
        '&.Mui-expanded': { margin: '8px 0' },
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
            {item.symbol ||
              item.measurement_unit?.unit_symbol ||
              ''}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box
          component="div"
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          sx={{
            display: 'flex',
            gap: 1,
            ml: 1,
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              aria-label="Edit item"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setExpanded(true);
              }}
              component="div"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setIsEditing(true);
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
              component="div"
              role="button"
              tabIndex={0}
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

      <AccordionDetails sx={{ pt: 1, pb: 2 }}>
        {/* Alternatives inside accordion details */}
        <AlternativesForm
          item={item}
          alternatives={alternatives}
          setAlternatives={setAlternatives}
          isEditing={editingAlternativeIndex !== null}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default BomItemRow;
