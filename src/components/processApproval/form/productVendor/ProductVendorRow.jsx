import { DisabledByDefault, EditOutlined } from '@mui/icons-material'
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import ProductVendor from 'app/prosServices/prosERP/processApproval/form/productVendor/ProductVendor';
import React, { useState } from 'react'

function ProductVendorRow({ index, vendor, vendors=[], setVendors}) {
    const client = vendor.stakeholder;
    const [showForm, setShowForm] = useState(false);

  return (
         <React.Fragment>
            <Divider/>
            { !showForm ? (
                    <Grid container 
                        marginLeft={3}
                        paddingRight={3}
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
                        <Grid item xs={5} md={5}>
                            <Tooltip title="Vendor">
                                <Typography>{client?.name || vendor?.name}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6} md={5.5}>
                            <Tooltip title="Remarks">
                                <Typography>{vendor.remarks}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid textAlign={'end'} item xs={12} md={1}>
                            <Tooltip title='Edit Vendor'>
                                <IconButton size='small' onClick={() => {setShowForm(true)}}>
                                    <EditOutlined fontSize='small'/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Remove Vendor'>
                                <IconButton size='small' 
                                    onClick={() => setVendors(fuelVouchers => {
                                        const newItems = [...fuelVouchers];
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
                    <ProductVendor vendor={vendor} setShowForm={setShowForm} index={index} vendors={vendors} setVendors={setVendors}/>
                )
            }
        </React.Fragment>
  )
}

export default ProductVendorRow