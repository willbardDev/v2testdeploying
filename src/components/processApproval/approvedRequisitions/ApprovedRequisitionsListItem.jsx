import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Chip,
  Grid,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import ApprovedPurchaseActionTail from './approvedPurchase/ApprovedPurchaseActionTail';
import ApprovedPurchaseListItem from './approvedPurchase/ApprovedPurchaseListItem';
import ApprovedPaymentActionTail from './approvedPayment/ApprovedPaymentActionTail';
import ApprovedPaymentListItem from './approvedPayment/ApprovedPaymentListItem';
import ApprovalItemAction from '../listItem/tabs/ApprovalItemAction';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { CreditScoreOutlined, ShoppingCartOutlined, VerifiedRounded } from '@mui/icons-material';

const ApprovedRequisitionsListItem = ({ approvedRequisition }) => {
  const [expanded, setExpanded] = useState({});
  const {checkOrganizationPermission} = useJumboAuth();

  const handleChange = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const paymentsOrPurchasesCount = (approvedRequisition.process_type === 'PAYMENT'
    ? approvedRequisition.payments_count
    : approvedRequisition.purchase_orders_count);
  
  return (
    <Accordion
        key={approvedRequisition.id}
        expanded={!!expanded[approvedRequisition.id]}
        onChange={() => handleChange(approvedRequisition.id)}
        square
        sx={{ 
            borderRadius: 2, 
            borderTop: 2,
            borderColor: 'divider',
            '&:hover': {
                bgcolor: 'action.hover',
            },
        }}
    >
      <AccordionSummary
            expandIcon={expanded[approvedRequisition.id] ? <RemoveIcon /> : <AddIcon />}
            sx={{
                px: 2,
                flexDirection: 'row-reverse',
                '.MuiAccordionSummary-content': {
                    alignItems: 'center',
                    '&.Mui-expanded': {
                        margin: '10px 0',
                    }},
                '.MuiAccordionSummary-expandIconWrapper': {
                    borderRadius: 1,
                    border: 1,
                    color: 'text.secondary',  
                    transform: 'none',
                    mr: 0.5,
                    '&.Mui-expanded': {
                        transform: 'none',
                        color: 'primary.main',
                        borderColor: 'primary.main',
                    },
                    '& svg': {
                        fontSize: '0.9rem',
                    },
                },
            }}
      >
        <Grid 
            paddingLeft={1}
            paddingRight={1}
            spacing={1}
            alignItems={'center'}
            container
        >
            <Grid item xs={12} md={2}>
                <Tooltip title='Requistion No.'>
                    <Typography>{approvedRequisition.requisition.requisitionNo}</Typography>
                </Tooltip>
                <Tooltip title='Approval Date'>
                    <Typography variant='caption'>{readableDate(approvedRequisition.approval_date)}</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={12} md={2.5}>
                <Tooltip title='Process'>
                    <Typography>
                       {approvedRequisition.process_type}
                    </Typography>
                </Tooltip>
                <Tooltip title={'Cost Center'}>
                    <Chip
                        size="small"
                        label={approvedRequisition.requisition.cost_center?.name}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={12} md={4} lg={4.8}>
                <ListItemText
                    secondary={
                    <Tooltip title={'Remarks'}>
                        <Typography variant={"span"} fontSize={14} mb={0}
                        flexWrap>{approvedRequisition.remarks}
                        </Typography>
                    </Tooltip>
                    }
                />
            </Grid>
            <Grid item xs={8} md={2.5} lg={1.7}>
                <Tooltip title='Amount'>
                    <Typography>
                        {(approvedRequisition.amount + approvedRequisition.vat_amount)?.toLocaleString('en-US', 
                            {
                                style: 'currency',
                                currency: approvedRequisition.currency?.code,
                            })
                        }
                    </Typography>
                </Tooltip>
                <Tooltip title='Status'>
                    <Chip
                        size='small' 
                        label={approvedRequisition?.status_label}
                        color={'success'}                
                    /> 
                </Tooltip>
            </Grid>
            <Grid item xs={4} md={1}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                >
                    {
                        ((
                            (!!approvedRequisition?.is_fully_paid || !!approvedRequisition?.is_fully_ordered) && paymentsOrPurchasesCount > 1
                        ) ||
                        (
                            (!approvedRequisition?.is_fully_paid && !approvedRequisition?.is_fully_ordered) && paymentsOrPurchasesCount > 0
                        ))
                    && 
                    (
                    <Tooltip
                        title={
                        approvedRequisition.process_type === 'PAYMENT'
                            ? 'Payments Count'
                            : 'Purchase Orders Count'
                        }
                    >
                        <Badge
                        badgeContent={
                            approvedRequisition.process_type === 'PAYMENT'
                            ? approvedRequisition.payments_count
                            : approvedRequisition.purchase_orders_count
                        }
                        color="info"
                        >
                        {approvedRequisition.process_type === 'PAYMENT' ? (
                            <CreditScoreOutlined fontSize="small" />
                        ) : (
                            <ShoppingCartOutlined fontSize="small" />
                        )}
                        </Badge>
                    </Tooltip>
                    )}

                    {(approvedRequisition.process_type === 'PAYMENT'
                    ? approvedRequisition.is_fully_paid
                    : approvedRequisition.is_fully_ordered) && (
                    <Tooltip
                        title={
                        approvedRequisition.process_type === 'PAYMENT'
                            ? 'Fully Paid'
                            : 'Fully Ordered'
                        }
                    >
                        <VerifiedRounded fontSize="small" color="success" />
                    </Tooltip>
                    )}
                </Stack>
            </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails
        sx={{ 
          backgroundColor:'background.paper',
          marginBottom: 3
        }}
      >
        <Grid container spacing={1}>
            <Grid item xs={12} textAlign={'end'}>
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item>
                        <ApprovalItemAction approval={approvedRequisition} hideOtherActions={true} />
                    </Grid>
                    <Grid item>
                        {!approvedRequisition.is_fully_ordered &&
                            checkOrganizationPermission([PERMISSIONS.APPROVED_REQUISITIONS_PURCHASE]) && approvedRequisition.process_type === 'PURCHASE' &&
                            <ApprovedPurchaseActionTail
                                approvedRequisition={approvedRequisition}
                                isExpanded={expanded[approvedRequisition.id]}
                            />
                        }
                        {!approvedRequisition.is_fully_paid &&
                            checkOrganizationPermission([PERMISSIONS.APPROVED_REQUISITIONS_PAY]) && approvedRequisition.process_type === 'PAYMENT' &&
                            <ApprovedPaymentActionTail
                                approvedRequisition={approvedRequisition}
                                isExpanded={expanded[approvedRequisition.id]}
                            />
                        }
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {approvedRequisition.process_type === 'PURCHASE' ? (
                    <ApprovedPurchaseListItem
                        approvedRequisition={approvedRequisition}
                        isExpanded={expanded[approvedRequisition.id]}
                    />
                ) : (
                    <ApprovedPaymentListItem
                        approvedRequisition={approvedRequisition}
                        isExpanded={expanded[approvedRequisition.id]}
                    />
                )}
            </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ApprovedRequisitionsListItem;
