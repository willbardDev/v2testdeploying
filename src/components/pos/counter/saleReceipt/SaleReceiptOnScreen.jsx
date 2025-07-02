import { Grid, Typography } from '@mui/material'
import React from 'react'

function SaleReceiptOnScreen({sale, organization}) {
    const vat_factor = sale.vat_percentage*0.01;

    //Total For only Items require VAT Inclusive
    const totalAmountForVAT = sale.sale_items.filter(item => item.vat_exempted !== 1).reduce((total, item) => {
        return total += item.rate * item.quantity;
    }, 0);

    const vatAmount = totalAmountForVAT*sale.vat_percentage/100 //Total VAT 

  return (
    <React.Fragment>
        {
            sale.sale_items.map((item,index) => (
                <Grid  container borderBottom={1} borderColor={'#484848'} key={index}  color={'black'} display={'flex'} alignItems={'end'}>
                    <Grid item xs={12}><Typography lineHeight={1.2} fontSize={12}>{item.product.name}</Typography></Grid>
                    <Grid item xs={6}><Typography lineHeight={1.2} fontSize={12}>{`${item.quantity} ${item.measurement_unit.symbol} X ${(item.rate*(1+(item?.vat_exempted !== 1 ? vat_factor : 0))).toLocaleString()}`}</Typography></Grid>
                    <Grid item xs={6} textAlign={'end'}><Typography lineHeight={1.2} fontSize={12}>{(item.quantity*item.rate*(1+(item?.vat_exempted !== 1 ? vat_factor : 0))).toLocaleString()}</Typography></Grid>
                </Grid>
            ))
        }
        <Grid container mt={1} borderBottom={1}  color={'black'} display={'flex'} alignItems={'end'}>
            <Grid item xs={6}><Typography  lineHeight={1.2} fontSize={12} fontWeight={'bold'}>Total</Typography></Grid>
            <Grid item xs={6} textAlign={'end'}><Typography  lineHeight={1.2} fontSize={12}>{sale.amount.toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Typography></Grid>
            {
                sale.vat_percentage > 0 && 
                <>
                    <Grid item xs={6}><Typography  lineHeight={1.2} fontSize={12}  fontWeight={'bold'}>VAT</Typography></Grid>
                    <Grid item xs={6} textAlign={'end'}><Typography  lineHeight={1.2} fontSize={12}>{vatAmount.toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Typography></Grid>
                    <Grid item xs={6}><Typography  lineHeight={1.2} fontSize={12}  fontWeight={'bold'}>Total (VAT Incl.)</Typography></Grid>
                    <Grid item xs={6} textAlign={'end'}><Typography  lineHeight={1.2} fontSize={12}>{(sale.amount + vatAmount).toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Typography></Grid>
                </>
            }
        </Grid>
    </React.Fragment>
  )
}

export default SaleReceiptOnScreen