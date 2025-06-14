import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useJumboTheme } from '@jumbo/hooks';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import inventoryTransferServices from '../inventoryTransfer-services';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import { listItemContext } from './InventoryTransferListItem';
import InventoryTransferTrnPDF from '../InventoryTransferTrnPDF';
import InventoryTransferTrnOnScreen from '../InventoryTransferTrnOnScreen';
import { HighlightOff } from '@mui/icons-material';

function InventoryTransferTrnsItemAction() {
    const {authOrganization} = useJumboAuth();
    const {organization} = authOrganization;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const {setExpanded,expanded,openDialog,setSelectedInventoryTrn,selectedInventoryTrn,setOpenDialog,openDocumentDialog,setOpenDocumentDialog} = useContext(listItemContext)

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: unReceiveTrn } = useMutation(inventoryTransferServices.unReceiveTrn, {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['inventoryTransfers']);
          enqueueSnackbar(data.message, {
            variant: 'success',
          });
          setExpanded(!expanded)
        },
        onError: (error) => {
          enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
        },
    });
    
    const DocumentDialog = ({ transferTrn, organization, setOpenDocumentDialog }) => {
        const [activeTab, setActiveTab] = useState(0);
        const { data: trn, isLoading } = useQuery(['trns', { id: transferTrn.id }], async () =>
            inventoryTransferServices.trnDetails(transferTrn.id)
        );
        
        const belowLargeScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    
        if (isLoading) {
            return <LinearProgress />;
        }
    
        const handleChangeTab = (event, newValue) => {
            setActiveTab(newValue);
        };
    
        return (
            <>
                <DialogTitle>
                    {belowLargeScreen && (
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={11}>
                                <Tabs 
                                    value={activeTab} 
                                    onChange={handleChangeTab} 
                                    aria-label="dialog tabs"
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
                </DialogTitle>
    
                <DialogContent>
                    {belowLargeScreen && activeTab === 0 ? (
                        <InventoryTransferTrnOnScreen trn={trn} organization={organization} />
                    ) : (
                        <PDFContent 
                            fileName={trn.trnNo} 
                            document={<InventoryTransferTrnPDF trn={trn} organization={organization} />}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    {belowLargeScreen && (
                        <Box textAlign="right" marginTop={5}>
                            <Button variant="outlined" size="small" color="primary" onClick={() => setOpenDocumentDialog(false)}>
                                Close
                            </Button>
                        </Box>
                    )}
                </DialogActions>
            </>
        );
    };
    

  return (
    <React.Fragment>
      {/* Confirmation Dialog */}
        <Dialog open={openDialog}>
            <DialogTitle>Unreceive Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to unreceive this Trn?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setSelectedInventoryTrn(null); setOpenDialog(false); }} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                    if (selectedInventoryTrn) {
                        unReceiveTrn(selectedInventoryTrn.id);
                        setSelectedInventoryTrn(null);
                        setOpenDialog(false);
                    }
                    }}
                    variant='contained'
                    color="primary"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>

        {/* PDF Dialog */}
        <Dialog
            open={openDocumentDialog}
            scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
            fullWidth
            fullScreen={belowLargeScreen}
            maxWidth="md"
            onClose={() => setOpenDocumentDialog(false)}
        >
            {selectedInventoryTrn && (
               <DocumentDialog transferTrn={selectedInventoryTrn} organization={organization} setOpenDocumentDialog={setOpenDocumentDialog}/>
            )}
        </Dialog>
    </React.Fragment>
  )
}

export default InventoryTransferTrnsItemAction