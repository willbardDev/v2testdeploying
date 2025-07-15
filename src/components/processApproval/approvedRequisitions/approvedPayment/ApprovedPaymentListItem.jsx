import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Grid, LinearProgress, Tooltip, Typography, Alert, IconButton, Dialog, useMediaQuery, Tabs, Tab, DialogContent, Button, Box, ListItemText } from '@mui/material';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { HighlightOff } from '@mui/icons-material';
import { useJumboTheme } from '@jumbo/hooks';
import requisitionsServices from '../../requisitionsServices';
import PaymentOnScreenPreview from 'app/prosServices/prosERP/accounts/transactions/payments/PaymentOnScreenPreview';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import PaymentPDF from 'app/prosServices/prosERP/accounts/transactions/payments/PaymentPDF';
import paymentServices from 'app/prosServices/prosERP/accounts/transactions/payments/payment-services';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import ApprovedPaymentItemAction from './ApprovedPaymentItemAction';

const DocumentDialog = ({ payment, authObject, setOpenDocumentDialog }) => {
  const { data, isFetching } = useQuery(['payment', { id: payment.id }], () => paymentServices.show(payment.id));
  const [activeTab, setActiveTab] = useState(0);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  if (isFetching) {
    return <LinearProgress />;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <DialogContent>
      {belowLargeScreen && (
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={11}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="Payment View Tabs"
            >
              <Tab label="ONSCREEN" />
              <Tab label="PDF" />
            </Tabs>
          </Grid>

          <Grid item xs={1} textAlign="right">
            <Tooltip title="Close">
              <IconButton 
                size="small" 
                onClick={() => setOpenDocumentDialog(false)}
              >
                <HighlightOff color="primary" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      )}
      {belowLargeScreen && activeTab === 0 ?
        <PaymentOnScreenPreview transaction={data} authObject={authObject} /> 
        :
        <PDFContent
          fileName={payment.voucherNo}
          document={<PaymentPDF transaction={data} authObject={authObject} />}
        />
      }
      <Box textAlign="right" marginTop={5}>
        <Button variant="outlined" size='small' color="primary" onClick={() => setOpenDocumentDialog(false)}>
        Close
        </Button>
      </Box>
    </DialogContent>
  );
};

function ApprovedPaymentListItem({ approvedRequisition, isExpanded }) {
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const { checkOrganizationPermission } = useJumboAuth();
    const {theme} = useJumboTheme();
    const authObject = useJumboAuth();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const [selectedPayment, setSelectedPayment] = React.useState(null);

    const { data: approvedPayments, isFetching } = useQuery(
        ['approvedPayments', { id: approvedRequisition.id }],
        async () => requisitionsServices.getApprovedPayments(approvedRequisition.id),
        {
            enabled: !!isExpanded,
        }
    );

    if (isFetching) {
        return <LinearProgress />;
    }

    if (!approvedPayments || approvedPayments.length === 0) {
      return (
        <Alert variant={'outlined'} severity={'info'}>
          No payments present.
        </Alert>
      );
    }

    return (
        <>
            <Typography>Payments</Typography>
            {approvedPayments.map((pay) => (
                <Grid
                    key={pay.id}
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
                    container
                >
                  <Grid item xs={6} md={3} lg={2}>
                    <ListItemText
                        primary={
                            <Tooltip title={'Date'}>
                                <Typography variant={"span"} lineHeight={1.25} mb={0}
                                    noWrap>{readableDate(pay.transaction_date)}
                                </Typography>
                            </Tooltip>
                        }
                    />
                  </Grid>
                  <Grid item xs={6} md={3} lg={3}>
                      <ListItemText
                          primary={
                              <Tooltip title={'Voucher Number'}>
                                  <Typography variant={"h5"} fontSize={14} lineHeight={1.25} mb={0} noWrap>
                                      {pay.voucherNo}
                                  </Typography>
                              </Tooltip>
                          }
                          secondary={
                              <Tooltip title={'Reference'}>
                                  <Typography variant={"span"} fontSize={14} lineHeight={1.25} mb={0} >
                                      {pay.reference}
                                  </Typography>
                              </Tooltip>
                          }
                      />
                  </Grid>
                  <Grid item xs={12} md={3} lg={3}>
                    <ListItemText
                      secondary={
                        <Tooltip title={'Narration'}>
                          <Typography variant={"span"} lineHeight={1.25} mb={0}>
                            {pay.narration}
                          </Typography>
                        </Tooltip>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={2} lg={3} 
                    sx={{ 
                      display: 'flex',
                      flexDirection:'row',
                      alignItems:'center',justifyContent:'flex-end'
                    }}
                  >
                    <Tooltip title={'Amount'}>
                      <Box sx={{ marginRight:1 }}>
                        <Typography variant={"h5"} fontSize={14} lineHeight={1.25} mb={0} noWrap>
                          {pay.journals_sum_amount.toLocaleString("en-US", {style:"currency", currency:pay.currency.code})}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                    <Grid item xs={12} md={1} textAlign={'end'}>
                      <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} > 
                        <ApprovedPaymentItemAction payment={pay} approvedRequisition={approvedRequisition}/>
                      </Box>
                    </Grid>
                </Grid>
            ))}

            <Dialog
                open={openDocumentDialog}
                fullWidth
                fullScreen={belowLargeScreen}
                maxWidth="md"
                onClose={() => {
                    setOpenDocumentDialog(false);
                    setSelectedPayment(null);
                }}
                scroll={belowLargeScreen ? 'body' : 'paper'}
            >
              {openDocumentDialog && (checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ) ? <DocumentDialog payment={selectedPayment} authObject={authObject} setOpenDocumentDialog={setOpenDocumentDialog}/> : <UnauthorizedAccess/>)}
            </Dialog>
        </>
    );
}

export default ApprovedPaymentListItem;
