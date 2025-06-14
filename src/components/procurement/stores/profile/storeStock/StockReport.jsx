import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import Div from '@jumbo/shared/Div/Div'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Tab, Tabs, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import * as yup from 'yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStoreProfile } from '../StoreProfileProvider'
import Span from '@jumbo/shared/Span/Span'
import useProsERPStyles from 'app/helpers/style-helpers'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import pdfStyles from 'app/prosServices/prosERP/pdf/pdf-styles'
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector'
import PdfLogo from 'app/prosServices/prosERP/pdf/PdfLogo'
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent'
import storeServices from '../../store-services'
import { readableDate } from 'app/helpers/input-sanitization-helpers'
import StoreSelector from '../../StoreSelector'
import { yupResolver } from '@hookform/resolvers/yup'
import StockReportOnScreen from './StockReportOnScreen'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import { useJumboTheme } from '@jumbo/hooks'
import { CheckBox, CheckBoxOutlineBlank, HighlightOff } from '@mui/icons-material'
import { useQuery } from 'react-query'
import productCategoryServices from 'app/prosServices/prosERP/productAndServices/productCategories/product-category-services'

const ReportDocument = ({productCategories, stockData,authObject,store,costCenter, date, hasPermissionToView}) => {
    const {authOrganization,authUser: { user}} = authObject;
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const reportPeriod =  `As at: ${readableDate(date,true)}`;

    //Total amount
    const totalAmount = stockData.reduce((total, stock) => total + (stock.latest_rate * stock.balance),0)
    
    return stockData ?
    (
        <Document 
            creator={`ProsERP | ${user.name}`}
            title={`${store.name} Stock Report ${reportPeriod}`}
            producer='ProsERP'
        >
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.table}>
                    <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
                        <View style={{ flex: 1, maxWidth: 120}}>
                            <PdfLogo organization={authOrganization.organization}/>
                        </View>
                        <View style={{ flex: 1, textAlign: 'right' }}>
                            <Text style={{...pdfStyles.majorInfo, color: mainColor }}>{`Stock Report`}</Text>
                            <Text style={{ ...pdfStyles.midInfo }}>{`${store.name}`}</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{reportPeriod}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ ...pdfStyles.tableRow, marginTop: 10, marginBottom: 10}}>
                    {
                        costCenter?.length > 0 &&
                        <View style={{ flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Cost Centers</Text>
                            <Text style={{...pdfStyles.minInfo }}>{costCenter.map((cost_center) => cost_center.name).join(', ')}</Text>
                        </View>
                    }
                    {
                        productCategories?.length > 0 &&
                        <View style={{ flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Categories</Text>
                            <Text style={{...pdfStyles.minInfo }}>{productCategories.map((category) => category.name).join(', ')}</Text>
                        </View>
                    }
                    <View style={{ flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed By</Text>
                        <Text style={{...pdfStyles.minInfo }}>{user.name}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed On</Text>
                        <Text style={{...pdfStyles.minInfo }}>{readableDate(undefined,true)}</Text>
                    </View>
                </View>
                <View style={pdfStyles.table}>
                    <View style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 0.5 }}>S/N</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 3 }}>Product Name</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Unit</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 2 }}>Balance</Text>
                        { hasPermissionToView &&
                            <>
                                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 2 }}>Latest Rate</Text>
                                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 2 }}>Amount</Text>
                            </>
                        }
                    </View>
                    {stockData.map((stock, index) => {
                        return (
                        <View key={index} style={pdfStyles.tableRow}>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 0.5 }}>{index+1}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 3 }}>{stock.name}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1}}>{stock.measurement_unit.symbol}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 2, textAlign: 'right' }}>{stock.balance.toLocaleString()}</Text>
                            { hasPermissionToView &&
                                <>
                                    <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 2, textAlign: 'right' }}>{stock.latest_rate.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                    <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 2, textAlign: 'right' }}>{(stock.balance * stock.latest_rate).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                </>
                            }
                        </View>
                        );
                    })}
                    <View style={pdfStyles.tableRow}>
                        { hasPermissionToView &&
                            <>
                                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, textAlign: 'center', flex: 9.3}}>Total</Text>
                                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, textAlign: 'right', flex: 2 }}>{totalAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                            </>
                        }
                    </View>
                </View>
            </Page>
    </Document>
    ) : ''
}

function StockReport({ setOpenDialog, isFromDashboard }) {
    const classes = useProsERPStyles();
    const [today] = useState(dayjs());
    const authObject = useJumboAuth();
    const { authOrganization } = authObject;
    const { activeStore } = useStoreProfile();
    const [costCenter, setCostCenter] = useState(authOrganization.costCenters);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [stockAvailable, setStockAvailable] = useState([]);

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const {checkOrganizationPermission} = useJumboAuth();
    const hasPermissionToView = checkOrganizationPermission(PERMISSIONS.ACCOUNTS_REPORTS)

    const validationSchema = yup.object().shape({
        store_id: yup.number().when('isFromDashboard', {
            is: true,
            then: yup.number().required('Store is required').typeError('Store is required'),
            otherwise: yup.number().nullable(),
        }),
    });

    const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            as_at: dayjs().toISOString(),
            isFromDashboard: isFromDashboard || false,
            store_id: isFromDashboard ? null : activeStore?.id,
            cost_center_ids: authOrganization.costCenters.map(cost_center => cost_center.id),
        },
        resolver: yupResolver(validationSchema),
    });

    const getAvailableStock = async (filters) => {
        setIsFetching(true);
        const fetchStock = await storeServices.getStock(filters);
        setStockAvailable(fetchStock);
        setIsFetching(false);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

  document.title = isFromDashboard ? 'Store Stock Report' : `${activeStore?.name} | Stock Report`;

    const {data: productCategories, isLoading: isLoadingProductCategories} = useQuery('productCategoryOptions',productCategoryServices.getCategoryOptions);

    if (isLoadingProductCategories) {
        return <LinearProgress/>;
    }

  return (
        <React.Fragment>
            <DialogTitle textAlign={'center'}>
                <Span className={classes.hiddenOnPrint}>
                    <form autoComplete='off' onSubmit={handleSubmit(getAvailableStock)} >
                        <Grid container columnSpacing={1} paddingTop={2} rowSpacing={1}>
                            <Grid container>
                                <Grid item xs={belowLargeScreen ? 11 : 12}>
                                    <Typography variant="h3">Stock Report</Typography>
                                </Grid>
                                {belowLargeScreen && (
                                    <Grid item xs={1} textAlign="right">
                                        <Tooltip title="Close">
                                            <IconButton 
                                                size='small' 
                                                sx={{ mb: 1 }} 
                                                onClick={() => setOpenDialog(false)}
                                            >
                                                <HighlightOff color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )}
                            </Grid>
                            {isFromDashboard &&
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Div sx={{ mt: 0.3 }}>
                                            <StoreSelector
                                                allowSubStores={true}
                                                label="Store"
                                                frontError={errors.store_id}
                                                proposedOptions={authOrganization?.stores}
                                                onChange={(newValue) => {
                                                    setValue(`store`, newValue);
                                                    setValue(`store_id`, newValue ? newValue.id : '', {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    });
                                                    const filters = {
                                                        as_at: watch('as_at'),
                                                        store_id: newValue.id,
                                                        cost_center_ids: watch('cost_center_ids'),
                                                    };
                                                    getAvailableStock(filters);
                                                }}
                                            />
                                        </Div>
                                    </Grid>
                            }
                            <Grid item xs={12} md={isFromDashboard ? 6 : 4} lg={isFromDashboard ? 6 : 4}>
                                <Div sx={{ mt: 0.3 }}>
                                        <CostCenterSelector
                                            label="Cost and Profit Centers"
                                            multiple={true}
                                            allowSameType={true}
                                            onChange={(cost_centers) => {
                                                let selectedCostCenters, selectedCostCenterIds;
                    
                                                if (cost_centers.length === 0) {
                                                    // If all options are deselected, set to all cost centers
                                                    selectedCostCenters = authOrganization.costCenters.map(cost_center => cost_center);
                                                    selectedCostCenterIds = authOrganization.costCenters.map(cost_center => cost_center.id);
                                                } else {
                                                    // Otherwise, use the selected cost centers
                                                    selectedCostCenters = cost_centers.map((cost_center) => cost_center);
                                                    selectedCostCenterIds = cost_centers.map((cost_center) => cost_center.id);
                                                }
                    
                                                setCostCenter(selectedCostCenters);
                                                setValue('cost_center_ids', selectedCostCenterIds);
                                                const filters = {
                                                    as_at: watch('as_at'),
                                                    store_id: watch('store_id'),
                                                    cost_center_ids: selectedCostCenterIds,
                                                    product_category_ids: watch('product_category_ids'),
                                                };
                                                getAvailableStock(filters);
                                            }}
                                        />
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={isFromDashboard ? 6 : 4} lg={isFromDashboard ? 6 : 4}>
                                <Div sx={{ mt: 0.3 }}>
                                    <Autocomplete
                                        multiple
                                        id="product-categories-select"
                                        options={productCategories}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props} key={`${option.id}-${props.id}`}>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                    checkedIcon={<CheckBox fontSize="small" />}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                    size="small"
                                                />
                                                <Typography variant="body2">{option.name}</Typography>
                                            </li>
                                        )}
                                        renderTags={(value, getTagProps) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {value.map((option, index) => (
                                                    <Chip
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                        label={option.name}
                                                        size="small"
                                                        sx={{ maxWidth: 200 }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Product Categories"
                                                size="small"
                                                fullWidth
                                            />
                                        )}
                                        onChange={(event, newValue) => {
                                            const categoryIds = newValue.map(category => category.id);
                                            const categories = newValue.map(category => category);
                                            setValue('product_category_ids', categoryIds);
                                            setValue('product_categories', categories);
                                            getAvailableStock({
                                                as_at: watch('as_at'),
                                                store_id: watch('store_id'),
                                                cost_center_ids: watch('cost_center_ids'),
                                                product_category_ids: categoryIds,
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={isFromDashboard ? 6 : 4} lg={isFromDashboard ? 6 : 4}>
                                <Div sx={{ mt: 0.3 }}>
                                        <DateTimePicker
                                            label="As at (MM/DD/YYYY HH:MM)"
                                            fullWidth
                                            maxDate={dayjs()}
                                            minDate={dayjs(authOrganization.organization.recording_start_date)}
                                            defaultValue={today}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true
                                                }
                                            }}
                                            onChange={(newValue) => {
                                                setValue('as_at', newValue ? newValue.toISOString() : null, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                    
                                                const filters = {
                                                    as_at: newValue.toISOString(),
                                                    store_id: watch('store_id'),
                                                    cost_center_ids: watch('cost_center_ids'),
                                                    product_category_ids: watch('product_category_ids'),
                                                };
                                                getAvailableStock(filters);
                                            }}
                                        />
                                </Div>
                            </Grid>
                            <Grid item xs={12} textAlign={'right'}>
                                <LoadingButton loading={isFetching} type='submit' size='small' variant='contained'>
                                    Filter
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </form>
                    {belowLargeScreen && !isFetching && stockAvailable.length > 0 && (
                        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                            <Tab label="On-Screen" />
                            <Tab label="PDF" />
                        </Tabs>
                    )}
                </Span>
            </DialogTitle>
            <DialogContent>
                {isFetching && <LinearProgress />}
                {!isFetching && stockAvailable.length > 0 && (
                    <React.Fragment>
                            {belowLargeScreen && selectedTab === 0 ? 
                                <StockReportOnScreen
                                    stockData={stockAvailable}
                                    authObject={authObject}
                                    hasPermissionToView={hasPermissionToView}
                                />
                                :
                                <PDFContent
                                        document={
                                            <ReportDocument
                                                stockData={stockAvailable}
                                                authObject={authObject}
                                                store={isFromDashboard ? watch('store') : activeStore}
                                                productCategories={watch('product_categories')}
                                                costCenter={costCenter}
                                                date={watch('as_at')}
                                                hasPermissionToView={hasPermissionToView}
                                            />
                                        }
                                        fileName={isFromDashboard ? watch('store')?.name : `${activeStore?.name} Stock Report ${readableDate(dayjs().toISOString())}`}
                                />
                            }
                    </React.Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button sx={{ mt: 1 }} size='small' variant='outlined' onClick={() => setOpenDialog(false)}>
                    Close
                </Button>
            </DialogActions>
        </React.Fragment>
  );
}

export default StockReport;
