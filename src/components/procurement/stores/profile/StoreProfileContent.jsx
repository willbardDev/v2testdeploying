import { Box, LinearProgress, Tab, Tabs } from '@mui/material'
import React, { lazy } from 'react'
import { useStoreProfile } from './StoreProfileProvider'
import { PERMISSIONS } from 'app/utils/constants/permissions';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

const StoreReports = lazy(() => import('./reports/StoreReports'));
const StockAdjustments = lazy(() => import('./stockAdjustments/StockAdjustments'));
const Transfer = lazy(() => import('./inventoryTransfer/InventoryTransfer'));
const InventoryConsumptions = lazy(() => import('../../inventoryConsumptions/InventoryConsumptionsTab'));
const Grns = lazy(() => import('../../grns/Grns'));
const StoreStock = lazy(() => import('./storeStock/StoreStock'));

function StoreProfileContent() {
  const {checkOrganizationPermission} = useJumboAuth();
  const {setContent,content,isFetchingStore, activeStore} = useStoreProfile();

  if(isFetchingStore){
    return <LinearProgress/>
  }

  let contentComponent;;
  if(content === 0){
    document.title = `Store Stock | ${activeStore?.name}`;
    contentComponent = <StoreStock/>
  }else if(content === 1){
    document.title = `GRNs | ${activeStore?.name}`;
    contentComponent = <Grns />
  }else if(content ===   2){
    document.title = `Inventory Transfers | ${activeStore?.name}`;
    contentComponent = <Transfer/>;
  }else if(content === 3){
    document.title = `Inventory Consumptions | ${activeStore?.name}`;
    contentComponent = <InventoryConsumptions/>
  }
  else if(checkOrganizationPermission([PERMISSIONS.STOCK_ADJUSTMENTS_READ, PERMISSIONS.STOCK_ADJUSTMENTS_CREATE, PERMISSIONS.STOCK_ADJUSTMENTS_EDIT, PERMISSIONS.STOCK_ADJUSTMENTS_DELETE]) && content === 4) {
    document.title = `Stock Adjustments | ${activeStore?.name}`;
    contentComponent = <StockAdjustments />;
  } else {
    document.title = `Store Reports | ${activeStore?.name}`
    contentComponent = <StoreReports/>
  }
  return (
    <Box p={1} sx={{
       bgcolor: 'background.paper',
       borderRadius: '15px',
      } }>
      <Tabs 
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        value={content} onChange={(event, newValue) => setContent(newValue)}>
          <Tab label="Stock" />
          <Tab label="GRNs" />
          <Tab label="Transfers" />
          <Tab label="Consumptions" />
          {checkOrganizationPermission([PERMISSIONS.STOCK_ADJUSTMENTS_READ, PERMISSIONS.STOCK_ADJUSTMENTS_CREATE, PERMISSIONS.STOCK_ADJUSTMENTS_EDIT, PERMISSIONS.STOCK_ADJUSTMENTS_DELETE]) && <Tab label="Adjustments" />}
          <Tab label="Reports" />
      </Tabs>
        {contentComponent}
    </Box>
  )
}

export default StoreProfileContent