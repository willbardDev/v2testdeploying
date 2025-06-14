import { Divider, Grid, Switch, Typography } from '@mui/material';
import React from 'react'
import { useFormContext } from 'react-hook-form';

function PurchaseOrderSummary({isApprovedPurchase}) {
  const { totalAmount, vatableAmount, checked, setChecked } = useFormContext();

  return (
    <Grid container columnSpacing={1}>
      <Grid item xs={12}>
        <Typography align='center' variant='h3'>Order Summary</Typography>
        <Divider/>
      </Grid>
      <Grid item xs={5}>
        <Typography align='left' variant='body2'>Total:</Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography align='right' variant='h5'>{totalAmount?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography align='left' variant='body2'>
          VAT:
        </Typography>
      </Grid>
      <Grid item xs={7} display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <Typography align='right' variant='h5'>{vatableAmount?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Typography>
      </Grid>
      <Grid item xs={5} >
        <Typography align='left' variant='body2' noWrap>Grand Total:</Typography>
      </Grid>
      <Grid item xs={7} display={'flex'} alignItems={'end'} justifyContent={'end'}>
        <Typography align='right' variant='h5'>{(totalAmount + vatableAmount)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Typography>
      </Grid>
      {!isApprovedPurchase &&
        <>
          <Grid item xs={12}>
            <Divider/>
          </Grid>
          <Grid item xs={7} marginTop={1} marginBottom={2}>
            <Typography align='left' variant='body2'>
              Suggest Recent Price: 
            </Typography>
          </Grid>
          <Grid item xs={5} display={'flex'} alignItems={'end'} justifyContent={'end'} marginTop={1} marginBottom={2}>
            <Switch
              checked={checked}
              size='small'
              onChange={(e) => setChecked(e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
        </>
      }
    </Grid>
  )
}

export default PurchaseOrderSummary