import { DeleteOutlined, MoreHorizOutlined } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import lowStockAlertServices from './lowStockThreshold-services'

const LowStockThresholdItemAction = ({lowStockAlert}) => {
    const {showDialog,hideDialog} = useJumboDialog();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    
    const { mutate: deleteLowStockAlert } = useMutation(lowStockAlertServices.delete, {
        onSuccess: (data) => {
        queryClient.invalidateQueries(['lowStockAlerts']);
        enqueueSnackbar(data.message, {
            variant: 'success',
        });
        },
        onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });
    
    const menuItems = [
        {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];
    
    const handleAlertAction = (menuItem) => {
        switch (menuItem.action) {
        case 'delete':
            showDialog({
            title: 'Confirm Low Stock Alert',
            content: 'Are you sure you want to delete this Low Stock Alert?',
            onYes: () =>{ 
                hideDialog();
                deleteLowStockAlert(lowStockAlert.id)
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
            <JumboDdMenu
            icon={
                <Tooltip title='Actions'>
                <MoreHorizOutlined/>
                </Tooltip>
            }
            menuItems={menuItems}
            onClickCallback={handleAlertAction}
            />
        </>
    );
    }

export default LowStockThresholdItemAction
