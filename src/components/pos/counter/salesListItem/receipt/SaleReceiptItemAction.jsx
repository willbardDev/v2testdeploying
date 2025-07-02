import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, useMediaQuery } from '@mui/material';
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useSnackbar } from 'notistack';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import posServices from '../../../pos-services';
import SaleReceiptForm from './SaleReceiptForm';
import ReceiptPDF from 'app/prosServices/prosERP/accounts/transactions/receipts/ReceiptPDF';
import AttachmentForm from 'app/prosServices/prosERP/filesShelf/attachments/AttachmentForm';
import { useJumboTheme } from '@jumbo/hooks';

const DocumentDialog = ({ receipt }) => {
  const authObject = useJumboAuth();

  const { data: receiptData, isLoading } = useQuery(['receipts', { id: receipt.id }], async () =>
    posServices.receiptDetails(receipt.id)
  );
  
  if (isLoading) {
    return <LinearProgress />;
  }
  
  return (
    <DialogContent>
       <PDFContent fileName={`Receipt ${receipt.voucherNo}`} document={<ReceiptPDF transaction={receiptData} authObject={authObject}/>}/>
    </DialogContent>
  );
};

const AttachDialog= ({receipt, setAttachDialog}) => {
  return (
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={receipt.voucherNo} attachmentable_type={'receipt'} attachment_name={'Receipt'} attachmentable_id={receipt.id}/>
  )
}

function EditReceipt({ receipt, toggleOpen }) {
  const { data: receiptData, isFetching } = useQuery(['receipt', { id: receipt.id }], async () => posServices.receiptDetails(receipt.id));

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <SaleReceiptForm toggleOpen={toggleOpen} receipt={receiptData} />
  );
}

function SaleReceiptItemAction({attachDialog, setAttachDialog, selectedReceipt, setSelectedReceipt, openReceiptEditDialog, setOpenReceiptEditDialog, openReceiptDeleteDialog, setOpenReceiptDeleteDialog, openDocumentDialog, setOpenDocumentDialog }) {
    const {authOrganization} = useJumboAuth();
    const {organization} = authOrganization;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: deleteReceipt } = useMutation(posServices.deleteReceipt, {
      onSuccess: (data) => {
        enqueueSnackbar(data.message, {
          variant: 'success',
        });
        queryClient.invalidateQueries(['SaleReceipts']);
        queryClient.invalidateQueries(['counterSales']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
      },
    });

  return (
    <React.Fragment>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openReceiptDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Receipt?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setSelectedReceipt(null); setOpenReceiptDeleteDialog(false); }} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
            if (selectedReceipt) {
              deleteReceipt(selectedReceipt.id);
              setSelectedReceipt(null);
              setOpenReceiptDeleteDialog(false);
            }
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Dialog */}
      <Dialog
        open={openDocumentDialog || openReceiptEditDialog || attachDialog}
        scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
        fullWidth
        fullScreen={(!!openReceiptEditDialog || attachDialog) && belowLargeScreen}
        maxWidth={'md'}
        onClose={() => setOpenDocumentDialog(false)}
      >
        {openDocumentDialog ?
          <DocumentDialog receipt={selectedReceipt} organization={organization}/>
          :
          openReceiptEditDialog && <EditReceipt receipt={selectedReceipt} toggleOpen={setOpenReceiptEditDialog}/>
        }
        {attachDialog && <AttachDialog receipt={selectedReceipt} setAttachDialog={setAttachDialog}/>}
      </Dialog>
    </React.Fragment>
  )
}

export default SaleReceiptItemAction