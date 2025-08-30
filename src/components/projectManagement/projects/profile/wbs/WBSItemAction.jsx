import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import React, {  useState} from 'react'
import { DeleteOutlined, EditOutlined, MoreHorizOutlined, PlaylistAddCheck} from '@mui/icons-material'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from 'react-query'
import { useJumboTheme } from '@jumbo/hooks'
import JumboDdMenu from '@jumbo/components/JumboDdMenu'
import projectsServices from '../../projectsServices'
import WBSForm from './WBSForm'

function WBSItemAction({activity, isAccDetails}) {
    const {showDialog,hideDialog} = useJumboDialog();
    const {enqueueSnackbar} = useSnackbar();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();

      //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const deleteTimelineActivity = useMutation(projectsServices.deleteTimelineActivity,{
        onSuccess: (data) => {
            enqueueSnackbar(data.message,{variant : 'success'});
            queryClient.invalidateQueries(['projectTimelineActivities']);
        },
        onError: (error) => {
            enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
        },
    });

    const menuItems = [
        {icon: <EditOutlined/>, title: 'Edit', action: 'edit'},
        !(activity.children.length > 0 || activity.tasks.length > 0) &&{icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
    ];

    const handleItemAction = (menuItem) => {
        switch (menuItem.action) {
          case 'edit':
            setOpenEditDialog(true);
            break;
          case 'delete':
            showDialog({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this Timeline Activity?',
                onYes: () =>{ 
                    hideDialog();
                    deleteTimelineActivity.mutate(activity);
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
            {openEditDialog && <WBSForm timelineActivity={activity} setOpenDialog={setOpenEditDialog} /> }
            {openDialog && <WBSForm setOpenDialog={setOpenDialog} parentActivity={activity}/> }
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
            <Tooltip title={"Add Sub Activity"}>
                <IconButton onClick={() => setOpenDialog(true)}>
                    <PlaylistAddCheck/>
                </IconButton>
            </Tooltip>
        }

      </React.Fragment>
  )
}

export default WBSItemAction