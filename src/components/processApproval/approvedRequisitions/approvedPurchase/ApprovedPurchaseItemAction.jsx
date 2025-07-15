import { DeleteOutlined, EditOutlined, HighlightOff, MoreHorizOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useJumboTheme } from '@jumbo/hooks';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import PurchaseOrderPDF from 'app/prosServices/prosERP/procurement/purchases/PurchaseOrderPDF';
import PurchaseOrderOnScreenPreview from 'app/prosServices/prosERP/procurement/purchases/PurchaseOrderOnScreenPreview';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import purchaseServices from 'app/prosServices/prosERP/procurement/purchases/purchase-services';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useSnackbar } from 'notistack';
import ApprovedPurchaseForm from './form/ApprovedPurchaseForm';
import requisitionsServices from '../../requisitionsServices';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import dayjs from 'dayjs';

const DocumentDialog = ({ order_id, organization,checkOrganizationPermission, setOpenDocumentDialog }) => {
    const { data: order, isFetching } = useQuery(['purchaseOrder', { id: order_id }], async () => purchaseServices.orderDetails(order_id));
    const [activeTab, setActiveTab] = useState(0);
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
          {belowLargeScreen && (
            <Grid container alignItems="center" justifyContent="space-between" margin={1}>
              <Grid item xs={11}>
                <Tabs value={activeTab} onChange={handleChange} aria-label="purchase order tabs">
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
          { belowLargeScreen && activeTab === 0 ?
              <PurchaseOrderOnScreenPreview order={order} organization={organization} />
            :
              <PDFContent fileName={order.orderNo} document={<PurchaseOrderPDF order={order} organization={organization} checkOrganizationPermission={checkOrganizationPermission} />} />
            }
        </DialogContent>
        {belowLargeScreen &&
          <DialogActions>
            <Box textAlign="right" marginTop={5}>
              <Button variant="outlined" size='small' color="primary" onClick={() => setOpenDocumentDialog(false)}>
              Close
              </Button>
            </Box>
          </DialogActions>
        }
      </>
    );
};

const EditOrder = ({order, toggleOpen, approvedRequisition}) => {
  const {data:orderData,isFetching} = useQuery(['editPurchaseOrder',{id:order.id}],async() => purchaseServices.getEditComplements(order.id));
  const { data: approvedRequisitionDetails, isFetching: fetchDetails } = useQuery(
    ['requisitionDetails', { id: approvedRequisition.id }],
    async () => requisitionsServices.getApprovedRequisitionDetails(approvedRequisition.id),
  );

  if(isFetching || fetchDetails){
    return <LinearProgress/>;
  }

  return (
    <ApprovedPurchaseForm toggleOpen={toggleOpen} prevApprovedDetails={approvedRequisitionDetails} order={orderData} />
  )
}

const ApprovedPurchaseItemAction = ({approvedRequisition, order}) => {
    const {showDialog,hideDialog} = useJumboDialog();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const {checkOrganizationPermission, authOrganization : {organization}} = useJumboAuth();

    const { mutate: deleteApprovedPurchaseOrder } = useMutation(purchaseServices.delete, {
        onSuccess: (data) => {
        queryClient.invalidateQueries(['approvedPurchaseOrders']);
        queryClient.invalidateQueries(['approvedRequisitions']);
        enqueueSnackbar(data.message, {
            variant: 'success',
        });
        },
        onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const menuItems = [
        {icon: <VisibilityOutlined/> , title: "View", action: "open"},
        (order.status !== 'Fully Received' && (checkOrganizationPermission(PERMISSIONS.PURCHASES_BACKDATE) || order.order_date >= dayjs().startOf('date').toISOString())) && checkOrganizationPermission(PERMISSIONS.APPROVED_REQUISITIONS_PURCHASE) ? {icon: <EditOutlined/>, title: 'Edit', action: 'edit'} : null,
        (order.status !== 'Fully Received' && !order.has_payment_requisition && (checkOrganizationPermission(PERMISSIONS.PURCHASES_BACKDATE) || order.order_date >= dayjs().startOf('date').toISOString())) && checkOrganizationPermission(PERMISSIONS.APPROVED_REQUISITIONS_PURCHASE) ? {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'} : null
    ].filter(item => !!item);

    const handleItemAction = (menuItem) => {
      switch (menuItem.action) {
          case 'open':
              setOpenDocumentDialog(true);
              break;
          case 'edit':
              setOpenEditDialog(true);
              break;
          case 'delete':
              showDialog({
              title: 'Confirm Order',
              content: 'Are you sure you want to delete this Order?',
              onYes: () =>{ 
                  hideDialog();
                  deleteApprovedPurchaseOrder(order)
              },
              onNo: () => hideDialog(),
              variant:'confirm'
              });
              break;
              default:
              break;
        }
    }

  return (
    <>
        <Dialog
            open={openDocumentDialog || openEditDialog}
            scroll={(belowLargeScreen || !openDocumentDialog) ? 'body' : 'paper'}
            fullWidth
            fullScreen={belowLargeScreen}
            maxWidth={openEditDialog ? 'lg' : 'md'}
            onClose={() => {
                setOpenDocumentDialog(false);
            }}
        >
            {openEditDialog && <EditOrder approvedRequisition={approvedRequisition} order={order} toggleOpen={setOpenEditDialog} />}
            {!!openDocumentDialog && <DocumentDialog order_id={order.id} organization={organization} checkOrganizationPermission={checkOrganizationPermission} setOpenDocumentDialog={setOpenDocumentDialog}/>}
        </Dialog>

        <JumboDdMenu
            icon={
                <Tooltip title='Actions'>
                    <MoreHorizOutlined fontSize='small'/>
                </Tooltip>
            }
                menuItems={menuItems}
                onClickCallback={handleItemAction}
        />
    </>
  );
};

export default ApprovedPurchaseItemAction;
