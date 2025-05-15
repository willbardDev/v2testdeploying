import JumboDdMenu from '@jumbo/components/JumboDdMenu';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { AttachmentOutlined, DeleteOutlined, EditOutlined, HighlightOff, MoreHorizOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import paymentServices from './payment-services';
import PaymentFormDialogContent from './PaymentFormDialogContent';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import PaymentPDF from './PaymentPDF';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import AttachmentForm from 'app/prosServices/prosERP/filesShelf/attachments/AttachmentForm';
import PaymentOnScreenPreview from './PaymentOnScreenPreview';
import { useJumboTheme } from '@jumbo/hooks';
import dayjs from 'dayjs';

const DocumentDialog = ({ transaction, authObject, setOpenDocumentDialog }) => {
  const { data, isFetching } = useQuery(['payment', { id: transaction.id }], () => paymentServices.show(transaction.id));
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
          fileName={transaction.voucherNo}
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

const AttachDialog= ({transaction, setAttachDialog}) => {
  return (
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={transaction.voucherNo} attachmentable_type={'payment'} attachment_name={'Payment'} attachmentable_id={transaction.id}/>
  )
}

function PaymentItemAction({transaction}) {
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false)
  const {showDialog,hideDialog} = useJumboDialog();
  const {enqueueSnackbar} = useSnackbar();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [attachDialog, setAttachDialog] = useState(false);
  const authObject = useJumboAuth();
  const queryClient = useQueryClient();

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const checkOrganizationPermission = authObject.checkOrganizationPermission;
  const deletePayment = useMutation(paymentServices.delete,{
    onSuccess: (data) => {
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['transactions']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
    },
  });

  const menuItems = [
    (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,PERMISSIONS.PAYMENTS_READ]) && {icon: <VisibilityOutlined/> , title : "View" , action : "open"}),
    {icon: <AttachmentOutlined/> , title : "Attach" , action : "attach"},
    (!transaction.requisition_approval_id && checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.PAYMENTS_EDIT]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.PAYMENTS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString())) ? {icon: <EditOutlined/>, title: 'Edit', action: 'edit'} : null,
    (!transaction.requisition_approval_id && checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,PERMISSIONS.PAYMENTS_DELETE]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.PAYMENTS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString()))  ? {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'} : null
  ].filter(item => item !== null);

  const EditPaymentDialog = () => {
    const {data:payment,isFetching} = useQuery(['payment',{id:transaction.id}],() => paymentServices.show(transaction.id));
    if(isFetching){
      return <LinearProgress/>;
    }
    return (
      <PaymentFormDialogContent setOpen={setOpenEditDialog} payment={payment} />
    );
  }

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'delete':
        showDialog({
          title : 'Confirm Delete?',
          content: 'If you say yes, this payment will be deleted',
          onYes: () => {
            hideDialog();
            deletePayment.mutate(transaction);
          },
          onNo: () => hideDialog(),
          variant: 'confirm'
        })
        break;
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'attach':
        setAttachDialog(true);
        break;
      case 'open':
        setOpenDocumentDialog(true);
        break;
        default:
          break;
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={openEditDialog || openDocumentDialog || attachDialog}
        scroll={'paper'}
        fullScreen={belowLargeScreen}
        fullWidth
        onClose={() => setOpenDocumentDialog(false)}
        maxWidth={openEditDialog ? 'lg' : 'md'}
      >
        {openEditDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.PAYMENTS_EDIT]) ? <EditPaymentDialog/> : <UnauthorizedAccess/>)}
        {openDocumentDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,PERMISSIONS.PAYMENTS_READ]) ? <DocumentDialog transaction={transaction} authObject={authObject} setOpenDocumentDialog={setOpenDocumentDialog}/> : <UnauthorizedAccess/>)}
        {attachDialog && <AttachDialog transaction={transaction} authObject={authObject} setAttachDialog={setAttachDialog}/>}
      </Dialog>
      
      <JumboDdMenu
        icon={
          <Tooltip title='Actions'>
            <MoreHorizOutlined/>
          </Tooltip>
      }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </React.Fragment>
  );
}

export default PaymentItemAction