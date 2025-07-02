import Div from '@jumbo/shared/Div';
import { Alert, Divider, Grid, LinearProgress, Tooltip, Typography } from '@mui/material';
import React from 'react'
import { useFormContext } from 'react-hook-form';

function SaleInvoiceItems() {
    const {isRetrieving, sale_items} = useFormContext();

    return (
        <>
          {isRetrieving ? <LinearProgress /> :
           sale_items?.length > 0 ?
            (
                sale_items?.map((item, index) => (
                <Grid
                    container
                    spacing={1}
                    key={index}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                        bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={0.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>{index + 1}.</Div>
                    </Grid>
                    <Grid item xs={11.5} md={8} lg={5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Product'>
                                <Typography>{item.product?.name || item.product_name}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={2} md={3.5} lg={1.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Quantity'>
                                <Typography>{`${item?.measurement_unit.symbol || item.unit} ${item.quantity}`}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={4} md={4} lg={2.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Rate'>
                                <Typography>{item.rate?.toLocaleString()}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    <Grid textAlign='center' item xs={4} md={4} lg={2.5}>
                        <Div sx={{ mt: 1.7, mb: 1.7 }}>
                            <Tooltip title='Amount'>
                                <Typography>{(item.rate * item.quantity).toLocaleString()}</Typography>
                            </Tooltip>
                        </Div>
                    </Grid>
                    </Grid>
              ))
            ) : (
                <Alert variant='outlined' color='primary' severity='info'>
                    No Items found to Invoice, Please Select Delivery Note(s)
                </Alert>
            )}
        </>
      );
      
}

export default SaleInvoiceItems