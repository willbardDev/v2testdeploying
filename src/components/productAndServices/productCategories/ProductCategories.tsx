import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import { Card, LinearProgress, Stack, Typography } from '@mui/material';
import React, { createContext } from 'react'
import ProductCategoryActionTail from './ProductCategoryActionTail';
import ProductCategoryListItem from './ProductCategoryListItem';
import LedgerSelectProvider from '../../accounts/ledgers/forms/LedgerSelectProvider';
import { useParams } from 'next/navigation';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import productCategoryServices from './productCategoryServices';
import { MODULES } from '@/utilities/constants/modules';
import UnsubscribedAccess from '@/shared/Information/UnsubscribedAccess';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';
import { useQuery } from '@tanstack/react-query';

export const ProductCategoriesAppContext = createContext({});

const ProductCategories = () => {
    const params = useParams();
    const listRef = React.useRef();
    const {organizationHasSubscribed,checkOrganizationPermission} = useJumboAuth();

    const [queryOptions, setQueryOptions] = React.useState({
        queryKey: "productCategories",
        queryParams: {id: params.id, keyword : ''},
        countKey: "total",
        dataKey: "data",
    });

    const {data: productCategories, isLoading} = useQuery('productCategoryOptions',productCategoryServices.getCategoryOptions);

    React.useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {...state.queryParams, id: params.id}
        }))
    }, [params]);

    const renderProductCategory = React.useCallback((productCategory) => {
        return (<ProductCategoryListItem productCategory={productCategory} />)
    },[]);

    const handleOnChange = React.useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                keyword: keyword,
            }
        }))
    }, []);

    if(!organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY)){
        return <UnsubscribedAccess modules={'Procurement & Supply'}/>
    }
  
    if(!checkOrganizationPermission([PERMISSIONS.PRODUCT_CATEGORIES_CREATE,PERMISSIONS.PRODUCT_CATEGORIES_READ,PERMISSIONS.PRODUCT_CATEGORIES_EDIT])){
        return <UnauthorizedAccess/>
    }

    if (isLoading) {
        return <LinearProgress/>;
    }

return (
    <ProductCategoriesAppContext.Provider value={{productCategories}}>
        <LedgerSelectProvider>
            <Typography variant={'h4'} mb={2}>Product Categories</Typography>
            <JumboRqList
                ref={listRef}
                wrapperComponent={Card}
                service={productCategoryServices.getList}
                primaryKey={"id"}
                queryOptions={queryOptions}
                itemsPerPage={10}
                itemsPerPageOptions={[5,8,10, 15, 20]}
                renderItem={renderProductCategory}
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
                            <ProductCategoryActionTail /> 
                        </Stack>
                    }
                    >
                    </JumboListToolbar>
                }
            />
        </LedgerSelectProvider>
    </ProductCategoriesAppContext.Provider>
);
}

export default ProductCategories