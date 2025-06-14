import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import { Card, Stack, Typography } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';
import storeServices from './store-services';
import StoreActionTail from './StoreActionTail';
import StoreListItem from './StoreListItem';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { MODULES } from 'app/utils/constants/modules';

const Stores = () => {
    const params = useParams();
    const listRef = React.useRef();
    

    const [queryOptions, setQueryOptions] = React.useState({
        queryKey: "stores",
        queryParams: {id: params.id, keyword : ''},
        countKey: "total",
        dataKey: "data",
    });

    React.useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {...state.queryParams, id: params.id}
        }))
    }, [params]);

    const renderStore = React.useCallback((store) => {
        return (<StoreListItem store={store} />)
    });

    const handleOnChange = React.useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                keyword: keyword,
            }
        }))
    }, []);

    const {checkOrganizationPermission,organizationHasSubscribed} = useJumboAuth();

    if(!organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY)){
        return <UnsubscribedAccess modules={'Procurement & Supply'}/>
    }


    if(!checkOrganizationPermission(PERMISSIONS.STORES_READ)){
        return <UnauthorizedAccess/>;
    }
    
return (
    <React.Fragment>
        <Typography variant={'h4'} mb={2}>Stores</Typography>
        <JumboRqList
            ref={listRef}
            wrapperComponent={Card}
            service={storeServices.getList}
            primaryKey={"id"}
            queryOptions={queryOptions}
            itemsPerPage={8}
            itemsPerPageOptions={[8,10, 15, 20]}
            renderItem={renderStore}
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
                    actionTail={
                    <Stack direction={'row'}>
                        <JumboSearch
                            onChange={handleOnChange}
                            value={queryOptions.queryParams.keyword}
                        />
                        <StoreActionTail /> 
                    </Stack>
                }
                >
                </JumboListToolbar>
            }
        />
    </React.Fragment>
);
}

export default Stores