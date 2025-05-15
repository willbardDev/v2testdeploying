import JumboDdMenu from '@jumbo/components/JumboDdMenu';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { AttachmentOutlined, DeleteOutlined, EditOutlined, HighlightOff, MoreHorizOutlined,VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import receiptServices from './receipt-services';
import ReceiptFormDialogContent from './ReceiptFormDialogContent';
import ReceiptInvoicePDF from './ReceiptPDF';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import AttachmentForm from 'app/prosServices/prosERP/filesShelf/attachments/AttachmentForm';
import ReceiptOnScreen from './ReceiptOnScreen';
import { useJumboTheme } from '@jumbo/hooks';
import dayjs from 'dayjs';

const DocumentDialog = ({ transaction, authObject, setOpenDocumentDialog }) => {
  const {data,isFetching} = useQuery(['receipt',{id: transaction.id}],() => receiptServices.show(transaction.id));
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
              aria-label="receipt View Tabs"
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
        <ReceiptOnScreen transaction={data} authObject={authObject} /> 
        :
        <PDFContent
          document={<ReceiptInvoicePDF transaction={data} authObject={authObject} />}
          fileName={transaction.voucherNo}
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
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={transaction.voucherNo} attachmentable_type={'receipt'} attachment_name={'Receipt Voucher'} attachmentable_id={transaction.id}/>
  )
}

function ReceiptItemAction({transaction}) {
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false)
  const {showDialog,hideDialog} = useJumboDialog();
  const {enqueueSnackbar} = useSnackbar();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [attachDialog, setAttachDialog] = useState(false);
  const queryClient = useQueryClient();
  const authObject = useJumboAuth();
  const checkOrganizationPermission = authObject.checkOrganizationPermission;

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const deleteReceipt = useMutation(receiptServices.delete,{
    onSuccess: (data) => {
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['transactions']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
    },
  });

  const menuItems = [
    (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_MASTERS_READ,PERMISSIONS.RECEIPTS_READ]) && {icon: <VisibilityOutlined/> , title : 'View' , action : 'open'}),
    {icon: <AttachmentOutlined/> , title : "Attach" , action : "attach"},
    checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.RECEIPTS_EDIT]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.RECEIPTS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString()) ? {icon: <EditOutlined/>, title: 'Edit', action: 'edit'} : null,
    checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,PERMISSIONS.RECEIPTS_DELETE]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.RECEIPTS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString()) ? {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'} : null
  ].filter(item => item !== null);

  const EditReceiptDialog = () => {
    const {data:receipt,isFetching} = useQuery(['receipt',{id:transaction.id}],() => receiptServices.show(transaction.id));
    if(isFetching){
      return <LinearProgress/>;
    }
    return (
        <ReceiptFormDialogContent setOpen={setOpenEditDialog} receipt={receipt} />
    );
  }

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'delete':
        showDialog({
          title : 'Confirm Delete?',
          content: 'If you say yes, this receipt will be deleted',
          onYes: () => {
            hideDialog();
            deleteReceipt.mutate(transaction);
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
        open={openEditDialog || openDocumentDialog  || attachDialog}
        scroll={'paper'}
        onClose={() => setOpenDocumentDialog(false)}
        fullWidth
        fullScreen={belowLargeScreen}
        maxWidth={openEditDialog ? 'lg' : 'md'}
      >
        {openEditDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.RECEIPTS_EDIT]) ? <EditReceiptDialog/> : <UnauthorizedAccess/>)}
        {openDocumentDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_MASTERS_READ,PERMISSIONS.RECEIPTS_READ]) ? <DocumentDialog setOpenDocumentDialog={setOpenDocumentDialog} transaction={transaction} authObject={authObject}/> : <UnauthorizedAccess/>)}
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

export default ReceiptItemAction