import { 
  faFileInvoice, 
  faReceipt, 
  faTruckArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Divider, 
  Grid, 
  IconButton, 
  LinearProgress, 
  Tab, 
  Tabs, 
  Tooltip, 
  useMediaQuery 
} from '@mui/material';
import React, { useState } from 'react';
import posServices from '../../pos-services';
import { InventoryOutlined } from '@mui/icons-material';
import SaleDeliveryNotes from './SaleDeliveryNotes';
import SaleReceipts from './receipt/SaleReceipts';
import SaleInvoices from './SaleInvoices';
import SalesDispatchReport from './saleDispatchReport/SalesDispatchReport';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useQuery } from '@tanstack/react-query';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { Organization } from '@/types/auth-types';
import { SalesOrder } from '../SalesOrderType';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';
import { DispatchReportOnScreen } from './saleDispatchReport/DispatchReportOnScreen';

const SaleInvoiceForm = React.lazy(() => import('./invoice/SaleInvoiceForm'));
const SaleReceiptForm = React.lazy(() => import('./receipt/SaleReceiptForm'));
const SalesDispatchForm = React.lazy(() => import('./dispatch/SalesDispatchForm'));
const PDFContent = React.lazy(() => import('@/components/pdf/PDFContent'));

interface DispatchReportProps {
  organization: Organization;
  sale: SalesOrder;
  setOpenDispatchReport: (open: boolean) => void;
}

const DispatchReport: React.FC<DispatchReportProps> = ({ 
  organization, 
  sale, 
  setOpenDispatchReport 
}) => {
  const { data: saleDispatchReport, isFetching } = useQuery({
    queryKey: ['saleDispatchReport', { saleId: sale.id }],
    queryFn: () => posServices.saleDispatchReport(sale.id)
  });
  const [activeTab, setActiveTab] = useState(0);

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  if (!saleDispatchReport) return null;

  return (
    <>
      <DialogTitle>
        {belowLargeScreen && (
          <Tabs value={activeTab} onChange={handleChange} aria-label="purchase order tabs">
            <Tab label="ONSCREEN"/>
            <Tab label="PDF"/>
          </Tabs>
        )}
      </DialogTitle>
      <DialogContent>
        {belowLargeScreen && activeTab === 0 ? (
          <DispatchReportOnScreen
            organization={organization as Organization} 
            dispatchReport={saleDispatchReport}
          />
        ) : (
          <PDFContent 
            fileName={`Dispatch Report For ${saleDispatchReport.saleNo}`} 
            document={
              <SalesDispatchReport 
                organization={organization} 
                dispatchReport={saleDispatchReport} 
              />
            } 
          />
        )}
      </DialogContent>
      {belowLargeScreen && (
        <DialogActions>
          <Box textAlign="right" marginTop={5}>
            <Button 
              variant="outlined" 
              size='small' 
              color="primary" 
              onClick={() => setOpenDispatchReport(false)}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      )}
    </>
  );
};

interface DialogProps {
  saleId?: number;
  toggleOpen: (open: boolean) => void;
}

const DispatchDialog: React.FC<DialogProps> = ({ saleId, toggleOpen }) => {
  const { data: saleData, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });

  if (isFetching) {
    return <LinearProgress/>;
  }

  if (!saleData) return null;

  return <SalesDispatchForm toggleOpen={toggleOpen} sale={saleData} />;
};

const InvoicesDialog: React.FC<DialogProps> = ({ saleId, toggleOpen }) => {
  const { data: saleData, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });

  if (isFetching) {
    return <LinearProgress/>;
  }

  if (!saleData) return null;

  return <SaleInvoiceForm toggleOpen={toggleOpen} sale={saleData} />;
};

const ReceiptDialog: React.FC<DialogProps> = ({ saleId, toggleOpen }) => {
  const { data: saleData, isFetching } = useQuery({
    queryKey: ['sale', { id: saleId }],
    queryFn: () => posServices.saleDetails(saleId)
  });

  if (isFetching) {
    return <LinearProgress/>;
  }

  if (!saleData) return null;

  return <SaleReceiptForm toggleOpen={toggleOpen} sale={saleData} />;
};

interface SalesListItemTabsProps {
  sale: SalesOrder;
  activeTab: number;
  expanded: boolean;
  setActiveTab: (value: number) => void;
}

const SalesListItemTabs: React.FC<SalesListItemTabsProps> = ({ 
  sale, 
  activeTab, 
  expanded, 
  setActiveTab 
}) => {
  const { checkOrganizationPermission, authOrganization } = useJumboAuth();
  const organization = authOrganization?.organization;
  const [openDispatchReport, setOpenDispatchReport] = useState(false);
  const [openDispatchDialog, setOpenDispatchDialog] = useState(false);
  const [openInvoicesDialog, setOpenInvoicesDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  
  const accountsPersonnel = checkOrganizationPermission([
    PERMISSIONS.ACCOUNTS_MASTERS_READ,
    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE
  ]);

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  if (sale?.status?.toLowerCase() === 'pending') {
    return null;
  }

  const getTabIndex = () => {
    if (!sale.is_instant_sale) {
      return {
        receipts: 1,
        invoices: 2
      };
    }
    return {
      receipts: sale.payment_method === 'On Account' ? 0 : -1,
      invoices: sale.payment_method === 'On Account' ? 1 : 0
    };
  };

  const tabIndex = getTabIndex();

  return (
    <React.Fragment>
      <Grid size={12}>
        <Divider/>
        <Tabs
          value={activeTab}
          onChange={(e: React.SyntheticEvent, newValue: number) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {!sale.is_instant_sale && (
            <Tab label="Dispatches"/>
          )}
          {accountsPersonnel && !sale.vfd_receipt && (!sale.is_instant_sale || sale.payment_method === 'On Account') && (
            <Tab label="Receipts"/>
          )}
          {accountsPersonnel && !sale.vfd_receipt && (!!sale.is_invoiceable || !!sale.is_invoiced) && (
            <Tab label="Invoices"/>
          )}
        </Tabs>
      </Grid>

      {/* Dispatches */}
      {activeTab === 0 && !sale.is_instant_sale && (
        <Grid container>
          <Grid size={12} textAlign={'end'}>
            <Tooltip title={belowLargeScreen ? 
              `Download Dispatch Report For ${sale.saleNo}` : 
              `View Dispatch Report For ${sale.saleNo}`
            }>
              <IconButton onClick={() => setOpenDispatchReport(true)}>
                <InventoryOutlined/>
              </IconButton>
            </Tooltip>
            {sale.status !== 'Pending' && 
             sale.status !== 'Fulfilled' && 
             checkOrganizationPermission([PERMISSIONS.SALES_DISPATCH]) && (
              <Tooltip title={`Dispatch ${sale.saleNo}`}>
                <IconButton onClick={() => setOpenDispatchDialog(true)}>
                  <FontAwesomeIcon icon={faTruckArrowRight} size={'xs'} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid size={12}>
            <SaleDeliveryNotes sale={sale} expanded={expanded}/>
          </Grid>
        </Grid>
      )}

      {/* Receipts */}
      {accountsPersonnel && 
       !sale.vfd_receipt && 
       (!sale.is_instant_sale || sale.payment_method === 'On Account') && 
       activeTab === (sale.is_instant_sale ? tabIndex.receipts : 1) && (
        <Grid container>
          {!!sale.is_receiptable && (
            <Grid size={12} textAlign={'end'}>
              <Tooltip title={`Receipt For ${sale.saleNo}`}>
                <IconButton onClick={() => setOpenReceiptDialog(true)}>
                  <FontAwesomeIcon icon={faReceipt} size={'xs'} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          <Grid size={12}>
            <SaleReceipts sale={sale} expanded={expanded} activeTab={activeTab}/>
          </Grid>
        </Grid>
      )}

      {/* Invoices */}
      {accountsPersonnel && 
       !sale.vfd_receipt && 
       activeTab === (sale.is_instant_sale ? tabIndex.invoices : 2) && 
       (!!sale.is_invoiceable || !!sale.is_invoiced) && (
        <Grid container>
          <Grid size={12} textAlign={'end'}>
            {!!sale.is_invoiceable && (
              <Tooltip title={`Invoice ${sale.saleNo}`}>
                <IconButton onClick={() => setOpenInvoicesDialog(true)}>
                  <FontAwesomeIcon icon={faFileInvoice} size={'xs'} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid size={12}>
            <SaleInvoices sale={sale} expanded={expanded} activeTab={activeTab}/>
          </Grid>
        </Grid>
      )}
      
      <Dialog
        open={openInvoicesDialog || openDispatchDialog || openDispatchReport || openReceiptDialog}
        maxWidth={openReceiptDialog ? 'md' : 'lg'}
        fullScreen={belowLargeScreen}
        scroll={belowLargeScreen && (openDispatchDialog || openInvoicesDialog || openReceiptDialog) ? 'body' : 'paper'}
        fullWidth
        onClose={() => {
          setOpenDispatchReport(false);
          setOpenDispatchDialog(false);
          setOpenInvoicesDialog(false);
          setOpenReceiptDialog(false);
        }}
      >
        {openDispatchReport && (
          checkOrganizationPermission(PERMISSIONS.SALES_READ) ? (
            <DispatchReport 
              organization={organization as Organization} 
              sale={sale} 
              setOpenDispatchReport={setOpenDispatchReport}
            />
          ) : (
            <UnauthorizedAccess/>
          )
        )}
        {openDispatchDialog && (
          checkOrganizationPermission(PERMISSIONS.SALES_DISPATCH) ? (
            <DispatchDialog saleId={sale.id} toggleOpen={setOpenDispatchDialog}/>
          ) : (
            <UnauthorizedAccess/>
          )
        )}
        {openInvoicesDialog && (
          checkOrganizationPermission(PERMISSIONS.SALES_EDIT) ? (
            <InvoicesDialog saleId={sale.id} toggleOpen={setOpenInvoicesDialog}/>
          ) : (
            <UnauthorizedAccess/>
          )
        )}
        {openReceiptDialog && (
          checkOrganizationPermission(PERMISSIONS.SALES_EDIT) ? (
            <ReceiptDialog saleId={sale.id} toggleOpen={setOpenReceiptDialog}/>
          ) : (
            <UnauthorizedAccess/>
          )
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default SalesListItemTabs;