import { DeleteOutlined, EditOutlined, HighlightOff, MoreHorizOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import requisitionsServices from '../../requisitionsServices';
import ApprovedPaymentForm from './form/ApprovedPaymentForm';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import paymentServices from '@/components/accounts/transactions/payments/payment-services';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import PaymentOnScreenPreview from '@/components/accounts/transactions/payments/PaymentOnScreenPreview';
import PDFContent from '@/components/pdf/PDFContent';
import PaymentPDF from '@/components/accounts/transactions/payments/PaymentPDF';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useSnackbar } from 'notistack';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';
import { JumboDdMenu } from '@jumbo/components';

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
              <Tooltip title="Cancel">
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

const EditPayment = ({payment, toggleOpen, approvedRequisition}) => {
  const {data:paymentData, isFetching} = useQuery(['payment',{id:payment.id}],() => paymentServices.show(payment.id));
  const { data: approvedRequisitionDetails, isFetching: fetchDetails } = useQuery(
    ['requisitionDetails', { id: approvedRequisition.id }],
    async () => requisitionsServices.getApprovedRequisitionDetails(approvedRequisition.id),
  );

  if(isFetching || fetchDetails){
    return <LinearProgress/>;
  }

  return (
    <ApprovedPaymentForm toggleOpen={toggleOpen} prevApprovedDetails={approvedRequisitionDetails} payment={paymentData} />
  )
}

const ApprovedPurchaseItemAction = ({approvedRequisition, payment}) => {
    const {showDialog,hideDialog} = useJumboDialog();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

    const authObject = useJumboAuth();
    const checkOrganizationPermission = authObject.checkOrganizationPermission;

    const { mutate: deleteApprovedPaymentOrder } = useMutation(paymentServices.delete, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['approvedPayments']);
            queryClient.invalidateQueries(['approvedRequisitions']);
            enqueueSnackbar(data.message, {
                variant: 'success',
            });
        },
        onError: (error) => {
            enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const menuItems = [
        {icon: <VisibilityOutlined/> , title: "View", action: "open"},
        (checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE) || payment.transaction_date >= dayjs().startOf('date').toISOString()) && {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
        (checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE) || payment.transaction_date >= dayjs().startOf('date').toISOString()) && {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];

    const handleItemAction = (menuItem) => {
        switch (menuItem.action) {
            case 'open':
                setOpenDocumentDialog(true);
                break;
            case 'edit':
                setOpenEditDialog(true);
                break;
            case 'delete':
                showDialog({
                title: 'Confirm Order',
                content: 'Are you sure you want to delete this Payment?',
                onYes: () =>{ 
                    hideDialog();
                    deleteApprovedPaymentOrder(payment)
                },
                onNo: () => hideDialog(),
                   variant:'confirm'
                });
                break;
                default:
                break;
        }
    }

  return (
    <>
        <Dialog
          open={openDocumentDialog || openEditDialog}
          scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
          fullWidth
          fullScreen={belowLargeScreen}
          maxWidth={openDocumentDialog ? "md" : 'lg'} 
          onClose={() => {
            setOpenDocumentDialog(false);
          }}
        >
        {openEditDialog && (checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT) ? <EditPayment approvedRequisition={approvedRequisition} payment={payment} toggleOpen={setOpenEditDialog}/> : <UnauthorizedAccess/>)}
        {openDocumentDialog && (checkOrganizationPermission(PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ) ? <DocumentDialog payment={payment} authObject={authObject} setOpenDocumentDialog={setOpenDocumentDialog}/> : <UnauthorizedAccess/>)}
        </Dialog>

        <JumboDdMenu
            icon={
                <Tooltip title='Actions'>
                    <MoreHorizOutlined fontSize='small'/>
                </Tooltip>
            }
                menuItems={menuItems}
                onClickCallback={handleItemAction}
        />
    </>
  );
};

export default ApprovedPurchaseItemAction;
