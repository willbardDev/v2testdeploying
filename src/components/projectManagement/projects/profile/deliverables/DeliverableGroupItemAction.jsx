import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import React, {  useState} from 'react'
import { DeleteOutlined, EditOutlined, MoreHorizOutlined, PlaylistAddCheck} from '@mui/icons-material'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from 'react-query'
import DeliverablesForm from './DeliverablesForm'
import projectsServices from '../../projectsServices'
import DeliverableGroupForm from './DeliverableGroupForm'
import { useJumboTheme } from '@jumbo/hooks'
import JumboDdMenu from '@jumbo/components/JumboDdMenu'

function DeliverableGroupItemAction({group, isAccDetails}) {
    const {showDialog,hideDialog} = useJumboDialog();
    const {enqueueSnackbar} = useSnackbar();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();

      //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const deleteDeliverableGroup = useMutation(projectsServices.deleteDeliverableGroup,{
        onSuccess: (data) => {
            enqueueSnackbar(data.message,{variant : 'success'});
            queryClient.invalidateQueries(['projectDeliverableGroups']);
        },
        onError: (error) => {
            enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const menuItems = [
        {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
        !(group.children.length > 0 || group.deliverables.length > 0) &&{icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];

    const handleItemAction = (menuItem) => {
        switch (menuItem.action) {
          case 'edit':
            setOpenEditDialog(true);
            break;
          case 'delete':
            showDialog({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this Deliverable Group?',
                onYes: () =>{ 
                    hideDialog();
                    deleteDeliverableGroup.mutate(group);
                },
                onNo: () => hideDialog(),
                variant:'confirm'
            });
            break;
            default:
            break;
        }
      }

  return  (
    <React.Fragment>
        <Dialog
            open={openEditDialog || openDialog}
            fullScreen={belowLargeScreen}
            fullWidth
            maxWidth={'md'}
            scroll={belowLargeScreen ? 'body' : 'paper'}
        >
            {openEditDialog && <DeliverableGroupForm deliverableGroup={group} setOpenDialog={setOpenEditDialog} /> }
            {openDialog && <DeliverablesForm setOpenDialog={setOpenDialog} group={group}/> }
        </Dialog>

        {!isAccDetails &&
            <JumboDdMenu
                icon={
                    <Tooltip title='Actions'>
                        <MoreHorizOutlined/>
                    </Tooltip>
                }
                menuItems={menuItems}
                onClickCallback={handleItemAction}
            />
        }

        {!!isAccDetails &&
            <Tooltip title={"Add Deliverable"}>
                <IconButton onClick={() => setOpenDialog(true)}>
                    <PlaylistAddCheck/>
                </IconButton>
            </Tooltip>
        }

      </React.Fragment>
  )
}

export default DeliverableGroupItemAction