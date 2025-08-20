import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import JumboScrollbar from '@jumbo/components/JumboScrollbar/JumboScrollbar';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
    Alert, Autocomplete, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, LinearProgress,
    List, ListItem, MenuItem, Select, Stack, TextField, Tooltip, Typography, useMediaQuery
} from '@mui/material';
import Div from '@jumbo/shared/Div/Div';
import { useJumboTheme } from '@jumbo/hooks';
import PDFContent from '../../pdf/PDFContent';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { Share } from '@mui/icons-material';
import ProductSalesCardPDF from './ProductSalesCardPDF';
import posServices from '../../pos/pos-services';
import { useDashboardSettings } from '../Dashboard';

const topOptions = [
    { name: 'Products', value: 'products' },
    { name: 'Categories', value: 'product categories' },
    { name: 'Brands', value: 'brands' }
];

function ProductSalesCard() {
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const { authUser: { user } } = useJumboAuth();
    const [salesPersonsSelected, setSalesPersonsSelected] = useState([])

    // Screen handling constants
    const { theme } = useJumboTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { chartFilters: { from, to, cost_center_ids, costCenters } } = useDashboardSettings();
    const [params, setParams] = useState({
        from,
        to,
        top: 'products',
        order_by: 'profit',
        cost_center_ids,
        order_direction: 'desc',
        limit: 5
    });

    useEffect(() => {
        setParams(params => ({ ...params, from, to, cost_center_ids }));
    }, [from, to, cost_center_ids]);

    // For Top Products PDF
    const topProductsData = {
        params: params,
        costCenters,
        user: user.name,
    }

    const { data: popularProducts, isLoading } = useQuery(['topProducts', params], async () => {
        return await posServices.productSales(params);
    });

    const DocumentDialog = ({ open, onClose, popularProducts, topProductsData, salesPersonsSelected }) => {
        const { authOrganization: { organization } } = useJumboAuth();
        return (
            <Dialog
                open={open}
                scroll={(smallScreen || !open) ? 'body' : 'paper'}
                fullWidth
                maxWidth="lg"
                onClose={onClose}
            >
                <DialogContent>
                    <PDFContent
                        fileName='Top Product Sales'
                        document={<ProductSalesCardPDF salesPersonsSelected={salesPersonsSelected} selectedTop={topOptions.find(option => option.value === params.top)?.name || params.top} popularProducts={popularProducts} topProductsData={topProductsData} organization={organization} />}
                    />
                </DialogContent>
            </Dialog>
        );
    };

    const Actions = () => {
        return (
            <Stack direction={'row'} paddingLeft={1} columnGap={1}>
                <Div sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small' label="Order By">
                        <InputLabel id="top-products-order-by-label">Order By</InputLabel>
                        <Select
                            labelId="top-products-order-by-label"
                            id="products-order-by-label"
                            value={params.order_by}
                            label={'Order By'}
                            onChange={(e) => {
                                setParams(params => ({ ...params, order_by: e.target.value }));
                            }}
                        >
                            <MenuItem value='profit'>Profit</MenuItem>
                            <MenuItem value='revenue'>Sales</MenuItem>
                            <MenuItem value='quantity'>Quantity</MenuItem>
                            <MenuItem value='cogs'>CoGS</MenuItem>
                            <MenuItem value='margin'>Margin</MenuItem>
                        </Select>
                    </FormControl>
                </Div>
                <Div sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small' label="Order Direction">
                        <InputLabel id="top-products-order-by-direction-label">Order Direction</InputLabel>
                        <Select
                            labelId="top-products-order-by-direction-label"
                            id="products-order-by-direction"
                            value={params.order_direction}
                            label={'Order Direction'}
                            onChange={(e) => {
                                setParams(params => ({ ...params, order_direction: e.target.value }));
                            }}
                        >
                            <MenuItem value='asc'>Ascending</MenuItem>
                            <MenuItem value='desc'>Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Div>
                <Div sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small' label="Limit">
                        <InputLabel id="products-limit-label">Limit</InputLabel>
                        <Select
                            labelId="products-limit-label"
                            id="products-limit"
                            value={params.limit}
                            label={'Limit'}
                            onChange={(e) => {
                                setParams(params => ({ ...params, limit: e.target.value }));
                            }}
                        >
                            <MenuItem value='5'>5</MenuItem>
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='20'>20</MenuItem>
                            <MenuItem value='50'>50</MenuItem>
                            <MenuItem value='100'>100</MenuItem>
                        </Select>
                    </FormControl>
                </Div>
                { popularProducts?.length > 0 &&
                    <Tooltip title={'Export'}>
                        <IconButton onClick={() => setOpenDocumentDialog(true)}>
                            <Share />
                        </IconButton>
                    </Tooltip>
                }
            </Stack>
        )
    }

    const { data: salesPersons, isLoading: isFetchingSalesPeople } = useQuery('salesPerson', posServices.getSalesPerson);

    return (
        <div>
            <JumboCardQuick
                title={
                    <Grid container spacing={1} width={{ xs: '100%', md: '70%', lg: '100%' }} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h4">Top</Typography>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="top-options-label">-----</InputLabel>
                                    <Select
                                        labelId="top-options-label"
                                        id="top-options"
                                        value={params.top}
                                        label="Top"
                                        onChange={(e) => {
                                            setParams((params) => ({ ...params, top: e.target.value }));
                                        }}
                                        >
                                        {topOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {
                                isFetchingSalesPeople ? (
                                    <LinearProgress />
                                ) : (
                                <Autocomplete
                                    id="checkboxes-salesPerson"
                                    options={salesPersons}
                                    multiple
                                    disableCloseOnSelect
                                    isOptionEqualToValue={(option, value) => option === value}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Sales Person" size="small" fullWidth />
                                    )}
                                    onChange={(e, newValue) => {
                                        if (newValue) {
                                            setParams((params) => ({ ...params, sales_persons: newValue.map((person)=> person) }));
                                            setSalesPersonsSelected(newValue.map((person)=> person))
                                        } else {
                                            setParams((params) => ({ ...params, sales_persons: [] }));
                                            setSalesPersonsSelected([])
                                        }
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                }
                sx={{
                    height: !isLoading && popularProducts.length < 1 ? 300 : (smallScreen ? 500 : null)
                }}
                action={
                    !smallScreen && <Actions />
                }
            >
                {smallScreen && <Actions />}
                <Grid container columnSpacing={1} mt={smallScreen && 2} mb={1} justifyContent={'center'}>
                    <Grid item xs={4} md={3} lg={1}>
                        <Typography>- {topOptions.find(option => option.value === params.top)?.name || params.top}</Typography>
                    </Grid>
                    <Grid item xs={4} md={3} lg={1}>
                        <Typography color={'quantity'}>- Quantity</Typography>
                    </Grid>
                    <Grid item xs={4} md={3} lg={1}>
                        <Typography color={'blue'}> - Revenue</Typography>
                    </Grid>
                    <Grid item xs={4} md={3} lg={1}>
                        <Typography color={'red'}> - CoGS</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography color={'green'} lg={2}> - Profit & Margin</Typography>
                    </Grid>
                </Grid>
                <JumboScrollbar
                    autoHeight
                    autoHeightMin={!isLoading && popularProducts.length < 1 ? 250 : (smallScreen ? null : 173)}
                    autoHide
                    autoHideDuration={200}
                    autoHideTimeout={500}
                >
                    <List>
                        {
                            isLoading ? <LinearProgress /> :
                                popularProducts.length > 0 ? popularProducts.map((product, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            sx={{
                                                cursor: 'pointer',
                                                borderTop: 1,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                }
                                            }}
                                        >
                                            <Grid container>
                                                <Grid item xs={12} md={6} lg={3.5}>
                                                    <Tooltip title={'Product Name'}>
                                                        <Typography>{product.name}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} lg={1.5} textAlign={'end'}>
                                                    <Tooltip title={'Quantity Sold'}>
                                                        <Typography color={'black'}>{`${product.unit_symbol} ${product.quantity.toLocaleString()}`}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} lg={2} textAlign={'end'}>
                                                    <Tooltip title={'Sales'}>
                                                        <Typography color={'blue'}>{product.revenue.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} lg={2} textAlign={'end'}>
                                                    <Tooltip title={'CoGS'}>
                                                        <Typography color={'red'}>{product.cogs.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} lg={2} textAlign={'end'}>
                                                    <Tooltip title={'Profit'}>
                                                        <Typography color={'green'}>{product.profit.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} lg={1} textAlign={'end'}>
                                                    <Tooltip title={'Margin'}>
                                                        <Typography color={'green'}>{`${(product.profit * 100 / product.revenue).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </React.Fragment>
                                )) : <Alert variant={'outlined'} severity={'info'}>No product data was found</Alert>
                        }
                    </List>
                </JumboScrollbar>
            </JumboCardQuick>

            {/* Render the DocumentDialog */}
            <DocumentDialog open={openDocumentDialog} salesPersonsSelected={salesPersonsSelected} topProductsData={topProductsData} popularProducts={popularProducts} onClose={() => setOpenDocumentDialog(false)} />
        </div>
    )
}

export default ProductSalesCard;
