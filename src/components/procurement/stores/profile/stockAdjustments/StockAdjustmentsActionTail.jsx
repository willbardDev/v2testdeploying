import { AddOutlined } from '@mui/icons-material'
import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import React from 'react'
import StockAdjustmentDialogForm from './StockAdjustmentDialogForm';
import { useJumboTheme } from '@jumbo/hooks';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function StockAdjustmentsActionTail() {
    const {checkOrganizationPermission} = useJumboAuth();
    const [openDialog, setOpenDialog] = React.useState(false);
    
    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <React.Fragment>
        {checkOrganizationPermission(PERMISSIONS.STOCK_ADJUSTMENTS_CREATE) &&
            <Tooltip title='New Stock Adjustment'>
                <IconButton onClick={() => setOpenDialog(true)}>
                    <AddOutlined/>
                </IconButton>
            </Tooltip>
        }
        <Dialog fullWidth fullScreen={belowLargeScreen} open={openDialog} scroll={belowLargeScreen ? 'body' : 'paper'} maxWidth='md'>
            <StockAdjustmentDialogForm toggleOpen={setOpenDialog} />
        </Dialog>
    </React.Fragment>
  )
}

export default StockAdjustmentsActionTail