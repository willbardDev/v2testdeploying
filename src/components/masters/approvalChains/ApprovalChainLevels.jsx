import React, { useContext, useState } from 'react';
import { Box, Chip, Dialog, Grid, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { EditOutlined, PlaylistAddOutlined, RemoveDoneOutlined, RestoreOutlined } from '@mui/icons-material';
import { approvalChainsListItemContext } from './ApprovalChainsListItem';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useJumboTheme } from '@jumbo/hooks';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import approvalChainsServices from './approvalChainsServices';
import ApprovalStatusSelector from './ApprovalStatusSelector';
import ApprovalChainLevelDialog from './form/ApprovalChainLevelDialog';

function ApprovalChainLevels() {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { showDialog, hideDialog } = useJumboDialog();
    const [openAddLevelDialog, setOpenAddLevelDialog] = useState(false);
    const { approvalChainLevels, queryParams, setQueryParams, approvalChain } = useContext(approvalChainsListItemContext);

    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const [selectedApprovalChainLevel, setSelectedApprovalChainLevel] = useState(null);

    const activateLevel = useMutation(approvalChainsServices.activateLevel, {
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: 'success' });
        queryClient.invalidateQueries(['approvalChainLevels']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
      },
    });

    const deactivateLevel = useMutation(approvalChainsServices.deactivateLevel, {
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: 'success' });
        queryClient.invalidateQueries(['approvalChainLevels']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
      },
    });

  const handleActivationLevel = (approvalChainLevel) => {
    showDialog({
      title: 'Confirm Activation?',
      content: 'If you click yes, this Level will be Activated',
      onYes: () => {
        hideDialog();
        activateLevel.mutate(approvalChainLevel);
      },
      onNo: () => {hideDialog()},
      variant: 'confirm',
    });
  };

  const handleDeactivationLevel = (approvalChainLevel) => {
    showDialog({
      title: 'Confirm Deactivation?',
      content: 'If you click yes, this Level will be Deactivated',
      onYes: () => {
        hideDialog();
        deactivateLevel.mutate(approvalChainLevel.id);
      },
      onNo: () => {hideDialog()},
      variant: 'confirm',
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center" padding={1}>
        <Grid item xs={12} md={10}>
          {approvalChainLevels?.length > 0 && (
            <Typography variant="body1">Chain Levels</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={2} container justifyContent="flex-end" alignItems="center">
          <Grid item xs={11}>
            <ApprovalStatusSelector
              value={queryParams.status}
              onChange={(status) => {
                setQueryParams((prev) => ({ ...prev, status }));
              }}
            />
          </Grid>

          {approvalChain?.status === 'active' && (
            <Grid item xs={1}>
              <Tooltip title={`Add Level`}>
                <IconButton onClick={() => setOpenAddLevelDialog(true)}>
                  <PlaylistAddOutlined />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Grid>
      {approvalChainLevels &&
        approvalChainLevels.map((approvalChainLevel) => (
          <Grid
            key={approvalChainLevel.id}
            sx={{
              cursor: 'pointer',
              borderTop: 2,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              paddingX: 1,
            }}
            columnSpacing={2}
            paddingTop={1}
            alignItems={'center'}
            container
          >
            <Grid item xs={6} md={4}>
              <Tooltip title={'Role Name'}>
                <Typography>{approvalChainLevel?.role.name}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={6} md={3}>
              <Tooltip title={'Label'}>
                <Typography>{approvalChainLevel?.label}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={6} md={4} display={'flex'} alignItems={{md: 'end'}} justifyContent={{md: 'end'}}>
              <Tooltip title={'Status'}>
                <Chip
                  size="small"
                  label={approvalChainLevel.status}
                  color={
                    approvalChainLevel.status === 'active'
                      ? 'success'
                      : 'warning'
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} md={1}>
              <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'flex-end'}
              >
                {approvalChain.status === 'active' && approvalChainLevel.status === 'active' && 
                  <Tooltip title={`Deactivate Level`}>
                    <IconButton
                      onClick={() => {
                        handleDeactivationLevel(approvalChainLevel);
                      }}
                    >
                      <RemoveDoneOutlined color={'error'}/>
                    </IconButton>
                  </Tooltip>
                }
                {approvalChain.status === 'active' && approvalChainLevel.status !== 'active' && 
                  <Tooltip title={`Activate Level`}>
                    <IconButton
                      onClick={() => {
                        handleActivationLevel(approvalChainLevel);
                      }}
                    >
                      <RestoreOutlined />
                    </IconButton>
                  </Tooltip>
                }
                {approvalChain.status === 'active' && approvalChainLevel?.status === 'active' && (
                  <Tooltip title={`Edit Level`}>
                    <IconButton onClick={() => {
                      setSelectedApprovalChainLevel(approvalChainLevel); 
                      setOpenEditDialog(true);
                    }}>
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          </Grid>
        ))
      }

      <Dialog
        open={openEditDialog || openAddLevelDialog}
        fullWidth   
        fullScreen={belowLargeScreen}
        maxWidth={'md'}
        scroll={belowLargeScreen  ? 'body' : 'paper'}
      >
        {openEditDialog && selectedApprovalChainLevel && (
          <ApprovalChainLevelDialog
            approvalChainLevel={selectedApprovalChainLevel}
            toggleOpen={setOpenEditDialog}
            approvalChainLevels={approvalChainLevels}
          />
        )}
        {openAddLevelDialog && <ApprovalChainLevelDialog approvalChain={approvalChain} toggleOpen={setOpenAddLevelDialog} />}
      </Dialog>
    </React.Fragment>
  );
}

export default ApprovalChainLevels;
