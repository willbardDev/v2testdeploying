import { Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'

function VendorsRow({ index, vendor, vendors=[], setVendors }) {
    const client = vendor.stakeholder;

  return (
         <React.Fragment>
            {  (
                    <Grid container 
                        padding={1}
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
                        <Grid item xs={5} md={8}>
                            <Tooltip title="Vendor">
                                <Typography>{client?.name || vendor?.name}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6} md={3.5}>
                            <Tooltip title="Remarks">
                                <Typography>{vendor.remarks}</Typography>
                            </Tooltip>
                        </Grid>
                    </Grid>
                )
            }
        </React.Fragment>
  )
}

export default VendorsRow