import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, LinearProgress, Switch, Tab, Tabs, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useSnackbar } from 'notistack';
import posServices from '../../pos-services';
import { useJumboTheme } from '@jumbo/hooks';
import { HighlightOff } from '@mui/icons-material';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import DispatchPDF from './dispatch/PDFs/DispatchPDF';
import DeliveryNotePDF from './dispatch/PDFs/DeliveryNotePDF';

const SalesDispatchForm = React.lazy(() => import('./dispatch/SalesDispatchForm'));
const AttachmentForm = React.lazy(() => import('app/prosServices/prosERP/filesShelf/attachments/AttachmentForm'));
const DispatchOnScreen = React.lazy(() => import('./dispatch/DispatchOnScreen'));
const DeliveryNoteOnScreen = React.lazy(() => import('./dispatch/DeliveryNoteOnScreen'));

const DocumentDialog = ({ deliveryNote, organization, openDispatchPreview=false, setOpenDocumentDialog }) => {
  const [thermalPrinter, setThermalPrinter] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { data: deliveryNoteData, isLoading } = useQuery(['deliveryNotes', { id: deliveryNote.id }], async () =>
    posServices.deliveryNoteDetails(deliveryNote.id)
  );

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      {
        !openDispatchPreview ? (
          <DialogTitle>
            <Grid container alignItems="center" justifyContent="space-between">
              {(!belowLargeScreen || (belowLargeScreen && activeTab === 1)) && (
                <Grid item xs={belowLargeScreen ? 11 : 12}>
                  <Box display="flex" alignItems="center" justifyContent="flex-start">
                    <Typography variant="body1" style={{ marginRight: 8 }}>
                      A4
                    </Typography>
                    <Switch
                      checked={thermalPrinter}
                      onChange={(e) => setThermalPrinter(e.target.checked)}
                    />
                    <Typography variant="body1" style={{ marginLeft: 8 }}>
                      80mm
                    </Typography>
                  </Box>
                </Grid>
              )}

              {belowLargeScreen && (
                <Grid item xs={belowLargeScreen && activeTab === 0 ? 12 : 1} textAlign="right">
                  <Tooltip title="Cancel">
                    <IconButton
                      size="small"
                      onClick={() => setOpenDocumentDialog(false)}
                    >
                      <HighlightOff color="primary" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

              {belowLargeScreen && (
                <Grid item xs={12}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="On Screen" />
                    <Tab label="PDF" />
                  </Tabs>
                </Grid>
              )}
            </Grid>
          </DialogTitle>
        ) : (
          <DialogTitle>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  { belowLargeScreen &&
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      <Tab label="On Screen" />
                      <Tab label="PDF" />
                    </Tabs>
                  }

                  {belowLargeScreen &&
                    <Tooltip title="Close">
                      <IconButton
                        size="small"
                        onClick={() => setOpenDocumentDialog(false)}
                      >
                        <HighlightOff color="primary" />
                      </IconButton>
                    </Tooltip>
                  }
                </Box>
              </Grid>
            </Grid>
          </DialogTitle>
        )
      }
      <DialogContent>
        <Box>
          {belowLargeScreen && activeTab === 0 ? (
            openDispatchPreview ?
              <DispatchOnScreen delivery={deliveryNoteData} organization={organization}/> :
              <DeliveryNoteOnScreen delivery={deliveryNoteData} organization={organization}/>
          ) : (
            openDispatchPreview ?
              <PDFContent fileName={`Dispatch ${deliveryNote.deliveryNo}`} document={<DispatchPDF delivery={deliveryNoteData} organization={organization}/>} /> :
              <PDFContent fileName={`Delivery Note ${deliveryNote.deliveryNo}`} document={<DeliveryNotePDF thermalPrinter={thermalPrinter} delivery={deliveryNoteData} organization={organization}/>} />
          )}
        {belowLargeScreen &&
          <Box textAlign="right" marginTop={5}>
            <Button variant="outlined" size='small' color="primary" onClick={() => setOpenDocumentDialog(false)}>
            Close
            </Button>
          </Box>
        }
        </Box>
      </DialogContent>
    </>
  );
};

const AttachDialog= ({deliveryNote, setAttachDialog}) => {
  return (
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={deliveryNote.deliveryNo} attachmentable_type={'delivery_note'} attachment_name={'Delivery Note'} attachmentable_id={deliveryNote.id}/>
  )
}

function EditDeliveryNote({ deliveryNote, toggleOpen }) {
  const { data: deliveryData, isFetching } = useQuery(['deliveryNote', { id: deliveryNote.id }], async () => posServices.deliveryNoteDetails(deliveryNote.id));

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <SalesDispatchForm toggleOpen={toggleOpen} deliveryData={deliveryData} />
  );
}

function SaleDeliveryNotesItemAction({attachDialog, setAttachDialog, openDispatchPreview, selectedDeliveryNote, setSelectedDeliveryNote, openDeliveryEditDialog, setOpenDeliveryEditDialog, openDeliveryNoteDeleteDialog, setOpenDeliveryNoteDeleteDialog, openDocumentDialog, setOpenDocumentDialog }) {
    const {authOrganization} = useJumboAuth();
    const {organization} = authOrganization;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: deleteDeliveryNote } = useMutation(posServices.deleteDeliveryNote, {
      onSuccess: (data) => {
        enqueueSnackbar(data.message, {
          variant: 'success',
        });
        queryClient.invalidateQueries(['saleDeliveryNotes']);
        queryClient.invalidateQueries(['counterSales']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
      },
    });

  return (
    <React.Fragment>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeliveryNoteDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Delivey Note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSelectedDeliveryNote(null); setOpenDeliveryNoteDeleteDialog(false); }} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
            if (selectedDeliveryNote) {
              deleteDeliveryNote(selectedDeliveryNote.id);
              setSelectedDeliveryNote(null);
              setOpenDeliveryNoteDeleteDialog(false);
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
        open={openDocumentDialog || openDeliveryEditDialog || attachDialog}
        scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
        fullWidth
        fullScreen={belowLargeScreen}
        maxWidth="md"
        onClose={() => setOpenDocumentDialog(false)}
      >
        {openDocumentDialog ?
          <DocumentDialog deliveryNote={selectedDeliveryNote} organization={organization} openDispatchPreview={openDispatchPreview} setOpenDocumentDialog={setOpenDocumentDialog}/>
          :
          openDeliveryEditDialog && <EditDeliveryNote deliveryNote={selectedDeliveryNote} toggleOpen={setOpenDeliveryEditDialog}/>
        }
        {attachDialog && <AttachDialog deliveryNote={selectedDeliveryNote} setAttachDialog={setAttachDialog}/>}
      </Dialog>
    </React.Fragment>
  )
}

export default SaleDeliveryNotesItemAction