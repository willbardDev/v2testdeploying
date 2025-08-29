import { DisabledByDefault, EditOutlined } from '@mui/icons-material'
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import MaterialUsed from './MaterialUsed';

function MaterialUsedRow({ material, index, materialUsed=[], setMaterialUsed}) {
    const product = material.product;
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
                        <Grid item xs={11} md={3.5}>
                            <Tooltip title="Product">
                                <Typography>{product.name}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6} md={2.5}>
                            <Tooltip title="Store">
                                <Typography>{material.store?.name}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid textAlign={'end'} item xs={6} md={2}>
                            <Tooltip title="Quantity">
                                <Typography>{material.quantity} {material.unit_symbol || material.measurement_unit?.symbol}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12} md={2.5} paddingLeft={3}>
                            <Tooltip title="Remarks">
                                <Typography>{material.remarks}</Typography>
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
                                    onClick={() => setMaterialUsed(materialUsed => {
                                        const newItems = [...materialUsed];
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
                    <MaterialUsed material={material} setShowForm={setShowForm} index={index} materialUsed={materialUsed} setMaterialUsed={setMaterialUsed}/>
                )
            }
        </React.Fragment>
  )
}

export default MaterialUsedRow