import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react'
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';

function SalesManifestOnScreen({reportData, authObject, separateVAT}) {
    const {checkOrganizationPermission, authOrganization: {organization}} = authObject;
    const [expanded, setExpanded] = useState(Array(reportData.transactions.length).fill(true));
    const financePersonnel = checkOrganizationPermission([PERMISSIONS.ACCOUNTS_REPORTS]);
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const saleAmount = (sale) => {
        return sale.items.reduce((amount, saleItem) => {
          if (saleItem.product.vat_exempted) {
            // If the product is VAT exempted, do not include VAT in the calculation
            return amount + saleItem.quantity * saleItem.rate;
          } else {
            // Include VAT in the calculation
            return amount + saleItem.quantity * saleItem.rate * (1 + sale.vat_percentage * 0.01);
          }
        }, 0);
      };
    const totalSalesVatInclusive = reportData.transactions.reduce((totalSales, sale) => {
        return totalSales + saleAmount(sale);
    }, 0);

    const saleCost = (sale) => {
       return sale.items.reduce((cost, saleItem) => cost + saleItem.cost, 0);
    };
    const totalCoGS = reportData.transactions.reduce((totalCogs, sale) => totalCogs + saleCost(sale), 0);

    const totalSaleAmount = (sale) => {
        return sale.items.reduce((amount,saleItem) => amount + saleItem.quantity*saleItem.rate,0);
    }
    const totalSales = reportData.transactions.reduce((totalSales, sale) => totalSales + totalSaleAmount(sale), 0);

    // Calculate total for Cash Distribution table
    const totalCollectedAmount = reportData?.collection_distribution ? reportData.collection_distribution.reduce((acc, cd) => acc + (cd.amount || 0), 0) : 0;

    const handleChange = (index) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded);
    };

    const SalesItemInfo = function({label,value, color='inherit', textAlign='start'}) {
        return (
            (
            !belowLargeScreen ?

                <Tooltip title={label}>
                    <TableCell size='small' sx={{ 
                        border: '1px solid rgba(224, 224, 224, 1)', textAlign:textAlign, color: color
                    }}>{value}</TableCell>
                </Tooltip>
                
                :

                <Tooltip title={label}>
                    <Stack direction={'row'} spacing={0.5} display={'flex'}>
                        <Typography fontWeight={'bold'} variant='caption' flex={{ xs: 2, md: 1  }} color={color}>{label}:</Typography>
                        <Typography flex={{ xs: 3, md: 2  }} color={color}>{value}</Typography>
                    </Stack>
                </Tooltip>
            )
        )
    }

  return (
    <Grid
        columnSpacing={5}
        rowSpacing={1}
        alignItems={'center'}
        container
    >
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Grid container spacing={1} sx={{ paddingLeft: 5, paddingTop: 1 }}>
                    <Grid item xs={12} textAlign={'center'}>
                        <Typography variant="h5" sx={{ paddingTop: 1, paddingBottom: 1, backgroundColor: mainColor, color: contrastText }}>Summary</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Total Sales:</TableCell>
                                        <TableCell align="right" style={{ color: 'blue' }}>
                                            {totalSalesVatInclusive.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>

                                    {separateVAT && (totalSalesVatInclusive - totalSales > 0) && (
                                        <>
                                            <TableRow>
                                                <TableCell>Sales (VAT Excl.)</TableCell>
                                                <TableCell align="right">
                                                    {totalSales.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>VAT</TableCell>
                                                <TableCell align="right">
                                                    {(totalSalesVatInclusive - totalSales).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )}

                                    {financePersonnel && (
                                        <>
                                            <TableRow>
                                                <TableCell>Total CoGS:</TableCell>
                                                <TableCell align="right" style={{ color: 'red' }}>
                                                    {totalCoGS.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total Profit:</TableCell>
                                                <TableCell align="right" style={{ color: 'green' }}>
                                                    {(totalSales - totalCoGS).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
                {reportData?.collection_distribution &&
                    <TableContainer component={Paper} sx={{ paddingLeft: 5, justifyContent: 'flex-end', marginBottom: 1, marginTop: 1, border: 'none', boxShadow: 'none' }}>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ backgroundColor: mainColor, textAlign: 'center' }}>
                                        <Typography variant="h5" sx={{ color: contrastText }}>
                                            Collected Cash Distribution
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.collection_distribution.length > 0 &&
                                    reportData.collection_distribution.map((cd, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                            <TableCell sx={{ flex: 0.7 }}>{cd.name}</TableCell>
                                            <TableCell sx={{ flex: 0.3, textAlign: 'right' }}>
                                                {cd.amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: mainColor, color: contrastText, flex: 0.7 }}>Total</TableCell>
                                    <TableCell sx={{ backgroundColor: mainColor, color: contrastText, flex: 0.3, textAlign: 'right' }}>
                                        {totalCollectedAmount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Grid>
        </Grid>
        
        <Grid item xs={12} mt={5} textAlign={'center'}>
            <Typography variant='h4' textAlign={'center'} sx={{color: mainColor}}>Sales Details</Typography>
        </Grid>
        <Grid item xs={12}>
            {reportData.transactions.map((sale,index) => {
                const vat_percentage = sale.vat_percentage
                const totalSalesVatInclusive = sale.items.reduce((amount, saleItem) => (amount + ((saleItem.rate*saleItem.quantity) + (!!saleItem.product.vat_exempted ? 0 : (saleItem.quantity*saleItem.rate*vat_percentage*0.01)))),0);
                const totalProfit = sale.items.reduce((total, item) => total + ((item.quantity*item.rate) - (item.cost)), 0)
                
                return (
                    <Accordion
                        key={index}
                        square
                        expanded={expanded[index]}
                        onChange={() => handleChange(index)}
                        sx={{
                            borderRadius: 2,
                            borderTop: 2,
                            backgroundColor: totalProfit < 0 ? 'rgba(255, 99, 71, 0.2)' : null,
                            borderColor: 'divider',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={expanded[index] ? <RemoveIcon /> : <AddIcon />}
                            sx={{
                                px: 3,
                                flexDirection: 'row-reverse',
                                '.MuiAccordionSummary-content': {
                                    alignItems: 'center',
                                    '&.Mui-expanded': {
                                    margin: '12px 0',
                                },
                            },
                            '.MuiAccordionSummary-expandIconWrapper': {
                                    borderRadius: 1,
                                    border: 1,
                                    color: 'text.secondary',
                                    transform: 'none',
                                    mr: 1,
                                '&.Mui-expanded': {
                                    transform: 'none',
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                },
                                '& svg': {
                                    fontSize: '1.25rem',
                                },
                            },
                            '&:hover': {
                                '.MuiTypography-root': {
                                // fontWeight: 'bold',
                                },
                            },
                            }}
                        >
                            <Grid
                                paddingLeft={2}
                                paddingRight={1}
                                columnSpacing={3}
                                rowSpacing={1}
                                alignItems={'center'}
                                container
                            >
                                <Grid item xs={7} md={2.4}>
                                    <Tooltip title="Transaction Date">
                                        <Typography>{readableDate(sale.transaction_date)}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={5} md={2.4}>
                                    <Tooltip title="Transaction Number">
                                        <Typography>{sale.transaction_no}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={7} md={2.4}>
                                    <Tooltip title="Client">
                                        <Typography>{sale.stakeholder.name}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={5} md={2.4}>
                                    <Tooltip title="Reference">
                                        <Typography>{sale.reference && sale.reference}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={7} md={2.4}>
                                    <Tooltip title="Total Sales">
                                        <Typography sx={{ color: expanded[index] ? 'blue' : 'normal' }}>{totalSalesVatInclusive.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Typography>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider />
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                marginBottom: 3,
                            }}
                        >
                            {
                            !belowLargeScreen ? 
                                <Grid 
                                    container
                                >
                                    <Grid item xs={12}>
                                        <Stack direction={'row'} p={1} spacing={1} justifyContent={'end'}>
                                            <Typography  variant='caption' fontWeight={'bold'}>Counter:</Typography>
                                            <Typography variant='caption'>{sale.counter}</Typography>
                                        </Stack>
                                        <TableContainer
                                           sx={{
                                            maxHeight: 400,
                                            overflow: 'auto',
                                            position: 'relative',
                                            '&::-webkit-scrollbar': {
                                                width: '0.4em',
                                                height: '0.4em'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: totalProfit < 0 ? 'rgba(255, 99, 71, 0.2)' : null,
                                                borderRadius: 2
                                            }
                                           }}
                                        >
                                            <Table stickyHeader size='small'>
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            '& th': {
                                                                position: 'sticky',
                                                                top: 0,
                                                                zIndex: 2,
                                                                backgroundColor: totalProfit < 0 ? 'rgba(251, 244, 242, 0.2)' : null,
                                                                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                                                whiteSpace: 'nowrap'
                                                            }
                                                        }}
                                                    >
                                                        <SalesItemInfo value={'S/N'}/>
                                                        <SalesItemInfo value={'Product'}/>
                                                        <SalesItemInfo value={'Quantity'}/>
                                                        <SalesItemInfo value={'Price'}/>
                                                        <SalesItemInfo color='blue' value={'Amount'}/>
                                                        {
                                                        !!separateVAT && !!vat_percentage && 
                                                            <SalesItemInfo value={'VAT'}/>
                                                        }
                                                        {
                                                            financePersonnel && 
                                                                <>
                                                                    <SalesItemInfo value={'P.U Cost'}/>
                                                                    <SalesItemInfo color='red' value={'CoGS'}/>
                                                                    <SalesItemInfo color='green' value={'Profit'}/>
                                                                </>
                                                        }
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        sale.items.map((item, itemIndex) => (
                                                            <TableRow 
                                                                key={itemIndex}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    borderColor: 'divider',
                                                                    '&:hover': {
                                                                        bgcolor: 'action.hover',
                                                                    },
                                                                    paddingLeft: 0.5,
                                                                    paddingBottom: 0.5
                                                                }}
                                                            >
                                                                <SalesItemInfo label={'S/N'} value={itemIndex + 1}/>
                                                                <SalesItemInfo label={'Product'} value={item.product.name}/>
                                                                <SalesItemInfo label={'Quantity'} textAlign={'right'} value={`${item.quantity} ${item.measurement_unit.symbol}`}/>
                                                                <SalesItemInfo label={'Price'} textAlign={'right'} value={!!separateVAT ? item.rate.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2}) : (item.rate + (!!item.product.vat_exempted ? 0 : item.rate * vat_percentage * 0.01)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                                <SalesItemInfo label={'Amount'} color='blue' textAlign={'right'} value={!!separateVAT ? (item.quantity*item.rate).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2}) : ((item.quantity*item.rate) + (!!item.product.vat_exempted ? 0 : (item.quantity*item.rate)*vat_percentage*0.01)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                                {!!separateVAT && !!vat_percentage && <SalesItemInfo label={'VAT'} textAlign={'right'} value={!!item.product.vat_exempted ? 0 : (item.quantity*item.rate*vat_percentage*0.01).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>}
                                                                {
                                                                    financePersonnel &&
                                                                        <>
                                                                            <SalesItemInfo label={'P.U Cost'} textAlign={'right'} value={(item.cost / item.quantity).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                                            <SalesItemInfo label={'CoGS'} color='red' textAlign={'right'} value={item.cost.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                                            <SalesItemInfo label={'Profit'} color='green' textAlign={'right'} value={((item.quantity*item.rate) - (item.cost)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                                        </>
                                                                }
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                                <TableBody>
                                                    <TableRow 
                                                        sx={{
                                                            cursor: 'pointer',
                                                            borderColor: 'divider',
                                                        '&:hover': {
                                                            bgcolor: 'action.hover',
                                                        },
                                                            border: '2px solid rgba(224, 224, 224, 1)',
                                                            paddingLeft: 0.5,
                                                            paddingBottom: 0.5
                                                        }}
                                                    >
                                                        <TableCell size='small'></TableCell>
                                                        <TableCell size='small'></TableCell>
                                                        <TableCell size='small'></TableCell>
                                                        <TableCell size='small' sx={{fontWeight: 'bold'}}>Total</TableCell>
                                                        <SalesItemInfo label={'Total Amount'} textAlign={'right'} color='blue' value={sale.items.reduce((total, currentItem) => total + (!!separateVAT ? (currentItem.quantity*currentItem.rate) : ((currentItem.quantity*currentItem.rate) + (!!currentItem.product.vat_exempted ? 0 : (currentItem.quantity*currentItem.rate)*vat_percentage*0.01))), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                        {!!separateVAT && !!vat_percentage && <SalesItemInfo textAlign={'right'} value={sale.items.reduce((total, currentItem) => total + (!!currentItem.product.vat_exempted ? 0 : (currentItem.quantity*currentItem.rate*vat_percentage*0.01)), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>}
                                                        {
                                                            financePersonnel &&
                                                                <>
                                                                    <SalesItemInfo value={''}/>
                                                                    <SalesItemInfo label={'Total CoGS'} textAlign={'right'} color={'red'} value={sale.items.reduce((total, currentItem) => total + currentItem.cost, 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                                    <SalesItemInfo label={'Total Profit'} textAlign={'right'} color={'green'} value={sale.items.reduce((total, currentItem) => total + ((currentItem.quantity*currentItem.rate) - (currentItem.cost)), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                                </>
                                                        }
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                                    :
                                <Grid container rowSpacing={1}>
                                    <Grid item xs={12}>
                                        <Stack direction={'row'} spacing={1}>
                                            <Typography fontWeight={'bold'} variant='caption'>Counter:</Typography>
                                            <Typography variant='caption'>{sale.counter}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {sale.items.map((sale,index) => {
                                            return (
                                                <Grid
                                                    key={index}
                                                    item
                                                    xs={12}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        borderTop: 1,
                                                        borderColor: 'divider',
                                                        '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        },
                                                        paddingLeft: 0.5,
                                                        paddingBottom: 0.5
                                                    }}
                                                    columnSpacing={1}
                                                    alignItems={'center'}
                                                    container
                                                >
                                                <Grid item xs={1} md={0.5} lg={0.5}>
                                                    <Tooltip title="S/N">
                                                        <Typography>{index+1}.</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={11} md={7.5} lg={5.5}>
                                                    <Tooltip title="Product">
                                                        <Typography>{sale.product.name}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} md={4} lg={3}>
                                                    <SalesItemInfo label={'Qty'} value={`${sale.quantity} ${sale.measurement_unit.symbol}`}/>
                                                </Grid>
                                                <Grid item xs={6} md={4} lg={3}>
                                                    <SalesItemInfo label={'Price'} value={!!separateVAT ? sale.rate.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2}) : (sale.rate + (!!sale.product.vat_exempted ? 0 : sale.rate * vat_percentage * 0.01)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                </Grid>
                                                <Grid item xs={6} md={4} lg={3}>
                                                    <SalesItemInfo label={'Amt'} value={!!separateVAT ? (sale.quantity*sale.rate).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2}) : ((sale.quantity*sale.rate) + (!!sale.product.vat_exempted ? 0 : (sale.quantity*sale.rate)*vat_percentage*0.01)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                </Grid>
                                                { 
                                                    !!separateVAT && !!vat_percentage &&
                                                        <Grid item xs={6} md={4} lg={3}>
                                                            <SalesItemInfo label={'VAT'} value={!!sale.product.vat_exempted ? 0 : (sale.quantity*sale.rate*vat_percentage*0.01).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                        </Grid>
                                                }
                                                {
                                                financePersonnel &&
                                                    <>
                                                        <Grid item xs={6} md={4} lg={3}>
                                                            <SalesItemInfo label={'Cost'} value={(sale.cost/sale.quantity).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                        </Grid>
                                                        <Grid item xs={6} md={4} lg={3}>
                                                            <SalesItemInfo  color={'red'}  label={'CoGS'} value={sale.cost.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                        </Grid>
                                                        <Grid item xs={6} md={4} lg={3}>
                                                            <SalesItemInfo label={'Profit'} color={'green'} value={((sale.quantity*sale.rate) - (sale.cost)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} />
                                                        </Grid>
                                                    </>
                                                }
                                                </Grid>
                                            )
                                        })}
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                borderTop: 1,
                                                borderColor: 'divider',
                                                paddingTop: 3,
                                            }}
                                            container
                                        >
                                            <Grid item xs={12} textAlign={'center'} fontWeight={'bold'} marginBottom={2}>
                                                Totals
                                            </Grid>
                                            <Grid item xs={6} md={4}>
                                                <SalesItemInfo label="Amount" value={sale.items.reduce((total, currentItem) => total + (!!separateVAT ? (currentItem.quantity*currentItem.rate) : ((currentItem.quantity*currentItem.rate) + (!!currentItem.product.vat_exempted ? 0 : (currentItem.quantity*currentItem.rate)*vat_percentage*0.01))), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                            </Grid>
                                            {
                                                !!separateVAT && !!vat_percentage &&
                                                    <Grid item xs={6} md={4}>
                                                        <SalesItemInfo label="VAT" value={sale.items.reduce((total, currentItem) => total + (!!currentItem.product.vat_exempted ? 0 : (currentItem.quantity*currentItem.rate*vat_percentage*0.01)), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}/>
                                                    </Grid>
                                            }
                                            {
                                                financePersonnel &&
                                                    <>
                                                        <Grid item xs={6} md={4}>
                                                            <SalesItemInfo label="CoGS" value={sale.items.reduce((total, currentItem) => total + currentItem.cost, 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} color="red" />
                                                        </Grid>
                                                        <Grid item xs={6} md={4}>
                                                            <SalesItemInfo label="Profit" value={sale.items.reduce((total, currentItem) => total + ((currentItem.quantity*currentItem.rate) - (currentItem.cost)), 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} color="green" />
                                                        </Grid>
                                                    </>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Grid>
    </Grid>
  )
}

export default SalesManifestOnScreen