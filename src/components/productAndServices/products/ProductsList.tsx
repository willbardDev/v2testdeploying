import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import { Card, Grid } from '@mui/material';
import React, { lazy } from 'react'
import { useParams } from 'react-router-dom';
import productServices from './product-services';
import { useProductApp } from './ProductsProvider';
import ProductListItem from './productsListItem/ProductListItem';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { PERMISSIONS } from 'app/utils/constants/permissions';


const ProductActionTail = lazy(() => import('./ProductActionTail'));

const ProductList = () => {
    const params = useParams();
    const listRef = React.useRef();
    const {setSelectedProducts,setProductsListRefresh,refreshProductsList} = useProductApp();
    const {checkOrganizationPermission} = useJumboAuth();
    const canCreate = checkOrganizationPermission([PERMISSIONS.PRODUCTS_CREATE]);


    const [queryOptions, setQueryOptions] = React.useState({
        queryKey: "products",
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

    React.useEffect(() => {
        if (refreshProductsList) {
            listRef.current.refresh();
            setProductsListRefresh(false);
        }
    }, [setProductsListRefresh]);

    const renderProduct = React.useCallback((product) => {
        return (<ProductListItem product={product}/>)
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
    return (
        <JumboRqList
            ref={listRef}
            dense={true}
            wrapperComponent={Card}
            service={productServices.getList}
            primaryKey={"id"}
            queryOptions={queryOptions}
            itemsPerPage={10}
            itemsPerPageOptions={[10, 15, 20,50,100]}
            renderItem={renderProduct}
            componentElement={"div"}
            wrapperSx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}
            toolbar={
                <JumboListToolbar
                    hideItemsPerPage={true}
                    actionTail={
                    <Grid container columnSpacing={1} direction={'row'}>
                        <Grid item xs={canCreate ? 9.5 : 12}>
                            <JumboSearch
                                onChange={handleOnChange}
                                value={queryOptions.queryParams.keyword}
                            /> 
                        </Grid>
                        {
                            canCreate &&
                            <Grid item xs={2.5}>
                                <ProductActionTail/>
                            </Grid>
                        }
                    </Grid>
                }
                >
                </JumboListToolbar>
            }
            onSelectionChange={setSelectedProducts}
        />
    );
}

export default ProductList