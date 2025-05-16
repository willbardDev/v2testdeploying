import { EditOutlined, MoreHorizOutlined} from '@mui/icons-material';
import { Dialog,LinearProgress,Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import costCenterservices from './cost-center-services';
import CostCenterForm from './CostCenterForm';

function EditCostCenter({ costCenterId, setOpenDialog}) {
  const { data: costCenter, isFetching } = useQuery(['sale', { id: costCenterId}], async () => costCenterservices.costCenterDetails(costCenterId));

  if (isFetching) {
    return <LinearProgress/>;
  }

  return (
    <CostCenterForm setOpenDialog={setOpenDialog} costCenter={costCenter} />
  );
}

const CostCenterItemAction = ({costCenter}) => {
  const [openEditDialog,setOpenEditDialog] = useState(false);
  const {showDialog,hideDialog} = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteCostCenter } = useMutation(costCenterservices.delete, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['costCenters']);
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
    // {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'}
  ]

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
          title: 'Confirm Cost Center',
          content: 'Are you sure you want to delete this Cost Center?',
          onYes: () =>{ 
            hideDialog();
            deleteCostCenter(costCenter.id)
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
          maxWidth="sm" 
        >
          <EditCostCenter costCenterId={costCenter.id} setOpenDialog={setOpenEditDialog} />
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

export default CostCenterItemAction;
