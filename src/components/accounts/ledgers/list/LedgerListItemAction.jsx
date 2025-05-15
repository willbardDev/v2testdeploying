import { Dialog,Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { DeleteOutlined, EditOutlined, MoreHorizOutlined, ViewTimelineOutlined } from '@mui/icons-material'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { useMutation, useQueryClient } from 'react-query'
import ledgerServices from '../ledger-services'
import LedgerStatementDialogContent from './ledgerStatement/LedgerStatementDialogContent'
import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import { useSnackbar } from 'notistack'
import JumboDdMenu from '@jumbo/components/JumboDdMenu'
import { PERMISSIONS } from 'app/utils/constants/permissions'
import LedgerForm from '../forms/LedgerForm'
import { deviceType } from 'app/helpers/user-agent-helpers'

function LedgerListItemAction({ledger}) {
    const {showDialog,hideDialog} = useJumboDialog();
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const {checkOrganizationPermission} = useJumboAuth();
    const queryClient = useQueryClient();
    const [openEditLedgerFormDialog, setOpenEditLedgerFormDialog] = useState(false);
    const isMobile = deviceType() === 'mobile'

    const { mutate: deleteLedgerMutation } = useMutation(ledgerServices.delete, {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['ledgers-list']);
          enqueueSnackbar(data.message, {
            variant: 'success',
          });
          hideDialog();
        },
        onError: (error) => {
          enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
      });

        const menuItems = [
            ledger?.id > 10 && checkOrganizationPermission(PERMISSIONS.ACCOUNTS_MASTERS_EDIT) && {icon: <EditOutlined/>, title: 'Edit' , action: 'edit'},
            {icon: <ViewTimelineOutlined/>, title: 'Statement', action: 'statement'},
            ledger?.balance?.amount === 0 && ledger?.id > 10 && checkOrganizationPermission(PERMISSIONS.ACCOUNTS_MASTERS_DELETE) && {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
        ]
    
      const handleItemAction = (menuItem) => {
        switch (menuItem.action) {
            case 'edit':
                    setOpenEditLedgerFormDialog(true);
                break;
            case 'statement':
                    setOpenDocumentDialog(true);
                break;
            case 'delete':
                showDialog({
                    title: 'Confirm Ledger',
                    content: 'Are you sure you want to delete this Ledger ?',
                onYes: () =>{ 
                    hideDialog();
                    deleteLedgerMutation(ledger)
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
                open={openDocumentDialog || openEditLedgerFormDialog}
                fullWidth
                fullScreen={isMobile}
                maxWidth={openEditLedgerFormDialog ? 'sm' : 'md'}
            >
                {openDocumentDialog && <LedgerStatementDialogContent ledger={ledger} setOpen={setOpenDocumentDialog} />}
                {openEditLedgerFormDialog && <LedgerForm ledger={ledger} toggleOpen={setOpenEditLedgerFormDialog}/>}
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
  )
}

export default LedgerListItemAction