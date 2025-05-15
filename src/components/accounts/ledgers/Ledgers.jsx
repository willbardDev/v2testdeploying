import React from 'react';
import {Typography } from '@mui/material';
import LedgersList from './list/LedgersList';
import LedgerGroupProvider from '../ledgerGroups/LedgerGroupProvider';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';
import { MODULES } from 'app/utils/constants/modules';

export default function Ledgers(){  
    const {organizationHasSubscribed} = useJumboAuth();

    if(!organizationHasSubscribed(MODULES.ACCOUNTS_AND_FINANCE)){
        return <UnsubscribedAccess modules={'Accounts & Finance'}/>
    }
    
    return (
        <LedgerGroupProvider>
            <Typography variant={'h4'} mb={2}>Ledgers</Typography>
            <LedgersList />
        </LedgerGroupProvider>
    );
}
