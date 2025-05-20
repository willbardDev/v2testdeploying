import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Grid } from '@mui/material';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import ApprovalChainsListItem from './ApprovalChainsListItem';
import ApprovalChainsActionTail from './ApprovalChainsActionTail';
import approvalChainsServices from './approvalChainsServices';
import ApprovalStatusSelector from './ApprovalStatusSelector';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

const ApprovalChains = () => {
  const params = useParams();
  const listRef = React.useRef();
  const {checkOrganizationPermission} = useJumboAuth();

  const [queryOptions, setQueryOptions] = React.useState({
    queryKey: 'approvalChains',
    queryParams: { id: params.id, keyword: '', status: 'Active'},
    countKey: 'total',
    dataKey: 'data',
  });

  const handleOnStatusChange = React.useCallback((status) => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        status: status
      }
    }));
  }, [queryOptions.queryParams.status]);

  React.useEffect(() => {
    setQueryOptions((state) => ({
      ...state,
      queryParams: { ...state.queryParams, id: params.id },
    }));
  }, [params]);

  const renderApprovalChains = React.useCallback((approvalChain) => {
    return <ApprovalChainsListItem approvalChain={approvalChain} />;
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

  if(!checkOrganizationPermission([
    PERMISSIONS.APPROVAL_CHAINS_READ,
    PERMISSIONS.APPROVAL_CHAINS_CREATE,
    PERMISSIONS.APPROVAL_CHAINS_EDIT,
    PERMISSIONS.APPROVAL_CHAINS_DEACTIVATE
  ])){
    return <UnauthorizedAccess/>;
  }

  return (
    <JumboRqList
      ref={listRef}
      wrapperComponent={Card}
      service={approvalChainsServices.getList}
      primaryKey="id"
      queryOptions={queryOptions}
      itemsPerPage={10}
      itemsPerPageOptions={[5, 8, 10, 15, 20]}
      renderItem={renderApprovalChains}
      componentElement="div"
      bulkActions={null}
      wrapperSx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      toolbar={
        <JumboListToolbar hideItemsPerPage={true} 
        actionTail={
          <Grid container columnSpacing={1} rowSpacing={1} justifyContent={'end'}>
            <Grid item xs={12} md={6} lg={3} alignItems={'center'}>
              <ApprovalStatusSelector
                value={queryOptions.queryParams.status}
                onChange={handleOnStatusChange}
              />
            </Grid>
            <Grid item xs={10} md={5}>
              <JumboSearch
                onChange={handleOnChange}
                value={queryOptions.queryParams.keyword}
              />
            </Grid>
            <Grid item xs={1} lg={0.5}>
              <ApprovalChainsActionTail /> 
            </Grid>
          </Grid>
        }>
        </JumboListToolbar>
      }
    />
  );
};

export default ApprovalChains;
