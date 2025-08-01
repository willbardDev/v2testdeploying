import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import BomsFormItem from './BomsFormItem';
import { BOMItem } from '../BomsType';

interface BomsFormRowProps {
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm: () => void;
  setSubmitItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  submitItemForm: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  items: BOMItem[];
  setItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  item: BOMItem;
  index: number;
}

function BomsFormRow({
  setClearFormKey,
  submitMainForm,
  setSubmitItemForm,
  submitItemForm,
  setIsDirty,
  items,
  setItems,
  item,
  index,
}: BomsFormRowProps) {
  const [showForm, setShowForm] = useState(false);

  const handleRemoveItem = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  return (
    <>
      <Divider />
      {!showForm ? (
        <Grid
          container
          sx={{
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            alignItems: 'center',
            py: 1,
          }}
        >
          <Grid size={1}>
            <Typography variant="body2">{index + 1}.</Typography>
          </Grid>

          <Grid size={{6, md:7}}>
            <Tooltip title="Material">
              <Typography noWrap>{item.material?.name}</Typography>
            </Tooltip>
          </Grid>

          <Grid size={{3, md:2}}>
            <Tooltip title="Quantity">
              <Typography textAlign="right" variant="body2">
                {item.quantity.toLocaleString()} {item.material?.measurement_unit?.symbol || ''}
              </Typography>
            </Tooltip>
          </Grid>

          <Grid size={{2, md:2}} textAlign="end">
            <Tooltip title="Edit Item">
              <IconButton size="small" onClick={() => setShowForm(true)}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove Item">
              <IconButton size="small" onClick={handleRemoveItem}>
                <DisabledByDefault fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <BomsFormItem
          setClearFormKey={setClearFormKey}
          submitMainForm={submitMainForm}
          setSubmitItemForm={setSubmitItemForm}
          submitItemForm={submitItemForm}
          setIsDirty={setIsDirty}
          item={item}
          setShowForm={setShowForm}
          index={index}
          items={items}
          setItems={setItems}
        />
      )}
    </>
  );
}

export default BomsFormRow;
