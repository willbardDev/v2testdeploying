import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import ProformaItemForm from './ProformaItemForm';

function ProformaItemRow({ setClearFormKey, submitMainForm, setSubmitItemForm, submitItemForm, setIsDirty, items, setItems, item, index, vat_percentage = 0}) {
    const product = item.product;
    const [showForm, setShowForm] = useState(false);
    const vat_factor = vat_percentage*0.01;

  return (
    <React.Fragment>
        <Divider/>
        { !showForm ? (
                <Grid container 
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    }}
                >
                    <Grid item xs={1} md={0.5}>
                        {index+1}.
                    </Grid>
                    <Grid item xs={11} md={4.5} lg={4.5}>
                        <Tooltip title="Product">
                            <Typography>{product.name}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid textAlign={{md: 'end'}} item xs={vat_factor ? 4 : 6} md={2.5} lg={vat_factor ? 1 : 2}>
                        <Tooltip title="Quantity">
                            <Typography>{item.quantity} {item?.unit_symbol ? item.unit_symbol : (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item.product.unit_symbol)}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid textAlign={'end'} item xs={vat_factor ? 4 : 6} md={2.5} lg={vat_factor ? 1 : 1.5}>
                        <Tooltip title="Price">
                            <Typography>{item.rate.toLocaleString()}</Typography>
                        </Tooltip>
                    </Grid>
                    {
                        vat_factor &&
                        <Grid textAlign={'end'} item xs={4} md={2} lg={2}>
                            <Tooltip title="VAT">
                                <Typography>{(item.rate*(product?.vat_exempted !== 1 ? vat_factor : 0)).toLocaleString()}</Typography>
                            </Tooltip>
                        </Grid>
                    }
                    <Grid textAlign={{md: 'end'}} item xs={6} md={2}>
                        <Tooltip title="Line Total">
                            <Typography>{(item.quantity*item.rate*((1+(product?.vat_exempted !== 1 ? vat_factor : 0)))).toLocaleString()}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid textAlign={'end'} item xs={12} md={12} lg={1}>
                        <Tooltip title='Edit Item'>
                            <IconButton size='small' onClick={() => {setShowForm(true)}}>
                                <EditOutlined fontSize='small'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Remove Item'>
                            <IconButton size='small' 
                                onClick={() => setItems(items => {
                                    const newItems = [...items];
                                    newItems.splice(index,1);
                                    return newItems;
                                })}
                            >
                                <DisabledByDefault fontSize='small' color='error'/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            ) : (
                <ProformaItemForm setClearFormKey={setClearFormKey} submitMainForm={submitMainForm} setSubmitItemForm={setSubmitItemForm} submitItemForm={submitItemForm} setIsDirty={setIsDirty} item={item} vat_percentage={vat_percentage} setShowForm={setShowForm} index={index} items={items} setItems={setItems} />
            )
        }
    </React.Fragment>
  )
}

export default ProformaItemRow