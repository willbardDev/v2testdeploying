import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import BudgetItemForm from './BudgetItemForm';

function BudgetItemRow({ items, setItems, item, index }) {
  const ledger = item.ledger;
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Divider />
      {!showForm ? (
        <Grid
          container
          columnSpacing={1}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Grid item xs={1} md={0.5}>
            {index + 1}.
          </Grid>
          <Grid item xs={11} md={5} lg={7}>
            {ledger.name}
          </Grid>
          <Grid item xs={3} md={3} lg={2}>
            <Tooltip title={'amount'}>
              <Typography>{item.amount.toLocaleString()}</Typography>
            </Tooltip>
          </Grid>
          <Grid textAlign={'end'} item xs={12} md={3} lg={2.5}>
            <Tooltip title='Edit Item'>
              <IconButton size='small' onClick={() => setShowForm(true)}>
                <EditOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Item'>
              <IconButton
                size='small'
                onClick={() =>
                  setItems((items) => {
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    return newItems;
                  })
                }
              >
                <DisabledByDefault fontSize='small' color='error' />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <BudgetItemForm item={item} setShowForm={setShowForm} index={index} items={items} setItems={setItems} />
      )}
    </>
  );
}

export default BudgetItemRow;
