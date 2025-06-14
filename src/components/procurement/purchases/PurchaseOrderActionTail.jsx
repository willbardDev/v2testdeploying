import { AddOutlined } from '@mui/icons-material'
import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { useJumboTheme } from '@jumbo/hooks';
import PurchaseOrderDialogForm from './purchaseOrderForm/PurchaseOrderDialogForm';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function PurchaseOrderActionTail() {
    const {checkOrganizationPermission} = useJumboAuth()
    const [openDialog, setOpenDialog] = useState(false);

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <React.Fragment>
        {
            checkOrganizationPermission(PERMISSIONS.PURCHASES_CREATE) &&
            <>
                <Tooltip title='New Purchase Order'>
                    <IconButton onClick={() => setOpenDialog(true)}>
                        <AddOutlined/>
                    </IconButton>
                </Tooltip>
                <Dialog fullWidth maxWidth='xl' fullScreen={belowLargeScreen} scroll={belowLargeScreen ? 'body' : 'paper'} open={openDialog}>
                    <PurchaseOrderDialogForm toggleOpen={setOpenDialog} />
                </Dialog>
            </>
        }
    </React.Fragment>
  )
}

export default PurchaseOrderActionTail