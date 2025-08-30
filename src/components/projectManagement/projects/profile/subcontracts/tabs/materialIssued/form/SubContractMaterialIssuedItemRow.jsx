import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import SubContractMaterialIssuedItemForm from './SubContractMaterialIssuedItemForm';

function SubContractMaterialIssuedItemRow({ setClearFormKey, submitMainForm, setSubmitItemForm, submitItemForm, setIsDirty, issue_date, items, setItems, item, index}) {
    const product = item.product;
    const [showForm, setShowForm] = useState(false);

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
                    <Grid item xs={11} md={4}>
                        <Tooltip title="Product">
                            <Typography>{product.name}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={3.5}>
                        <Tooltip title="Store">
                            <Typography>{item.store.name}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid textAlign={'end'} item xs={6} md={3}>
                        <Tooltip title="Quantity">
                            <Typography>{item.quantity} {item?.unit_symbol ? item.unit_symbol : (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item.product.unit_symbol)}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid textAlign={'end'} item xs={12} md={1}>
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
                <SubContractMaterialIssuedItemForm setClearFormKey={setClearFormKey} submitMainForm={submitMainForm} setSubmitItemForm={setSubmitItemForm} submitItemForm={submitItemForm} setIsDirty={setIsDirty} item={item} setShowForm={setShowForm} index={index} items={items} setItems={setItems} issue_date={issue_date}/>
            )
        }
    </React.Fragment>
  )
}

export default SubContractMaterialIssuedItemRow