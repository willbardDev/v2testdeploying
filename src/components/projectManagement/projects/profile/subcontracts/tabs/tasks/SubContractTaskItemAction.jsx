import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Dialog,Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import { useJumboTheme } from '@jumbo/hooks';
import projectsServices from '../../../../projectsServices';
import SubContractTasks from './SubContractTasks';

const SubContractTaskItemAction = ({ subContract, subContractTask, subContractTasks}) => {
    const [openEditDialog,setOpenEditDialog] = useState(false);
    const {showDialog,hideDialog} = useJumboDialog();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const existingTasks = subContractTasks?.flatMap(contract => contract.project_task)

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const { mutate: deleteSubContractTask } = useMutation(projectsServices.deleteSubContractTask, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['subContractTasks']);
            enqueueSnackbar(data.message, {
                variant: 'success',
            });
        },
        onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const menuItems = [
        {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
        {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this Task?',
            onYes: () =>{ 
                hideDialog();
                deleteSubContractTask(subContractTask.id)
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
            open={openEditDialog}
            fullWidth  
            fullScreen={belowLargeScreen}
            maxWidth={'md'} 
            scroll={belowLargeScreen ? 'body' : 'paper'}
        >
            <SubContractTasks existingTasks={existingTasks} subContract={subContract} subContractTask={subContractTask} setOpenDialog={setOpenEditDialog} />
        </Dialog>
        <JumboDdMenu
            icon={
                <Tooltip title='Actions'>
                    <MoreHorizOutlined/>
                </Tooltip>
            }
            menuItems={menuItems}
            onClickCallback={handleItemAction}
        />
    </>
  );
};

export default SubContractTaskItemAction;
