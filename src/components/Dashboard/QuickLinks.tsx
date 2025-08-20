import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick'
import { AutoStoriesOutlined, FormatListNumberedRtl, Inventory2Outlined, ListOutlined, LocalGasStation, PointOfSaleOutlined, QrCodeOutlined, QrCode2Rounded, ReceiptOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import React from 'react'
import DashboardQuickLink from '../procurement/reports/productInsights/DashboardQuickLink'
import { useJumboAuth } from '@/app/providers/JumboAuthProvider'
import { MODULES } from '@/utilities/constants/modules'
import { PERMISSIONS } from '@/utilities/constants/permissions'
import { useRouter } from 'next/navigation'

function QuickLinks() {
    const router = useRouter();
    const { checkOrganizationPermission, organizationHasSubscribed } = useJumboAuth();
    
    return (
        <JumboCardQuick
            title={'Quick Links'}
        >
            <Grid container columnSpacing={1} rowSpacing={1} justifyContent={'center'}>
                {
                    organizationHasSubscribed(MODULES.PROJECT_MANAGEMENT) && checkOrganizationPermission([
                        PERMISSIONS.PROJECTS_READ,
                        PERMISSIONS.PROJECTS_CREATE,
                        PERMISSIONS.PROJECTS_EDIT,
                        PERMISSIONS.PROJECTS_DELETE
                    ]) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/projects')}
                    >
                        <ListOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Projects</Typography>
                    </Grid>
                }
                {
                    organizationHasSubscribed(MODULES.MANUFACTURING_AND_PROCESSING) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/production-batches')}
                    >
                        <QrCodeOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Batches</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.FUEL_STATION) && checkOrganizationPermission([
                        PERMISSIONS.FUEL_SALES_SHIFT_READ,
                        PERMISSIONS.FUEL_SALES_SHIFT_CREATE,
                        PERMISSIONS.FUEL_SALES_SHIFT_UPDATE,
                        PERMISSIONS.FUEL_SALES_SHIFT_DELETE,
                        PERMISSIONS.FUEL_SALES_SHIFT_CLOSE
                    ])) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/fuel-station/sales-shifts')}
                    >
                        <LocalGasStation sx={{ fontSize: '40px' }} />
                        <Typography>Sales Shift</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.POINT_OF_SALE) && checkOrganizationPermission([
                        PERMISSIONS.SALES_READ,
                        PERMISSIONS.SALES_CREATE,
                        PERMISSIONS.SALES_EDIT,
                        PERMISSIONS.SALES_COMPLETE
                    ])) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/pos/counter')}
                    >
                        <PointOfSaleOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Sales</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY) && checkOrganizationPermission([
                        PERMISSIONS.PURCHASES_READ,
                        PERMISSIONS.PURCHASES_CREATE,
                        PERMISSIONS.PURCHASES_RECEIVE
                    ])) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/purchase_orders')}
                    >
                        <ShoppingCartOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Purchases</Typography>
                    </Grid>
                }
                {
                    organizationHasSubscribed(MODULES.PROCESS_APPROVAL) && 
                    checkOrganizationPermission([
                        PERMISSIONS.REQUISITIONS_READ,
                        PERMISSIONS.REQUISITIONS_CREATE,
                        PERMISSIONS.REQUISITIONS_EDIT
                    ]) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/requisitions')}
                    >
                        <FormatListNumberedRtl sx={{ fontSize: '40px' }} />
                        <Typography>Requisitions</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.ACCOUNTS_AND_FINANCE) && checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ)) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/accounts/transactions')}
                    >
                        <ReceiptOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Transactions</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.ACCOUNTS_AND_FINANCE) && checkOrganizationPermission(PERMISSIONS.ACCOUNTS_MASTERS_READ)) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/accounts/ledgers')}
                    >
                        <AutoStoriesOutlined sx={{ fontSize: '40px' }} />
                        <Typography>Ledgers</Typography>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY) && checkOrganizationPermission([
                        PERMISSIONS.STORES_READ,
                        PERMISSIONS.STORES_CREATE
                    ])) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/procurement/stores')}
                    >
                        <Inventory2Outlined sx={{ fontSize: '40px' }} />
                        <Typography>Stores</Typography>
                    </Grid>
                }
                {
                    ((organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY) && checkOrganizationPermission([
                        PERMISSIONS.STORES_REPORTS, 
                        PERMISSIONS.PURCHASES_REPORTS,
                        PERMISSIONS.ACCOUNTS_REPORTS
                    ], true))) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                    >
                        <DashboardQuickLink/>
                    </Grid>
                }
                {
                    (organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY) && checkOrganizationPermission([
                        PERMISSIONS.PRODUCTS_READ,
                        PERMISSIONS.PRODUCTS_CREATE,
                        PERMISSIONS.PRODUCTS_EDIT
                    ])) &&
                    <Grid 
                        size={{ xs: 6, md: 2, lg: 1.5 }} 
                        p={1}
                        textAlign={'center'}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                        onClick={() => router.push('/products')}
                    >
                        <QrCode2Rounded sx={{ fontSize: '40px' }} />
                        <Typography>Products</Typography>
                    </Grid>
                }
            </Grid>
        </JumboCardQuick>
    )
}

export default QuickLinks