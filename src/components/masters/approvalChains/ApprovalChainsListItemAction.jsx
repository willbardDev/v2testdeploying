import React, { useState } from 'react';
import {
  Tooltip,
  IconButton,
  Dialog,
  useMediaQuery
} from '@mui/material';
import {
  BlockOutlined,
  EditOutlined,
  RestoreOutlined,
} from '@mui/icons-material';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { useJumboTheme } from '@jumbo/hooks';
import EditChainDialog from './form/EditChainDialog';
import approvalChainsServices from './approvalChainsServices';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function ApprovalChainsListItemAction({ approvalChain }) {
  const { showDialog, hideDialog } = useJumboDialog();
  const {checkOrganizationPermission} = useJumboAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const activateChain = useMutation(approvalChainsServices.activateChain, {
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['approvalChains']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
    },
  });

  const deactivateChain = useMutation(approvalChainsServices.deactivateChain, {
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries(['approvalChains']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
    },
  });

  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleActivation = () => {
    showDialog({
      title: 'Confirm Activation?',
      content: 'If you click yes, this Chain will be Activated',
      onYes: () => {
        hideDialog();
        activateChain.mutate(approvalChain);
      },
      onNo: () => hideDialog(),
      variant: 'confirm',
    });
  };

  const handleDeactivation = () => {
    showDialog({
      title: 'Confirm Deactivation?',
      content: 'If you click yes, this Chain will be Deactivated',
      onYes: () => {
        hideDialog();
        deactivateChain.mutate(approvalChain.id);
      },
      onNo: () => hideDialog(),
      variant: 'confirm',
    });
  };

  return (
    <React.Fragment>
      <Dialog
        open={openEditDialog}
        fullWidth   
        fullScreen={belowLargeScreen}
        maxWidth={'md'}
        scroll={belowLargeScreen  ? 'body' : 'paper'}
      >
        {openEditDialog && <EditChainDialog approvalChain={approvalChain} toggleOpen={setOpenEditDialog} />}
      </Dialog>

      {(approvalChain?.status !== 'active') && (
        <Tooltip  title={`Activate Chain`}>
          <IconButton onClick={() => handleActivation()}>
            <RestoreOutlined />
          </IconButton>
        </Tooltip>
      )}

      {(checkOrganizationPermission([PERMISSIONS.APPROVAL_CHAINS_DEACTIVATE]) && !!approvalChain?.cost_center_id && approvalChain?.status === 'active') && (
        <Tooltip  title={`Deactivate Approval Chain`}>
          <IconButton onClick={() => handleDeactivation()} color={'info'}>
            <BlockOutlined color={'error'}/>
          </IconButton>
        </Tooltip>
      )}

      {checkOrganizationPermission([PERMISSIONS.APPROVAL_CHAINS_EDIT]) && approvalChain.cost_center_id !== null && approvalChain?.status === 'active' && (
        <Tooltip title={`Edit Chain`}>
          <IconButton onClick={() => setOpenEditDialog(true)}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );
}

export default ApprovalChainsListItemAction;
