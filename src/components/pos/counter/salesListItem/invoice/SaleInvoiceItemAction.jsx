import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, useMediaQuery } from '@mui/material';
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useSnackbar } from 'notistack';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import posServices from '../../../pos-services';
import SalesInvoiceEditForm from './SalesInvoiceEditForm';
import InvoicePDF from './InvoicePDF';
import { useJumboTheme } from '@jumbo/hooks';

const DocumentDialog = ({ invoice, organization }) => {
  const { data: invoiceData, isLoading } = useQuery(['invoices', { id: invoice.id }], async () =>
    posServices.invoiceDetails(invoice.id)
  );
  
  if (isLoading) {
    return <LinearProgress />;
  }
  
  return (
    <DialogContent>
       <PDFContent fileName={`Invoice ${invoice.invoiceNo}`} document={<InvoicePDF invoice={invoiceData} organization={organization}/>}/>
    </DialogContent>
  );
};

function EditInvoice({ invoice, toggleOpen }) {
  const { data: invoiceData, isFetching } = useQuery(['invoice', { id: invoice.id }], async () => posServices.invoiceDetails(invoice.id));

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <SalesInvoiceEditForm toggleOpen={toggleOpen} invoiceData={invoiceData} />
  );
}

function SaleInvoiceItemAction({ selectedInvoice, setSelectedInvoice, openInvoiceEditDialog, setOpenInvoiceEditDialog, openInvoiceDeleteDialog, setOpenInvoiceDeleteDialog, openDocumentDialog, setOpenDocumentDialog }) {
    const {authOrganization} = useJumboAuth();
    const {organization} = authOrganization;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: deleteInvoice } = useMutation(posServices.deleteInvoice, {
      onSuccess: (data) => {
        enqueueSnackbar(data.message, {
          variant: 'success',
        });
        queryClient.invalidateQueries(['SaleInvoices']);
        queryClient.invalidateQueries(['counterSales']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
      },
    });

  return (
    <React.Fragment>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openInvoiceDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setSelectedInvoice(null); setOpenInvoiceDeleteDialog(false); }} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
            if (selectedInvoice) {
              deleteInvoice(selectedInvoice.id);
              setSelectedInvoice(null);
              setOpenInvoiceDeleteDialog(false);
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
        open={openDocumentDialog || openInvoiceEditDialog}
        scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
        fullWidth
        fullScreen={!!openInvoiceEditDialog && belowLargeScreen}
        maxWidth={openDocumentDialog ? 'md' : "lg"}
        onClose={() => setOpenDocumentDialog(false)}
      >
        {openDocumentDialog ?
          <DocumentDialog invoice={selectedInvoice} organization={organization}/>
          :
          <EditInvoice invoice={selectedInvoice} toggleOpen={setOpenInvoiceEditDialog}/>
        }
      </Dialog>
    </React.Fragment>
  )
}

export default SaleInvoiceItemAction