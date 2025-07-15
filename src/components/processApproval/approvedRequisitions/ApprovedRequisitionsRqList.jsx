import React, { createContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Grid, IconButton, Tooltip } from '@mui/material';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { EventAvailableOutlined, FilterAltOffOutlined, FilterAltOutlined } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import approvalChainsServices from '../../masters/approvalChains/approvalChainsServices';
import ApprovedRequisitionsListItem from './ApprovedRequisitionsListItem';
import RequisitionsTypeSelector from '../RequisitionsTypeSelector';
import CostCenterSelector from '../../masters/costCenters/CostCenterSelector';
import ProductsProvider from '../../productAndServices/products/ProductsProvider';
import ProductsSelectProvider from '../../productAndServices/products/ProductsSelectProvider';
import CurrencySelectProvider from '../../masters/Currencies/CurrencySelectProvider';
import LedgerSelectProvider from '../../accounts/ledgers/forms/LedgerSelectProvider';
import StakeholderSelectProvider from '../../masters/stakeholders/StakeholderSelectProvider';

const ApprovedRequisitionsRqList = ({processType}) => {
  const params = useParams();
  const listRef = React.useRef();
  const {checkOrganizationPermission, authOrganization} = useJumboAuth();
  const [openFilters, setOpenFilters] = useState(false);
  const [filterDate, setFilterDate] = useState({})
  const [selectedCostCenter, setSelectedCostCenter] = useState([])

  const [queryOptions, setQueryOptions] = React.useState({
    queryKey: 'approvedRequisitions',
    queryParams: { 
      id: params.id,
      keyword: '',
      process_type: processType,
      cost_center_ids: authOrganization?.costCenters.map(cost_center => cost_center.id)   
    },
    countKey: 'total',
    dataKey: 'data',
  });

  React.useEffect(() => {
    setQueryOptions((state) => ({
      ...state,
      queryParams: { ...state.queryParams, id: params.id },
    }));
  }, [params]);

  const renderRequisitions = React.useCallback((approvedRequisition) => {
    return <ApprovedRequisitionsListItem approvedRequisition={approvedRequisition} />;
  }, []);

  const handleOnChange = React.useCallback((keyword) => {
    setQueryOptions((state) => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        keyword: keyword,
      },
    }));
  }, []);

  React.useEffect(() => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        cost_center_ids: selectedCostCenter.map(c => c.id)
      }
    }));
  }, [selectedCostCenter]);

  const handleOnTypeChange = React.useCallback((type) => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        process_type: type
      }
    }));
  }, [queryOptions.queryParams.process_type]);

  if(!checkOrganizationPermission([PERMISSIONS.REQUISITIONS_CREATE,PERMISSIONS.REQUISITIONS_READ,PERMISSIONS.ACCOUNTS_MASTERS_EDIT])){
    return <UnauthorizedAccess/>;
  }

  const multiCostCenters = authOrganization?.costCenters.length > 1

  return (
    <ProductsProvider>
        <ProductsSelectProvider>
            <CurrencySelectProvider>
                <LedgerSelectProvider>
                    <StakeholderSelectProvider type='suppliers'>
                        <JumboRqList
                            ref={listRef}
                            wrapperComponent={Card}
                            service={approvalChainsServices.getApprovalRequisitionsList}
                            primaryKey="id"
                            queryOptions={queryOptions}
                            itemsPerPage={10}
                            itemsPerPageOptions={[5, 8, 10, 15, 20]}
                            renderItem={renderRequisitions}
                            componentElement="div"
                            bulkActions={null}
                            wrapperSx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
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
                                            {processType === 'all' &&
                                                <Grid item xs={12} md={6} lg={3} alignItems={'center'}>
                                                    <RequisitionsTypeSelector
                                                        value={queryOptions.queryParams.process_type}
                                                        onChange={handleOnTypeChange}
                                                    />
                                                </Grid>
                                            }
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
                                            <Grid item xs={11} lg={5.5}>
                                                <JumboSearch
                                                    onChange={handleOnChange}
                                                    value={queryOptions.queryParams.keyword}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                >
                                </JumboListToolbar>
                            }
                        />     
                    </StakeholderSelectProvider>
                </LedgerSelectProvider>
            </CurrencySelectProvider>
        </ProductsSelectProvider>
    </ProductsProvider>
  );
};

export default ApprovedRequisitionsRqList;
