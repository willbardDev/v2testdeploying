import React from 'react';
import { Divider, Grid, Tooltip, Typography } from '@mui/material';
import LedgerListItemAction from 'app/prosServices/prosERP/accounts/ledgers/list/LedgerListItemAction';

const LedgerListItem = ({ ledger, type }) => {
  return (
    <React.Fragment>
        <Divider/>
        <Grid
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.hover',
                }
            }}  
            padding={1}
            columnSpacing={1}
            alignItems={'center'}
            container
        >
        <Grid item xs={6} md={4}>
            <Tooltip title={'Name (Alias)'}>
              <Typography variant={"body1"}>{` ${ledger?.name} `+ (ledger.alias !== null ? `(${ledger.alias})` : '')}</Typography>
            </Tooltip>
        </Grid>
        <Grid item xs={6} md={4}>
            <Tooltip title={'Nature:Group'}>
            <Typography variant={"body1"}>{ledger?.ledger_group?.nature.name +' : '+ ledger?.ledger_group.name}</Typography>
            </Tooltip>
        </Grid>
            <Grid item xs={6} md={3.5} sx={{ textAlign: { 'md': 'right'} }}>
                <Tooltip title='Balance'>
                    <Typography variant={"body1"}>{ledger?.balance?.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} {`${ledger?.balance?.side}`}</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={6} md={0.5} textAlign={"end"}>
              <LedgerListItemAction ledger={ledger}/>
            </Grid> 
        </Grid>
    </React.Fragment>
  );
};

export default LedgerListItem;