import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import {Card, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import TransactionListItem from './TransactionListItem';
import { useTransactionApp } from './Transactions';
import transactionServices from './transactions-services';
import TransactionsActionTail from './TransactionsActionTail';
import TransactionsTypeSelector from './TransactionsTypeSelector';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { EventAvailableOutlined, FilterAltOffOutlined, FilterAltOutlined } from '@mui/icons-material';
import CostCenterSelector from '../../masters/costCenters/CostCenterSelector';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function TransactionsList() {
    const params = useParams();
    const listRef = React.useRef();
    const [openFilters, setOpenFilters] = useState(false);
    const {setSelectedTransactions,setTransactionsListRefresh,refreshTransactionsList} = useTransactionApp();
    const {authOrganization, checkOrganizationPermission} = useJumboAuth();
    const [selectedCostCenter, setSelectedCostCenter] = useState([])
    const [filterDate, setFilterDate] = useState({})

    const availableTypes = React.useMemo(() => {
        const typeOptions = [
            { 
                value: 'payments', label: 'Payments', 
                permission: [
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
                    PERMISSIONS.PAYMENTS_READ,
                    PERMISSIONS.PAYMENTS_CREATE,
                    PERMISSIONS.PAYMENTS_EDIT,
                    PERMISSIONS.PAYMENTS_DELETE,
                ] 
            },
            {
                value: 'receipts', label: 'Receipts', 
                permission: [
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
                    PERMISSIONS.RECEIPTS_READ,
                    PERMISSIONS.RECEIPTS_EDIT,
                    PERMISSIONS.RECEIPTS_CREATE,
                    PERMISSIONS.RECEIPTS_DELETE,
                ] 
            },
            { 
                value: 'journal_vouchers', label: 'Journal Vouchers', 
                permission: [
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
                    PERMISSIONS.JOURNAL_VOUCHERS_READ,
                    PERMISSIONS.JOURNAL_VOUCHERS_CREATE,
                    PERMISSIONS.JOURNAL_VOUCHERS_DELETE,
                    PERMISSIONS.JOURNAL_VOUCHERS_EDIT
                ] 
            },
            { 
                value: 'transfers', label: 'Transfers', 
                permission: [
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
                    PERMISSIONS.FUND_TRANSFERS_READ,
                    PERMISSIONS.FUND_TRANSFERS_CREATE,
                    PERMISSIONS.FUND_TRANSFERS_DELETE,
                    PERMISSIONS.FUND_TRANSFERS_EDIT
                ] 
            },
        ];
        return typeOptions.filter(opt => checkOrganizationPermission(opt?.permission));
    }, [checkOrganizationPermission]);

    const defaultType = availableTypes[0]?.value ?? 'payments';

    const [queryOptions, setQueryOptions] = useState({
        queryKey: "transactions",
        queryParams: {
          id: params.id,
          keyword: '',
          type: defaultType,
          cost_center_ids: authOrganization?.costCenters.map(cost_center => cost_center.id)
        },
        countKey: "total",
        dataKey: "data",
    });

    React.useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {...state.queryParams, id: params.id}
        }))
    }, [params]);

    React.useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                cost_center_ids: selectedCostCenter.map(c => c.id)
            }
        }));
    }, [selectedCostCenter]);

    React.useEffect(() => {
        if (refreshTransactionsList) {
            listRef.current.refresh();
            setTransactionsListRefresh(false);
        }
    }, [setTransactionsListRefresh]);

    const renderTransaction = React.useCallback((transaction) => {
        return (
            <TransactionListItem transaction={transaction} type={queryOptions.queryParams.type} />
        )
    });

    const handleOnTypeChange = React.useCallback((type) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                type: type
            }
        }));
        document.title = type.charAt(0)?.toUpperCase() + type.slice(1).replace(/_/g, " ");
    }, [queryOptions.queryParams.type]);

    const handleOnKeywordChange = React.useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                keyword: keyword,
            }
        }))
    }, []);
    
    const multiCostCenters = authOrganization?.costCenters.length > 1

    return (
        <React.Fragment>
            <Typography sx={{ textTransform: 'capitalize' }} variant={'h4'} mb={2}>{queryOptions.queryParams.type.replace(/_/g, " ")}</Typography>
            <JumboRqList
                ref={listRef}
                wrapperComponent={Card}
                service={transactionServices.getList}
                primaryKey={"id"}
                queryOptions={queryOptions}
                itemsPerPage={10}
                itemsPerPageOptions={[10, 20,30,50,100,150]}
                renderItem={renderTransaction}
                componentElement={"div"}
                bulkActions={null}
                wrapperSx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
                toolbar={
                    <JumboListToolbar
                        hideItemsPerPage={true}
                        action={
                            <Grid container columnSpacing={1} rowSpacing={1} justifyContent={'end'}>
                                { 
                                openFilters &&
                                    <>
                                        <Grid item xs={12} lg={12}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={6}>
                                                    <DateTimePicker
                                                        label="From"
                                                        defaultValue={filterDate.from ? dayjs(filterDate.from) : null}
                                                        minDate={dayjs(authOrganization?.organization?.recording_start_date)}
                                                        slotProps={{
                                                            textField : {
                                                            size: 'small',
                                                            fullWidth: true,
                                                            }
                                                        }}
                                                        onChange={(value) => {
                                                            setFilterDate((filters) => { return {...filters,from: value.toISOString()}; });
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={11} md={5.5}>
                                                    <DateTimePicker
                                                        label="To"
                                                        defaultValue={ filterDate.to ? dayjs(filterDate.to) : null}
                                                        minDate={dayjs(filterDate.from)}
                                                        slotProps={{
                                                            textField : {
                                                            size: 'small',
                                                            fullWidth: true,
                                                            }
                                                        }}
                                                        onChange={(value) => {
                                                            setFilterDate((filters) => { return {...filters,to: value.toISOString()}; });
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={1} md={0.5} alignContent={'end'}>
                                                    <Tooltip title="Filter Dates">
                                                        <IconButton onClick={() => {
                                                            setQueryOptions(state => ({
                                                                ...state,
                                                                queryParams: {
                                                                    ...state.queryParams,
                                                                    from: filterDate.from,
                                                                    to: filterDate.to
                                                                }
                                                            }));
                                                        }}>
                                                            <EventAvailableOutlined/>
                                                        </IconButton> 
                                                    </Tooltip>   
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </> 
                                }
                                <Grid item xs={12} md={6} lg={3} alignItems={'center'}>
                                    <TransactionsTypeSelector
                                        value={queryOptions.queryParams.type}
                                        onChange={handleOnTypeChange}
                                    />
                                </Grid>
                                {
                                multiCostCenters &&
                                    <Grid item xs={12} md={6} lg={3}>
                                        <CostCenterSelector
                                            label="Cost Centers"
                                            allowSameType={true}
                                            defaultValue={selectedCostCenter}
                                            onChange={(newValue) => {
                                                setSelectedCostCenter(newValue);
                                            }}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={1} lg={0.5}>
                                    <Tooltip title={!openFilters ? 'Filter' : 'Clear Filters'}>
                                        <IconButton size='small' onClick={() => {
                                            setOpenFilters(!openFilters);
                                            openFilters && setFilterDate({from: null, to: null});
                                            openFilters &&
                                                setQueryOptions(state => ({
                                                    ...state,
                                                    queryParams: {
                                                    ...state.queryParams,
                                                    from: null,
                                                    to: null,
                                                    }
                                                }));
                                        }}>
                                            {!openFilters ? <FilterAltOutlined/> : <FilterAltOffOutlined/>}
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={10} lg={5}>
                                    <JumboSearch
                                        onChange={handleOnKeywordChange}
                                        value={queryOptions.queryParams.keyword}
                                    />
                                </Grid>
                                <Grid item xs={1} lg={0.5}>
                                    <TransactionsActionTail type={queryOptions.queryParams.type} /> 
                                </Grid>
                            </Grid>
                        }
                    >
                    </JumboListToolbar>
                }
                onSelectionChange={setSelectedTransactions}
                
            />
        </React.Fragment>
    );
}

export default TransactionsList