import { DisabledByDefault } from '@mui/icons-material'
import { Divider, Grid, IconButton, ListItemText, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import projectsServices from '../../../../projectsServices';

function SubContractTasksRow({ subContractTask, index}) {
    const {enqueueSnackbar} = useSnackbar();
    const {showDialog,hideDialog} = useJumboDialog();
    const queryClient = useQueryClient();

    const deleteExistingBudgetItem = useMutation(projectsServices.deleteExistingBudgetItem,{
      onSuccess: (data) => {
        enqueueSnackbar(data.message,{variant : 'success'});
        queryClient.invalidateQueries(['budgetItemsDetails']);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data.message,{variant : 'error'});
      },
    });

    const handleDelete = () => {
      showDialog({
        title: 'Confirm Delete?',
        content: 'If you click yes, this SubContract Task will be deleted',
      onYes: () => {
        hideDialog();
        deleteExistingBudgetItem.mutate({ id: subContractTask.id, type: 'subcontract_task' });
      },
      onNo: () => hideDialog(),
        variant: 'confirm'
      });
    }

  return (
    <React.Fragment>
      <Divider/>
        <Grid container 
          sx={{
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <Grid item xs={1} md={0.4}>
            {index+1}.
          </Grid>
          <Grid item xs={11} md={2.1}>
            <ListItemText
              primary={
                <Tooltip title="Task name">
                  <Typography component="span">{subContractTask.project_task?.name}</Typography>
                </Tooltip>
              }
              secondary={
                <Tooltip title="Description">
                  <Typography component="span">{subContractTask.description}</Typography>
                </Tooltip>
              }
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <Tooltip title="Expense name">
              <Typography>{subContractTask.expense_ledger.name}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={1.5} textAlign={{md: 'right'}}>
            <Tooltip title="Quantity">
              <Typography>{subContractTask.quantity.toLocaleString()} {subContractTask.project_task?.measurement_unit?.symbol}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={5.5} md={1.5} textAlign={{md: 'right'}}>
            <Tooltip title="Rate">
              <Typography>{subContractTask.rate.toLocaleString('en-US', 
                {
                  style: 'currency',
                  currency: subContractTask.currency?.code,
                })}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={5.5} md={2} textAlign={{md: 'right'}}>
            <Tooltip title="Amount">
              <Typography>{(subContractTask.quantity * subContractTask.rate).toLocaleString('en-US', 
                {
                  style: 'currency',
                  currency: subContractTask.currency?.code,
                })}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid textAlign={'end'} item xs={1} md={0.5}>
            <Tooltip title='Remove SubContract Task'>
              <IconButton size='small' 
                onClick={() => {
                  handleDelete();
                }}
              >
                <DisabledByDefault fontSize='small' color='error' />
              </IconButton>
              </Tooltip>
          </Grid>
        </Grid>
    </React.Fragment>
  )
}

export default SubContractTasksRow