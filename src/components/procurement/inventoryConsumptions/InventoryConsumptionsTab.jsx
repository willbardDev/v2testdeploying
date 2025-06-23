'use client'

import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import { Box, Grid, IconButton, Stack, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ProductsSelectProvider from '../../productAndServices/products/ProductsSelectProvider';
import inventoryConsumptionsServices from './inventoryConsumptionsServices';
import InventoryConsumptionsListItem from './InventoryConsumptionListItem';
import { useStoreProfile } from '../stores/profile/StoreProfileProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { EventAvailableOutlined, FilterAltOffOutlined, FilterAltOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import InventoryConsumptionsActionTail from './InventoryConsumptionsActionTail';
import { useParams } from 'next/navigation';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import LedgerSelectProvider from '@/components/accounts/ledgers/forms/LedgerSelectProvider';

const InventoryConsumptionsTab = () => {
  const {activeStore:store} = useStoreProfile();
  const params = useParams();
  const listRef = React.useRef();
  let consumptionTab = true; 
  const [openFilters, setOpenFilters] = useState(false);
  const {authOrganization} = useJumboAuth();
  const [filterDate, setFilterDate] = useState({})
  
  const [queryOptions, setQueryOptions] = React.useState({
    queryKey: "inventoryConsumptions",
    queryParams: {id: params.store_id, keyword : ''},
    countKey: "total",
    dataKey: "data",
  });

  React.useEffect(() => {
    setQueryOptions(state => ({
        ...state,
        queryParams: {...state.queryParams, id: store?.id ? store.id : params.store_id}
    }))
}, [store]);

  const renderConsumption = React.useCallback((inventoryConsumption) => {
      return (<InventoryConsumptionsListItem inventoryConsumption={inventoryConsumption} consumptionTab={consumptionTab}/>)
  });

    useEffect(() => {
        setQueryOptions(state => ({
        ...state,
        queryParams: {
            ...state.queryParams,
            from: filterDate.from,
            to: filterDate.to
        }
        }));
    }, [filterDate])

    const handleOnChange = React.useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                keyword: keyword,
            }
        }))
    }, []);

return (
    <LedgerSelectProvider>
        <ProductsSelectProvider>
            <React.Fragment>
                <JumboRqList
                    ref={listRef}
                    wrapperComponent={Box}
                    service={inventoryConsumptionsServices.getList}
                    primaryKey={"id"}
                    queryOptions={queryOptions}
                    itemsPerPage={10}
                    itemsPerPageOptions={[8,10, 15, 20]}
                    renderItem={renderConsumption}
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
                                            <Grid size={{xs: 12, md: 5.5, lg: 3}}>
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
                                            <Grid size={{xs: 12, md: 5.5, lg: 3}}>
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
                                            <Grid size={{xs: 1.5, md: 1, lg: 0.5}} alignContent={'end'}>
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
                                        </>
                                    }
                                    <Grid size={{xs: 1.5, md: 1, lg: 0.5}}>
                                        <Tooltip title={!openFilters ? 'Filter' : 'Clear Filters'}>
                                            <IconButton onClick={() => {
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
                                    <Grid size={{xs: openFilters ? 9 : 10.5, md: 11, lg: 5}}>
                                        <Stack direction={'row'}>
                                            <JumboSearch
                                                onChange={handleOnChange}
                                                value={queryOptions.queryParams.keyword}
                                            />
                                            <InventoryConsumptionsActionTail consumptionTab={true}/> 
                                        </Stack>
                                    </Grid>
                                </Grid>
                        }
                        >
                        </JumboListToolbar>
                    }
                />
            </React.Fragment>
        </ProductsSelectProvider>
    </LedgerSelectProvider>

);
}

export default InventoryConsumptionsTab