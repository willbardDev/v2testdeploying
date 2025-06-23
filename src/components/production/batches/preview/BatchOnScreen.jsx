import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'

function BatchOnScreen({batch}) {
    const {authOrganization} = useJumboAuth();
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";

    const totalConsumptions = batch.inventory_consumptions?.flatMap(consumption => consumption.items || []).reduce((total, item) => {
        const quantity = item.quantity || 0;
        const rate = item.unit_cost || item.rate || 0;
        return total + (quantity * rate);
      }, 0) || 0;
      const totalOtherExpenses = batch.ledger_expenses?.reduce((total, item) => total + (item.quantity * item.rate || 0), 0);
      const totalByProducts = batch.by_products?.reduce((total, item) => total + (item.quantity * item.market_value || 0), 0);
    
      const combinedInputsOtherExpensesByProduct = (totalConsumptions + totalOtherExpenses) - totalByProducts;

  return (
    <Grid container spacing={1}>
        <Grid size={12}>
            <Divider />
        </Grid>

        {batch?.outputs.length > 0 &&
            <Grid size={12} paddingTop={4}>
                <Typography variant="h3" color={mainColor} align="center">
                    Outputs
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>S/N</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Product</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right' }}>Quantity</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right'  }}>Unit Cost</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right'  }}>Amount</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right'  }}>Value%</TableCell>
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {batch?.outputs?.map((item, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell sx={{textAlign: 'right'}}>
                                        {item.quantity?.toLocaleString()} {item?.unit_symbol ? item.unit_symbol : (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item.product?.unit_symbol)}
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'right'}}>
                                        {(((item.value_percentage / 100) * combinedInputsOtherExpensesByProduct) / item.quantity)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'right'}}>
                                        {((item.value_percentage / 100) * combinedInputsOtherExpensesByProduct)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'right'}}>{item.value_percentage}%</TableCell>
                                    <TableCell>{item.description || item.remarks}</TableCell>
                                </TableRow>
                            ))}

                            <TableRow sx={{ backgroundColor: mainColor, color: contrastText, fontWeight: 'bold' }}>
                                <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', color: contrastText }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: contrastText, textAlign: 'right' }}>
                                    {
                                    batch.outputs
                                        .reduce((total, item) => total + ((item.value_percentage / 100) * combinedInputsOtherExpensesByProduct), 0)
                                        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    }
                                </TableCell>
                                <TableCell sx={{ color: contrastText }}></TableCell>
                                <TableCell sx={{ color: contrastText }}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        }

        {batch?.by_products.length > 0 &&
            <Grid size={12}>
                <Typography variant="h3" color={mainColor} align="center" marginTop={5}>
                    By Products
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Product</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Store</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Quantity</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Market Value</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Amount</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                batch?.by_products?.map((item, index) => (
                                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                        <TableCell>{index + 1}.</TableCell>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell>{item.store?.name}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{item.quantity?.toLocaleString()} {item?.unit_symbol ? item.unit_symbol : (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item.product?.unit_symbol)}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{item.market_value?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{(item.quantity * item.market_value)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                        <TableCell>{item.description || item.remarks}</TableCell>
                                    </TableRow>
                                ))
                            }

                            <TableRow sx={{ backgroundColor: mainColor }}>
                                <TableCell colSpan={5} align="center" sx={{ fontWeight: 'bold', color: contrastText }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: contrastText, textAlign: 'right' }}>
                                    {batch?.by_products?.reduce((total, item) => total + (item.quantity * item.market_value || 0), 0)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        }

        {  
            batch?.inventory_consumptions.length > 0 &&
            <Grid size={12}>
                <Typography variant="h3" color={mainColor} align="center" paddingTop={5}>
                    Inventory Consumptions
                </Typography>

                {batch?.inventory_consumptions?.map((item, index) => (
                    <Grid key={index} container spacing={2} sx={{ padding: 2 }}>
                        <Grid size={4}><Typography variant="body1">{readableDate(item.consumption_date)}</Typography></Grid>
                        <Grid size={4}><Typography variant="body1">{item.consumptionNo}</Typography></Grid>
                        <Grid size={4}><Typography variant="body1">{item.store?.name}</Typography></Grid>

                        {/* Table */}
                        <Grid size={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {["S/N", "Product", "Quantity", 'Average Cost', 'Amount', "Description"].map((header, idx) => (
                                                <TableCell key={idx} sx={{ backgroundColor: mainColor, color: contrastText, fontWeight: "bold" }}>
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item.items?.map((it, idx) => {
                                            const { product, quantity, unit_symbol, measurement_unit, description } = it;
                                            const unit = unit_symbol || measurement_unit?.symbol || product?.unit_symbol || "";
                                            const backgroundColor = idx % 2 === 0 ? "#FFFFFF" : lightColor;

                                            return (
                                                <TableRow key={idx} sx={{ backgroundColor }}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>{product?.name || "N/A"}</TableCell>
                                                    <TableCell align="right">{`${quantity} ${unit}`}</TableCell>
                                                    <TableCell align="right">{(it.unit_cost || it.rate)?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || 0}</TableCell>
                                                    <TableCell align="right">{((it.unit_cost || it.rate) * it.quantity || 0)?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</TableCell>
                                                    <TableCell>{description}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        }

        {batch?.ledger_expenses.length > 0 &&
            <Grid size={12}>
                <Typography variant="h3" color={mainColor} align="center" marginTop={5}>
                    Other Expenses
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Expense Name</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Quantity</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Rate</TableCell>
                                <TableCell sx={{backgroundColor: mainColor, color: contrastText, textAlign: 'right'}}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                batch?.ledger_expenses?.map((item, index) => (
                                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                        <TableCell>{index + 1}.</TableCell>
                                        <TableCell>{item.ledger?.name}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{item.quantity?.toLocaleString()}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{item.rate?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                        <TableCell sx={{textAlign: 'right'}}>{(item.quantity * item.rate)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                    </TableRow>
                                ))
                            }

                            <TableRow sx={{ backgroundColor: mainColor }}>
                                <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', color: contrastText }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: contrastText, textAlign: 'right' }}>
                                    {batch?.ledger_expenses?.reduce((total, item) => total + (item.quantity * item.rate || 0), 0)?.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        }
    </Grid>
  )
}

export default BatchOnScreen