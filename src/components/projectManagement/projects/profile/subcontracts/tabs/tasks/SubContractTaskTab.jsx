import { Grid } from '@mui/material'
import React from 'react'
import SubContractTasksActionTail from './SubContractTasksActionTail'
import SubContractTasksListItem from './SubContractTasksListItem'
import projectsServices from '../../../../projectsServices';
import { useQuery } from 'react-query';

function SubContractTaskTab({subContract, isExpanded}) {
    const { data: subContractTasks, isLoading } = useQuery(
        ['subContractTasks', { id: subContract.id }],
        async () => projectsServices.getSubContractTasks(subContract.id),
        {
            enabled: !!isExpanded,
        }
    );
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} textAlign={'end'}>
            <SubContractTasksActionTail subContract={subContract} subContractTasks={subContractTasks}/>
        </Grid>
        <Grid item xs={12}>
            <SubContractTasksListItem subContract={subContract} subContractTasks={subContractTasks} isLoading={isLoading}/>
        </Grid>
    </Grid>
  )
}

export default SubContractTaskTab