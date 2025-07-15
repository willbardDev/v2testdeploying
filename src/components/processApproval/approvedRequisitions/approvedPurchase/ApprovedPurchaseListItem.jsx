import React from 'react';
import { useQuery } from 'react-query';
import requisitionsServices from '../../requisitionsServices';
import { Chip, Grid, LinearProgress, Tooltip, Typography, Alert, Box } from '@mui/material';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import ApprovedPurchaseItemAction from './ApprovedPurchaseItemAction';

function ApprovedPurchaseListItem({ approvedRequisition, isExpanded }) {
    const { checkOrganizationPermission } = useJumboAuth();

    const { data: approvedPurchaseOrders, isFetching } = useQuery(
        ['approvedPurchaseOrders', { id: approvedRequisition.id }],
        async () => requisitionsServices.getApprovedPurchaseOrders(approvedRequisition.id),
        {
            enabled: !!isExpanded,
        }
    );

    if (isFetching) {
        return <LinearProgress />;
    }

    if (!approvedPurchaseOrders || approvedPurchaseOrders.length === 0) {
        return (
            <Alert variant={'outlined'} severity={'info'}>
                No orders present.
            </Alert>
        );
    }

    return (
        <>
            <Typography>Orders</Typography>
            {approvedPurchaseOrders.map((order) => (
                <Grid
                    key={order.id}
                    container
                    paddingLeft={1}
                    paddingRight={1}
                    columnSpacing={1}
                    alignItems={'center'}
                    sx={{
                        cursor: 'pointer',
                        borderTop: 1,
                        borderColor: 'divider',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Grid item xs={6} md={2.5}>
                        <Tooltip title="Order No.">
                            <Typography>{order.orderNo}</Typography>
                        </Tooltip>
                        <Tooltip title="Date">
                            <Typography variant="caption">{readableDate(order.order_date)}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Tooltip title="Supplier">
                            <Typography>{order.stakeholder.name}</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4.5}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Tooltip title="Status">
                            <Chip
                                size="small"
                                label={order.status}
                                color={
                                    order.status === 'Completed' ||
                                    order.status === 'Fully Received' ||
                                    order.status === 'Instantly Received'
                                        ? 'success'
                                        : order.status === 'Partially Received'
                                        ? 'warning'
                                        : order.status === 'Closed'
                                        ? 'info'
                                        : 'primary'
                                }
                            />
                        </Tooltip>
                        {checkOrganizationPermission(PERMISSIONS.PURCHASES_CREATE) && (
                            <Tooltip title="Amount">
                                <Typography>
                                    {(order.amount + order.vat_amount).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: order.currency.code,
                                    })}
                                </Typography>
                            </Tooltip>
                        )}
                    </Grid>
                    <Grid item xs={12} md={1} textAlign={'end'}>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} > 
                            <ApprovedPurchaseItemAction order={order} approvedRequisition={approvedRequisition}/>
                        </Box>
                    </Grid>
                </Grid>
            ))}
        </>
    );
}

export default ApprovedPurchaseListItem;
