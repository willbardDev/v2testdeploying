import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import React, { Suspense, useState } from 'react';
import { useSnackbar } from 'notistack';
import posServices from '../../pos-services';
import { HighlightOff } from '@mui/icons-material';
import DispatchPDF from './dispatch/PDFs/DispatchPDF';
import DeliveryNotePDF from './dispatch/PDFs/DeliveryNotePDF';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { Organization } from '@/types/auth-types';
import AttachmentForm from '@/components/filesShelf/attachments/AttachmentForm';
import PDFContent from '@/components/pdf/PDFContent';

// Lazy loaded components
const SalesDispatchForm = React.lazy(() => import('./dispatch/SalesDispatchForm'));
const DispatchOnScreen = React.lazy(() => import('./dispatch/DispatchOnScreen'));
const DeliveryNoteOnScreen = React.lazy(() => import('./dispatch/DeliveryNoteOnScreen'));

interface DeliveryNote {
  id: string;
  deliveryNo: string;
  dispatch_date: string;
  dispatch_from: string;
  destination: string;
  driver_information?: string;
  vehicle_information?: string;
  remarks?: string;
  is_invoiced: boolean;
}

interface DocumentDialogProps {
  deliveryNote: DeliveryNote;
  organization: Organization;
  openDispatchPreview?: boolean;
  setOpenDocumentDialog: (open: boolean) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({ 
  deliveryNote, 
  organization, 
  openDispatchPreview = false, 
  setOpenDocumentDialog 
}) => {
  const [thermalPrinter, setThermalPrinter] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [contentKey, setContentKey] = useState(0); // Key to force remount

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { data: deliveryNoteData, isLoading } = useQuery({
    queryKey: ['deliveryNotes', { id: deliveryNote.id }],
    queryFn: async () => posServices.deliveryNoteDetails(deliveryNote.id),
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setThermalPrinter(false); // Reset printer format when switching tabs
    setContentKey(prev => prev + 1); // Force content remount
  };

  const handleThermalToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThermalPrinter(e.target.checked);
    setContentKey(prev => prev + 1); // Force content remount when changing format
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!deliveryNoteData) return null;

  return (
    <Dialog
      open
      fullWidth
      maxWidth="lg"
      fullScreen={belowLargeScreen}
      onClose={() => setOpenDocumentDialog(false)}
    >
      <DialogTitle sx={{ p: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Printer format toggle - shown for PDF tab and desktop */}
          {(!belowLargeScreen || activeTab === 1) && !openDispatchPreview && (
            <Grid size={belowLargeScreen ? 8 : 6}>
              <Box display="flex" alignItems="center">
                <Typography variant="body2">A4</Typography>
                <Switch
                  checked={thermalPrinter}
                  onChange={handleThermalToggle}
                  color="primary"
                  sx={{ mx: 1 }}
                />
                <Typography variant="body2">80mm</Typography>
              </Box>
            </Grid>
          )}

          {/* Tabs - shown on mobile */}
          {belowLargeScreen && (
            <Grid size={openDispatchPreview ? 12 : 4}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="On Screen" />
                <Tab label="PDF" />
              </Tabs>
            </Grid>
          )}

          {/* Close button */}
          <Grid size={belowLargeScreen ? (openDispatchPreview ? 0 : 2) : 1} textAlign="right">
            <IconButton
              size="small"
              onClick={() => setOpenDocumentDialog(false)}
              sx={{ ml: 'auto' }}
            >
              <HighlightOff color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: '60vh' }}>
        <Suspense fallback={<LinearProgress />}>
          <Box key={`content-${contentKey}`}>
            {belowLargeScreen && activeTab === 0 ? (
              openDispatchPreview ? (
                <DispatchOnScreen delivery={deliveryNoteData} organization={organization} />
              ) : (
                <DeliveryNoteOnScreen delivery={deliveryNoteData} organization={organization} />
              )
            ) : (
              openDispatchPreview ? (
                <PDFContent
                  fileName={`Dispatch_${deliveryNote.deliveryNo}`}
                  document={<DispatchPDF delivery={deliveryNoteData} organization={organization} />}
                />
              ) : (
                <PDFContent
                  fileName={`DeliveryNote_${deliveryNote.deliveryNo}_${thermalPrinter ? '80mm' : 'A4'}`}
                  document={
                    <DeliveryNotePDF 
                      thermalPrinter={thermalPrinter} 
                      delivery={deliveryNoteData} 
                      organization={organization} 
                    />
                  }
                />
              )
            )}
          </Box>
        </Suspense>
      </DialogContent>

      {belowLargeScreen && (
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpenDocumentDialog(false)}
            sx={{ mb: 1 }}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

interface AttachDialogProps {
  deliveryNote: DeliveryNote;
  setAttachDialog: (open: boolean) => void;
}

const AttachDialog: React.FC<AttachDialogProps> = ({ deliveryNote, setAttachDialog }) => {
  return (
    <AttachmentForm
      setAttachDialog={setAttachDialog} 
      attachment_sourceNo={deliveryNote.deliveryNo} 
      attachmentable_type={'delivery_note'} 
      attachment_name={'Delivery Note'} 
      attachmentable_id={Number(deliveryNote.id)}
    />
  );
};

interface EditDeliveryNoteProps {
  deliveryNote: DeliveryNote;
  toggleOpen: (open: boolean) => void;
}

const EditDeliveryNote: React.FC<EditDeliveryNoteProps> = ({ deliveryNote, toggleOpen }) => {
  const { data: deliveryData, isFetching } = useQuery({
    queryKey: ['deliveryNote', { id: deliveryNote.id }],
    queryFn: async () => posServices.deliveryNoteDetails(deliveryNote.id)
  });

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <SalesDispatchForm toggleOpen={toggleOpen} deliveryData={deliveryData} />
  );
};

interface SaleDeliveryNotesItemActionProps {
  attachDialog: boolean;
  setAttachDialog: (open: boolean) => void;
  openDispatchPreview: boolean;
  selectedDeliveryNote: DeliveryNote | null;
  setSelectedDeliveryNote: (note: DeliveryNote | null) => void;
  openDeliveryEditDialog: boolean;
  setOpenDeliveryEditDialog: (open: boolean) => void;
  openDeliveryNoteDeleteDialog: boolean;
  setOpenDeliveryNoteDeleteDialog: (open: boolean) => void;
  openDocumentDialog: boolean;
  setOpenDocumentDialog: (open: boolean) => void;
}

const SaleDeliveryNotesItemAction: React.FC<SaleDeliveryNotesItemActionProps> = ({
  attachDialog,
  setAttachDialog,
  openDispatchPreview,
  selectedDeliveryNote,
  setSelectedDeliveryNote,
  openDeliveryEditDialog,
  setOpenDeliveryEditDialog,
  openDeliveryNoteDeleteDialog,
  setOpenDeliveryNoteDeleteDialog,
  openDocumentDialog,
  setOpenDocumentDialog
}) => {
  const { authOrganization } = useJumboAuth();
  const organization = authOrganization?.organization;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Screen handling constants
  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { mutate: deleteDeliveryNote } = useMutation({
    mutationFn: posServices.deleteDeliveryNote,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['saleDeliveryNotes'] });
      queryClient.invalidateQueries({ queryKey: ['counterSales'] });
    },
    onError: (error: any) => {
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
            Are you sure you want to Delete this Delivery Note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => { 
              setSelectedDeliveryNote(null); 
              setOpenDeliveryNoteDeleteDialog(false); 
            }} 
            color="primary"
          >
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
        {openDocumentDialog && selectedDeliveryNote ? (
          <DocumentDialog 
            deliveryNote={selectedDeliveryNote} 
            organization={organization as Organization} 
            openDispatchPreview={openDispatchPreview} 
            setOpenDocumentDialog={setOpenDocumentDialog}
          />
        ) : openDeliveryEditDialog && selectedDeliveryNote ? (
          <EditDeliveryNote 
            deliveryNote={selectedDeliveryNote} 
            toggleOpen={setOpenDeliveryEditDialog}
          />
        ) : attachDialog && selectedDeliveryNote ? (
          <AttachDialog 
            deliveryNote={selectedDeliveryNote} 
            setAttachDialog={setAttachDialog}
          />
        ) : null}
      </Dialog>
    </React.Fragment>
  );
};

export default SaleDeliveryNotesItemAction;