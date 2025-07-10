import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import PriceListItemForm from './PriceListItemForm';

function PriceListItemRow({ setClearFormKey, submitMainForm, setSubmitItemForm, submitItemForm, setIsDirty, items, setItems, item, index }) {
  const product = item.product;
  const [showForm, setShowForm] = useState(false);

  return (
    <React.Fragment>
      <Divider />
      {!showForm ? (
        <Grid
          container
          columnSpacing={1}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <Grid item xs={1} md={0.5}>
            {index + 1}.
          </Grid>
          <Grid item xs={10} md={4} lg={4}>
            <Tooltip title={'Product Name'}>
              <Typography>{product.name}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={1} md={1.5} lg={1.5}>
            <Tooltip title={'Unit'}>
              <Typography>{item?.unit_symbol ? item.unit_symbol : item.measurement_unit?.symbol}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2.5} lg={2.5}>
            <Tooltip title={'Price'}>
              <Typography>{item.price.toLocaleString()}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2.5} lg={2.5} textAlign={{xs: 'end', md: 'start'}}>
            <Tooltip title={'Bottom Cap'}>
              <Typography>{item.bottom_cap.toLocaleString()}</Typography>
            </Tooltip>
          </Grid>
          <Grid textAlign={'end'} item xs={12} md={1} lg={1}>
            <Tooltip title='Edit Item'>
              <IconButton size='small' onClick={() => { setShowForm(true) }}>
                <EditOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Item'>
              <IconButton size='small'
                onClick={() => setItems(items => {
                  const newItems = [...items];
                  newItems.splice(index, 1);
                  return newItems;
                })}
              >
                <DisabledByDefault fontSize='small' color='error' />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <PriceListItemForm setClearFormKey={setClearFormKey} submitMainForm={submitMainForm} setSubmitItemForm={setSubmitItemForm} submitItemForm={submitItemForm} setIsDirty={setIsDirty} item={item} setShowForm={setShowForm} index={index} items={items} setItems={setItems}/>
      )}
    </React.Fragment>
  )
}

export default PriceListItemRow;
