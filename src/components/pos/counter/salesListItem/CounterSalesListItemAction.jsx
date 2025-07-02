import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Switch, Tab, Tabs, Tooltip, Typography, useMediaQuery } from '@mui/material'
import React, { useState} from 'react'
import { AttachmentOutlined, DeleteOutlined, EditOutlined, HighlightOff, ReceiptLongOutlined, VisibilityOutlined } from '@mui/icons-material'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { useSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import posServices from '../../pos-services'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import dayjs from 'dayjs'
import { useJumboTheme } from '@jumbo/hooks'
import SalePDF from '../SalePDF'
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent'

const UnauthorizedAccess = React.lazy(() => import('app/shared/Information/UnauthorizedAccess'));
const SaleReceipt = React.lazy(() => import('../saleReceipt/SaleReceipt'));
const AttachmentForm = React.lazy(() => import('app/prosServices/prosERP/filesShelf/attachments/AttachmentForm'));
const SaleDialogForm = React.lazy(() => import('../saleForm/SaleDialogForm'));
const SalePreviewOnscreen = React.lazy(() => import('../../onScreenPreviews/SalePreviewOnscreen'));
const ReceiptPreviewOnScreen = React.lazy(() => import('../../onScreenPreviews/ReceiptPreviewOnScreen'));

const DocumentDialogContent = ({ organization, saleId, setOpenDocumentDialog}) => {
  const [thermalPrinter, setThermalPrinter] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: sale, isFetching } = useQuery(['sale', { id: saleId }], () => posServices.saleDetails(saleId));

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <>
      {belowLargeScreen && (
        <DialogTitle>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={11}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="ONSCREEN" />
                <Tab label="PDF/80mm" />
              </Tabs>
            </Grid>
            <Grid item xs={1} textAlign="right">
              <Tooltip title="Close">
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={() => setOpenDocumentDialog(false)}
                >
                  <HighlightOff color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogTitle>
      )}

      <DialogContent>
        {belowLargeScreen && activeTab === 0 ? (
          <SalePreviewOnscreen organization={organization} sale={sale}/>
        ) : (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="end" mb={2}>
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
            <PDFContent fileName={sale.saleNo} document={<SalePDF thermalPrinter={thermalPrinter} organization={organization} sale={sale} />} />
          </Box>
        )}
        <Box textAlign="right" marginTop={5}>
          <Button variant="outlined" size='small' color="primary" onClick={() => setOpenDocumentDialog(false)}>
          Close
          </Button>
        </Box>
      </DialogContent>
    </>
  );
};

const AttachDialog= ({sale, setAttachDialog}) => {
  return (
    <AttachmentForm setAttachDialog={setAttachDialog} attachment_sourceNo={sale.saleNo} attachmentable_type={'sale'} attachment_name={'Sale'} attachmentable_id={sale.id}/>
  )
}

const Receipt = ({ organization, saleId, user, setOpenReceiptDialog }) => {
  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const { data: sale, isFetching } = useQuery(['sale', { id: saleId }], () => posServices.saleDetails(saleId));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <Box>
      {belowLargeScreen &&
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Onscreen" />
          <Tab label="Receipt" />
        </Tabs>
      }
      {belowLargeScreen && activeTab === 0 ? 
        <ReceiptPreviewOnScreen setOpenReceiptDialog={setOpenReceiptDialog} organization={organization} sale={sale} user={user} />
        :
        <SaleReceipt organization={organization} setOpenReceiptDialog={setOpenReceiptDialog} sale={sale} user={user} />
      }
    </Box>
  );
};

function EditSales({ saleId, toggleOpen}) {
  const { data: sale, isFetching } = useQuery(['sale', { id: saleId.id }], async () => posServices.saleDetails(saleId));

  if (isFetching) {
    return <LinearProgress />;
  }

  return (
    <SaleDialogForm toggleOpen={toggleOpen} sale={sale} />
  );
}

function CounterSalesListItemAction({sale}) {
  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false)
  const {showDialog,hideDialog} = useJumboDialog();
  const {enqueueSnackbar} = useSnackbar();
  const [attachDialog, setAttachDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const queryClient = useQueryClient();
  const {authOrganization : {organization}, checkOrganizationPermission, authUser: {user}} = useJumboAuth();

  const deleteSale = useMutation(posServices.deleteSale,{
    onSuccess: (data) => {
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['counterSales']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
    },
  });

  const handleDelete = () => {
    showDialog({
      title : 'Confirm Delete?',
      content: 'If you click yes, this Sale will be deleted',
      onYes: () => {
        hideDialog();
        deleteSale.mutate(sale);
      },
      onNo: () => hideDialog(),
      variant: 'confirm'
    })
  }

  return  (
    <React.Fragment>
      <Dialog
        open={openEditDialog || openDocumentDialog || openReceiptDialog || attachDialog}
        fullWidth
        fullScreen={belowLargeScreen}
        maxWidth={openDocumentDialog || attachDialog ? 'md' : openReceiptDialog ? 'sm' : 'lg'}
        scroll={belowLargeScreen ? 'body' : 'paper'}
        onClose={() => {
          setOpenReceiptDialog(false);
          setOpenDocumentDialog(false);
        }}
      >
        {openEditDialog && (checkOrganizationPermission([PERMISSIONS.SALES_EDIT]) ? <EditSales saleId={sale.id} toggleOpen={setOpenEditDialog} /> : <UnauthorizedAccess/>)}
        {openDocumentDialog && (checkOrganizationPermission(PERMISSIONS.SALES_READ) ? <DocumentDialogContent organization={organization} saleId={sale.id} user={user} setOpenDocumentDialog={setOpenDocumentDialog}/> : <UnauthorizedAccess/>)}
        {attachDialog && <AttachDialog sale={sale} setAttachDialog={setAttachDialog}/>}
        {openReceiptDialog && (checkOrganizationPermission(PERMISSIONS.SALES_CREATE) ? <Receipt setOpenReceiptDialog={setOpenReceiptDialog} organization={organization} saleId={sale.id} user={user}/> : <UnauthorizedAccess/>)}
      </Dialog>

      {!!sale.is_instant_sale && !sale.is_invoiced && (checkOrganizationPermission(PERMISSIONS.SALES_CREATE)) && sale.status === 'Complete' && (
        <Tooltip  title={`Receipt ${sale.saleNo}`}>
          <IconButton onClick={() => setOpenReceiptDialog(true)}>
            <ReceiptLongOutlined/>
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={`View ${sale.saleNo}`}>
        <IconButton onClick={() => setOpenDocumentDialog(true)}>
          <VisibilityOutlined/>
        </IconButton>
      </Tooltip>

      <Tooltip  title={`${sale.saleNo} Attachments`}>
        <IconButton onClick={() => setAttachDialog(true)}>
          <AttachmentOutlined/>
        </IconButton>
      </Tooltip>
      {
        checkOrganizationPermission(PERMISSIONS.SALES_EDIT) && !sale.vfd_receipt && !sale.is_invoiced &&
        <Tooltip  title={`Edit ${sale.saleNo}`}>
          <IconButton onClick={() => setOpenEditDialog(true)}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      }

      {checkOrganizationPermission(PERMISSIONS.SALES_DELETE) && (
        //BackDate Controll
        checkOrganizationPermission(PERMISSIONS.SALES_BACKDATE) || sale.transaction_date >= dayjs().startOf('date').toISOString() || sale.status === 'Pending' || sale.status === 'Ordered'
      ) && !sale.vfd_receipt && !sale.is_invoiced && !(sale.status === 'Partially Fulfilled' || sale.status === 'Fulfilled' || sale.status === 'Over Fulfilled') && (
        <Tooltip  title={`Delete ${sale.saleNo}`}>
          <IconButton onClick={handleDelete}>
            <DeleteOutlined color="error" />
          </IconButton>
        </Tooltip>
      )}
      </React.Fragment>
  )
}

export default CounterSalesListItemAction