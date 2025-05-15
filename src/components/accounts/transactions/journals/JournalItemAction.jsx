import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { AttachmentOutlined, ContentCopyOutlined, DeleteOutlined, EditOutlined, HighlightOff, MoreHorizOutlined,VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import journalServices from './journal-services';
import JournalPDF from './JournalPDF';
import JournalFormDialogContent from './JournalFormDialogContent';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import AttachmentForm from 'app/prosServices/prosERP/filesShelf/attachments/AttachmentForm';
import JournalOnScreen from './JournalOnScreen';
import { useJumboTheme } from '@jumbo/hooks';
import dayjs from 'dayjs';

const DocumentDialog = ({ transaction, authObject, setOpenDocumentDialog }) => {
  const {data,isFetching} = useQuery(['transfer',{id: transaction.id}],() => journalServices.show(transaction.id));
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
        <Grid container alignItems="center" justifyContent="space-between" marginBottom={2}>
          <Grid item xs={11}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="journal View Tabs"
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
        <JournalOnScreen transaction={data} authObject={authObject} /> 
        :
        <PDFContent
          document={<JournalPDF transaction={data} authObject={authObject}/>}
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
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={transaction.voucherNo} attachmentable_type={'journal_voucher'} attachment_name={'Journal Voucher'} attachmentable_id={transaction.id}/>
  )
}

function TransferItemAction({transaction}) {
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const {showDialog,hideDialog} = useJumboDialog();
    const {enqueueSnackbar} = useSnackbar();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
    const [attachDialog, setAttachDialog] = useState(false);
    const queryClient = useQueryClient();
    const authObject = useJumboAuth();
    const checkOrganizationPermission = authObject.checkOrganizationPermission;

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
    const deletePayment = useMutation(journalServices.delete,{
      onSuccess: (data) => {
        enqueueSnackbar(data.message,{variant : 'success'});
        queryClient.invalidateQueries(['transactions']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
      },
    });
  
    const menuItems = [
      (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,PERMISSIONS.JOURNAL_VOUCHERS_READ]) && {icon: <VisibilityOutlined/>, title: "View" , action: "open"}),
      {icon: <AttachmentOutlined/> , title : "Attach" , action : "attach"},
      (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,PERMISSIONS.JOURNAL_VOUCHERS_CREATE]) && {icon: <ContentCopyOutlined/>, title: "Duplicate" , action: "duplicate"}),
      checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.JOURNAL_VOUCHERS_EDIT]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.JOURNAL_VOUCHERS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString()) ? {icon: <EditOutlined/>, title: 'Edit', action: 'edit'} : null,
      checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,PERMISSIONS.JOURNAL_VOUCHERS_DELETE]) && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_BACKDATE,PERMISSIONS.JOURNAL_VOUCHERS_BACKDATE]) || transaction.transaction_date >= dayjs().startOf('date').toISOString()) ? {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'} : null
    ].filter(item => item !== null);
  
  
    const EditTransferDialog = () => {
      const {data:journal,isFetching} = useQuery(['journal',{id:transaction.id}],() => journalServices.show(transaction.id));
      if(isFetching){
        return <LinearProgress/>;
      }
      return (
        <JournalFormDialogContent setOpen={setOpenEditDialog} journal={journal} isEdit={true}/>
      );
    }

    const DuplicateTransferDialog = () => {
      const {data:journal,isFetching} = useQuery(['journal',{id:transaction.id}],() => journalServices.show(transaction.id));
      if(isFetching){
        return <LinearProgress/>;
      }
      return (
        <JournalFormDialogContent setOpen={setOpenDuplicateDialog} journal={journal} isDuplicate={true}/>
      );
    }
  
    const handleItemAction = (menuItem) => {
      switch (menuItem.action) {
        case 'delete':
          showDialog({
            title : 'Confirm Delete?',
            content: 'If you say yes, this Journal will be deleted',
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
        case 'duplicate':
          setOpenDuplicateDialog(true);
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
          open={openEditDialog || openDocumentDialog || attachDialog || openDuplicateDialog}
          scroll={'paper'}
          fullScreen={belowLargeScreen}
          onClose={() => setOpenDocumentDialog(false)}
          fullWidth
          maxWidth={(openEditDialog || openDuplicateDialog) ? 'lg' : 'md'}
        >
          {openEditDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,PERMISSIONS.JOURNAL_VOUCHERS_EDIT]) ? <EditTransferDialog/> : <UnauthorizedAccess/>)}
          {openDuplicateDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,PERMISSIONS.JOURNAL_VOUCHERS_CREATE]) ? <DuplicateTransferDialog/> : <UnauthorizedAccess/>)}
          {openDocumentDialog && (checkOrganizationPermission([PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,PERMISSIONS.JOURNAL_VOUCHERS_READ]) ? <DocumentDialog setOpenDocumentDialog={setOpenDocumentDialog} transaction={transaction} authObject={authObject}/> : <UnauthorizedAccess/>)}
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

export default TransferItemAction