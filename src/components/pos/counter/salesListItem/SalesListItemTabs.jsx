import { faFileInvoice, faReceipt, faTruckArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import posServices from '../../pos-services'
import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import { InventoryOutlined } from '@mui/icons-material'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import { useJumboTheme } from '@jumbo/hooks'
import SaleDeliveryNotes from './SaleDeliveryNotes'
import SaleReceipts from './receipt/SaleReceipts'
import SaleInvoices from './SaleInvoices'
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent'
import SalesDispatchReport from './saleDispatchReport/SalesDispatchReport'

const UnauthorizedAccess = React.lazy(() => import('app/shared/Information/UnauthorizedAccess'));
const SaleInvoiceForm = React.lazy(() => import('./invoice/SaleInvoiceForm'));
const SaleReceiptForm = React.lazy(() => import('./receipt/SaleReceiptForm'));
const DispatchReportOnScreen = React.lazy(() => import('./saleDispatchReport/DispatchReportOnScreen'));
const SalesDispatchForm = React.lazy(() => import('./dispatch/SalesDispatchForm'));

const DispatchReport = ({ organization, sale, setOpenDispatchReport }) => {
  const { data: saleDispatchReport, isFetching } = useQuery(['saleDispatchReport', { saleId: sale.id }],() => posServices.saleDispatchReport(sale.id));
  const [activeTab, setActiveTab] = useState(0);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  if (isFetching) {
    return <LinearProgress />;
  }

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <DialogTitle>
        { belowLargeScreen &&
          <Tabs value={activeTab} onChange={handleChange} aria-label="purchase order tabs">
            <Tab label="ONSCREEN"/>
            <Tab label="PDF"/>
          </Tabs>
        }
      </DialogTitle>
      <DialogContent>

        { 
        belowLargeScreen && activeTab === 0 ?
            <DispatchReportOnScreen organization={organization} dispatchReport={saleDispatchReport}/>
          :
            <PDFContent fileName={`Dispatch Report For ${saleDispatchReport.saleNo}`} document={<SalesDispatchReport organization={organization} dispatchReport={saleDispatchReport} />} />
        }
      </DialogContent>
      {belowLargeScreen &&
        <DialogActions>
          <Box textAlign="right" marginTop={5}>
            <Button variant="outlined" size='small' color="primary" onClick={() => setOpenDispatchReport(false)}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      }
    </>
  );
};

function DispatchDialog({ saleId, toggleOpen}) {
  const { data: saleData, isFetching } = useQuery(['sale', { id: saleId }], async () => posServices.saleDetails(saleId));

  if (isFetching) {
    return <LinearProgress/>;
  }

  return (
    <SalesDispatchForm toggleOpen={toggleOpen} sale={saleData} /> 
  );
}

function InvoicesDialog({ saleId, toggleOpen}) {
  const { data: saleData, isFetching } = useQuery(['sale', { id: saleId }], async () => posServices.saleDetails(saleId));

  if (isFetching) {
    return <LinearProgress/>;
  }

  return (
    <SaleInvoiceForm toggleOpen={toggleOpen} sale={saleData} /> 
  );
}

function ReceiptDialog({ saleId, toggleOpen}) {
  const { data: saleData, isFetching } = useQuery(['sale', { id: saleId }], async () => posServices.saleDetails(saleId));

  if (isFetching) {
    return <LinearProgress/>;
  }

  return (
    <SaleReceiptForm toggleOpen={toggleOpen} sale={saleData} /> 
  );
}

function SalesListItemTabs ({sale, activeTab, expanded, setActiveTab}) {
  const {checkOrganizationPermission,authOrganization : {organization}} = useJumboAuth();
  const [openDispatchReport, setOpenDispatchReport] = useState(false);
  const [openDispatchDialog, setOpenDispatchDialog] = useState(false)
  const [openInvoicesDialog, setOpenInvoicesDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const accountsPersonnel = checkOrganizationPermission([PERMISSIONS.ACCOUNTS_MASTERS_READ,PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE]);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  if(sale?.status?.toLowerCase() === 'pending'){
    return;
  }

  return(
    <React.Fragment>
      <Grid item xs={12}>
        <Divider/>
        <Tabs
          value={activeTab}
          onChange={(e,newValue) =>setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {!sale.is_instant_sale && 
            <Tab label="Dispatches"/>
          }
          {accountsPersonnel && !sale.vfd_receipt && (!sale.is_instant_sale || sale.payment_method === 'On Account') &&
            <Tab label="Receipts"/>
          }
          {accountsPersonnel && !sale.vfd_receipt && (!!sale.is_invoiceable || !!sale.is_invoiced) &&
            <Tab label="Invoices"/>
          }
        </Tabs>
      </Grid>

      {/*Dispatches*/}
      {activeTab === 0 &&
        <Grid container>
          <Grid item xs={12} textAlign={'end'}>
            {!sale.is_instant_sale && (
              <Tooltip title={belowLargeScreen ? `Download Dispatch Report For ${sale.saleNo}` : `View Dispatch Report For ${sale.saleNo}`}>
                <IconButton onClick={() => setOpenDispatchReport(true)}>
                  <InventoryOutlined/>
                </IconButton>
              </Tooltip> 
              )
            }
            {
              !sale.is_instant_sale && sale.status !== 'Pending' && sale.status !== 'Fulfilled' && checkOrganizationPermission([PERMISSIONS.SALES_DISPATCH]) &&  (
              <Tooltip title={`Dispatch ${sale.saleNo}`}>
                <IconButton onClick={()=> setOpenDispatchDialog(true)}>
                  <FontAwesomeIcon icon={faTruckArrowRight} size={'xs'} />
                </IconButton>
              </Tooltip>
              )
            }
          </Grid>
          <Grid item xs={12}>
            {!sale.is_instant_sale && <SaleDeliveryNotes sale={sale} expanded={expanded}/>}  
          </Grid>
        </Grid>
      }

      {/*Receipts*/}
      {accountsPersonnel && !sale.vfd_receipt && (!sale.is_instant_sale || sale.payment_method === 'On Account') && activeTab === ((!sale.is_instant_sale) ? 1 : 0) && 
        <Grid container>
          {!!sale.is_receiptable &&
            <Grid item xs={12} textAlign={'end'}>
              <Tooltip  title={`Receipt For ${sale.saleNo}`}>
                <IconButton onClick={()=> setOpenReceiptDialog(true)}>
                  <FontAwesomeIcon icon={faReceipt} size={'xs'} />
                </IconButton>
              </Tooltip>
            </Grid> 
          }
          <Grid item xs={12}>
            <SaleReceipts sale={sale} expanded={expanded} activeTab={activeTab}/>
          </Grid>
        </Grid>
      }

      {/*Invoices*/}
      {accountsPersonnel && !sale.vfd_receipt && activeTab === (!sale.is_instant_sale ? 2 : (sale.payment_method === 'On Account' ? 1 : 0)) && (!!sale.is_invoiceable || !!sale.is_invoiced) &&
        <Grid container>
          <Grid item xs={12} textAlign={'end'}>
            {(!!sale.is_invoiceable) &&(
              <Tooltip  title={`Invoice ${sale.saleNo}`}>
                <IconButton onClick={()=> setOpenInvoicesDialog(true)}>
                  <FontAwesomeIcon icon={faFileInvoice} size={'xs'} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={12}>
            <SaleInvoices sale={sale} expanded={expanded} activeTab={activeTab}/>
          </Grid>
        </Grid>
      }
      
      <Dialog
        open={openInvoicesDialog || openDispatchDialog || openDispatchReport || openReceiptDialog}
        maxWidth={openReceiptDialog ? 'md' : 'lg'}
        fullScreen={belowLargeScreen}
        scroll={belowLargeScreen && (openDispatchDialog || openInvoicesDialog || openReceiptDialog) ? 'body' : 'paper'}
        fullWidth
        onClose={() => setOpenDispatchReport(false)}
      >
        {openDispatchReport && (checkOrganizationPermission(PERMISSIONS.SALES_READ) ?  <DispatchReport organization={organization} sale={sale} setOpenDispatchReport={setOpenDispatchReport}/> : <UnauthorizedAccess/>)}
        {openDispatchDialog && (checkOrganizationPermission(PERMISSIONS.SALES_DISPATCH) ?  <DispatchDialog saleId={sale.id} toggleOpen={setOpenDispatchDialog}/> : <UnauthorizedAccess/>)}
        {openInvoicesDialog && (checkOrganizationPermission(PERMISSIONS.SALES_EDIT) ?  <InvoicesDialog saleId={sale.id} toggleOpen={setOpenInvoicesDialog}/> : <UnauthorizedAccess/>)}
        {openReceiptDialog && (checkOrganizationPermission(PERMISSIONS.SALES_EDIT) ?  <ReceiptDialog saleId={sale.id} toggleOpen={setOpenReceiptDialog}/> : <UnauthorizedAccess/>)}
      </Dialog>
    </React.Fragment>
  )
}
  

export default SalesListItemTabs