import { 
  Box, 
  Button, 
  Dialog, 
  DialogContent, 
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
import React, { useState } from 'react';
import { 
  AttachmentOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  HighlightOff, 
  ReceiptLongOutlined, 
  VisibilityOutlined 
} from '@mui/icons-material';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import posServices from '../../pos-services';
import dayjs from 'dayjs';
import SalePDF from '../SalePDF';
import { SalesOrder } from '../SalesOrderType';
import { Organization, User } from '@/types/auth-types';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import AttachmentForm from '@/components/filesShelf/attachments/AttachmentForm';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';
import PDFContent from '@/components/pdf/PDFContent';

const SaleReceipt = React.lazy(() => import('../saleReceipt/SaleReceipt'));
const SaleDialogForm = React.lazy(() => import('../saleForm/SaleDialogForm'));
const SalePreviewOnscreen = React.lazy(() => import('../../onScreenPreviews/SalePreviewOnscreen'));
const ReceiptPreviewOnScreen = React.lazy(() => import('../../onScreenPreviews/ReceiptPreviewOnScreen'));

interface DocumentDialogContentProps {
  organization: Organization;
  saleId?: number;
  setOpenDocumentDialog: (open: boolean) => void;
}

const DocumentDialogContent: React.FC<DocumentDialogContentProps> = ({ 
  organization, 
  saleId, 
  setOpenDocumentDialog 
}) => {
  const [thermalPrinter, setThermalPrinter] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: sale, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  if (!sale) return null;

  return (
    <>
      {belowLargeScreen && (
        <DialogTitle>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid size={11}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="ONSCREEN" />
                <Tab label="PDF/80mm" />
              </Tabs>
            </Grid>
            <Grid size={1} textAlign="right">
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
            <PDFContent
              fileName={sale.saleNo} 
              document={<SalePDF thermalPrinter={thermalPrinter} organization={organization} sale={sale} />} 
            />
          </Box>
        )}
        <Box textAlign="right" marginTop={5}>
          <Button 
            variant="outlined" 
            size='small' 
            color="primary" 
            onClick={() => setOpenDocumentDialog(false)}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </>
  );
};

interface AttachDialogProps {
  sale: SalesOrder;
  setAttachDialog: (open: boolean) => void;
}

const AttachDialog: React.FC<AttachDialogProps> = ({ sale, setAttachDialog }) => {
  return (
    <AttachmentForm
      setAttachDialog={setAttachDialog} 
      attachment_sourceNo={sale.saleNo} 
      attachmentable_type={'sale'} 
      attachment_name={'Sale'} 
      attachmentable_id={sale.id as number}
    />
  );
};

interface ReceiptProps {
  organization: Organization;
  saleId?: number;
  user: User;
  setOpenReceiptDialog: (open: boolean) => void;
}

const Receipt: React.FC<ReceiptProps> = ({ 
  organization, 
  saleId, 
  user, 
  setOpenReceiptDialog 
}) => {
  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const { data: sale, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  if (!sale) return null;

  return (
    <Box>
      {belowLargeScreen &&
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Onscreen" />
          <Tab label="Receipt" />
        </Tabs>
      }
      {belowLargeScreen && activeTab === 0 ? 
        <ReceiptPreviewOnScreen 
          setOpenReceiptDialog={setOpenReceiptDialog} 
          organization={organization} 
          sale={sale} 
        />
        :
        <SaleReceipt 
          organization={organization} 
          setOpenReceiptDialog={setOpenReceiptDialog} 
          sale={sale} 
          user={user} 
        />
      }
    </Box>
  );
};

interface EditSalesProps {
  saleId?: number;
  toggleOpen: (open: boolean) => void;
}

const EditSales: React.FC<EditSalesProps> = ({ saleId, toggleOpen }) => {
  const { data: sale, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });

  if (isFetching) {
    return <LinearProgress />;
  }

  if (!sale) return null;

  return (
    <SaleDialogForm toggleOpen={toggleOpen} sale={sale} />
  );
};

interface CounterSalesListItemActionProps {
  sale: SalesOrder;
  openDispatchDialog?: boolean;
  setOpenDispatchDialog?: (open: boolean) => void;
}

const CounterSalesListItemAction: React.FC<CounterSalesListItemActionProps> = ({ 
  sale,
  openDispatchDialog,
  setOpenDispatchDialog
}) => {
  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const { showDialog, hideDialog } = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const [attachDialog, setAttachDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const queryClient = useQueryClient();
  const { 
    authOrganization, 
    checkOrganizationPermission, 
    authUser
  } = useJumboAuth();

  const organization = authOrganization?.organization;
  const user = authUser?.user;

  const deleteSale = useMutation({
    mutationFn: posServices.deleteSale,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['counterSales'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
    },
  });

  const handleDelete = () => {
    showDialog({
      title: 'Confirm Delete?',
      content: 'If you click yes, this Sale will be deleted',
      onYes: () => {
        hideDialog();
        deleteSale.mutate(sale);
      },
      onNo: () => hideDialog(),
      variant: 'confirm'
    });
  };

  return (
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
          setOpenEditDialog(false);
          setAttachDialog(false);
        }}
      >
        {openEditDialog && (
          checkOrganizationPermission([PERMISSIONS.SALES_EDIT]) ? 
            <EditSales saleId={sale.id} toggleOpen={setOpenEditDialog} /> : 
            <UnauthorizedAccess/>
        )}
        {openDocumentDialog && (
          checkOrganizationPermission(PERMISSIONS.SALES_READ) ? 
            <DocumentDialogContent 
              organization={organization as Organization} 
              saleId={sale.id} 
              setOpenDocumentDialog={setOpenDocumentDialog}
            /> : 
            <UnauthorizedAccess/>
        )}
        {attachDialog && <AttachDialog sale={sale} setAttachDialog={setAttachDialog}/>}
        {openReceiptDialog && (
          checkOrganizationPermission(PERMISSIONS.SALES_CREATE) ? 
            <Receipt 
              setOpenReceiptDialog={setOpenReceiptDialog} 
              organization={organization as Organization}
              saleId={sale.id} 
              user={user as User}
            /> : 
            <UnauthorizedAccess/>
        )}
      </Dialog>

      {!!sale.is_instant_sale && !sale.is_invoiced && (checkOrganizationPermission(PERMISSIONS.SALES_CREATE)) && sale.status === 'Complete' && (
        <Tooltip title={`Receipt ${sale.saleNo}`}>
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

      <Tooltip title={`${sale.saleNo} Attachments`}>
        <IconButton onClick={() => setAttachDialog(true)}>
          <AttachmentOutlined/>
        </IconButton>
      </Tooltip>

      {checkOrganizationPermission(PERMISSIONS.SALES_EDIT) && !sale.vfd_receipt && !sale.is_invoiced && (
        <Tooltip title={`Edit ${sale.saleNo}`}>
          <IconButton onClick={() => setOpenEditDialog(true)}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      )}

      {checkOrganizationPermission(PERMISSIONS.SALES_DELETE) && (
        checkOrganizationPermission(PERMISSIONS.SALES_BACKDATE) || 
        sale.transaction_date >= dayjs().startOf('date').toISOString() || 
        sale.status === 'Pending' || 
        sale.status === 'Ordered'
      ) && !sale.vfd_receipt && !sale.is_invoiced && !(
        sale.status === 'Partially Fulfilled' || 
        sale.status === 'Fulfilled' || 
        sale.status === 'Over Fulfilled'
      ) && (
        <Tooltip title={`Delete ${sale.saleNo}`}>
          <IconButton onClick={handleDelete}>
            <DeleteOutlined color="error" />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );
};

export default React.memo(CounterSalesListItemAction);