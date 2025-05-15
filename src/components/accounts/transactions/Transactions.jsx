import React from 'react'
import { createContext, useContext } from "react"
import TransactionsList from "./TransactionsList"
import LedgerSelectProvider from '../ledgers/forms/LedgerSelectProvider';
import CurrencySelectProvider from '../../masters/Currencies/CurrencySelectProvider';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { MODULES } from 'app/utils/constants/modules';

export const TransactionsAppContext = createContext({});

export const useTransactionApp = () => {
    return useContext(TransactionsAppContext);
}

const TRANSACTION_ACTIONS = {
    SET_SELECTED_ITEMS: "set-selected-items",
    SET_TRANSACTION_LIST_REFRESH: "set-transactions-list-refresh",
};

const init = (appState) => appState;

const TransactionReducer = (state, action) => {
    switch (action.type) {
        case TRANSACTION_ACTIONS.SET_SELECTED_ITEMS:
            return {
                ...state,
                selectedTransactions: action?.payload
            };
        case TRANSACTION_ACTIONS.SET_TRANSACTION_LIST_REFRESH:
            return {
                ...state,
                refreshTransactionsList: action.payload,
            };
        default:
            return state;
    }

};

export default function Transactions(){
    const [transactionsApp, setTransactionsApp] = React.useReducer(TransactionReducer, {
        selectedTransactions: [],
        refreshTransactionsList: false
    }, init);

    const setSelectedTransactions = React.useCallback((transactions) => {
        setTransactionsApp({type: TRANSACTION_ACTIONS.SET_SELECTED_ITEMS, payload: transactions});
    }, [setTransactionsApp]);

    const setTransactionsListRefresh = React.useCallback((refresh) => {
        setTransactionsApp({type: TRANSACTION_ACTIONS.SET_TRANSACTION_LIST_REFRESH, payload: refresh})
    }, [setTransactionsApp]);

    const contextValue = {
        ...transactionsApp,
        setSelectedTransactions: setSelectedTransactions,
        setTransactionsListRefresh: setTransactionsListRefresh
    }

    const {checkOrganizationPermission,organizationHasSubscribed} = useJumboAuth();

    if(!organizationHasSubscribed(MODULES.ACCOUNTS_AND_FINANCE)){
        return <UnsubscribedAccess modules={'Accounts & Finance'}/>
    }

    if(!checkOrganizationPermission([
        PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
        PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
        PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
        PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
        PERMISSIONS.PAYMENTS_READ,
        PERMISSIONS.PAYMENTS_CREATE,
        PERMISSIONS.PAYMENTS_EDIT,
        PERMISSIONS.PAYMENTS_DELETE,
        PERMISSIONS.FUND_TRANSFERS_READ,
        PERMISSIONS.FUND_TRANSFERS_CREATE,
        PERMISSIONS.FUND_TRANSFERS_DELETE,
        PERMISSIONS.FUND_TRANSFERS_EDIT,
        PERMISSIONS.RECEIPTS_READ,
        PERMISSIONS.RECEIPTS_EDIT,
        PERMISSIONS.RECEIPTS_CREATE,
        PERMISSIONS.RECEIPTS_DELETE,
        PERMISSIONS.JOURNAL_VOUCHERS_READ,
        PERMISSIONS.JOURNAL_VOUCHERS_CREATE,
        PERMISSIONS.JOURNAL_VOUCHERS_DELETE,
        PERMISSIONS.JOURNAL_VOUCHERS_EDIT
    ])){
        return <UnauthorizedAccess/>;
    }
  
    return (
        <TransactionsAppContext.Provider value={contextValue}>
            <CurrencySelectProvider>
                <LedgerSelectProvider>
                    <TransactionsList/>
                </LedgerSelectProvider>
            </CurrencySelectProvider>
        </TransactionsAppContext.Provider>
    )
}