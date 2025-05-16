import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Stack, Typography } from '@mui/material';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch/JumboSearch';
import CostCenterListItem from './CostCenterListItem';
import costCenterservices from './cost-center-services';
import CostCenterActionTail from './CostCenterActionTail';

const CostCenters=()=>{
    const params = useParams();
    const listRef = React.useRef();

    const [queryOptions, setQueryOptions] = React.useState({
        queryKey: 'costCenters',
        queryParams: { id: params.id, keyword: '' },
        countKey: 'total',
        dataKey: 'data',
      });

      React.useEffect(() => {
        setQueryOptions((state) => ({
          ...state,
          queryParams: { ...state.queryParams, id: params.id },
        }));
      }, [params]);

      
      const renderCostCenter = React.useCallback((costCenter) => {
        return <CostCenterListItem costCenter={costCenter} />;
      }, []);

      const handleOnChange = React.useCallback(
        (keyword) => {
          setQueryOptions((state) => ({
            ...state,
            queryParams: {
              ...state.queryParams,
              keyword: keyword,
            },
          }));
        },
        []
      );
      return(
        <React.Fragment>
          <Typography variant={'h4'} mb={2}>Cost Centers</Typography>
          <JumboRqList
          ref={listRef}
          wrapperComponent={Card}
          service={costCenterservices.getList}
          primaryKey="id"
          queryOptions={queryOptions}
          itemsPerPage={10}
          itemsPerPageOptions={[5, 8, 10, 15, 20]}
          renderItem={renderCostCenter}
          bulkActions={null}
          wrapperSx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
          toolbar={
            <JumboListToolbar hideItemsPerPage={true} actionTail={
              <Stack direction="row">
                <JumboSearch
                  onChange={handleOnChange}
                  value={queryOptions.queryParams.keyword}
                />
                <CostCenterActionTail/>
              </Stack>
          }/>
          }
          />
        </React.Fragment>
      )
}
export default CostCenters;