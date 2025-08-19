import React, { lazy, useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, Grid } from '@mui/material';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import { useProductApp } from './ProductsProvider';
import ProductListItem from './productsListItem/ProductListItem';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import productServices from './productServices';
import ProductsCategorySelector from './ProductsCategorySelector';

const ProductActionTail = lazy(() => import('./ProductActionTail'));

const ProductList = () => {
    const params = useParams();
    const listRef = useRef();
    const { setSelectedProducts, setProductsListRefresh, refreshProductsList } = useProductApp();
    const { checkOrganizationPermission } = useJumboAuth();
    
    const [queryOptions, setQueryOptions] = useState({
        queryKey: "products",
        queryParams: { id: params.id, keyword: '', category_id: 'null' },
        countKey: "total",
        dataKey: "data",
    });

    useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: { ...state.queryParams, id: params.id }
        }));
    }, [params]);

    useEffect(() => {
        if (refreshProductsList) {
            listRef.current?.refresh();
            setProductsListRefresh(false);
        }
    }, [refreshProductsList, setProductsListRefresh]);

    const handleOnCategoryChange = React.useCallback((category_id) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                category_id: category_id
            }
        }));
    }, [queryOptions.queryParams.category_id]);

    const handleOnChange = useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: { ...state.queryParams, keyword }
        }));
    }, []);

    const renderProduct = useCallback((product) => (
        <ProductListItem product={product} />
    ), []);

    const canCreate = checkOrganizationPermission([PERMISSIONS.PRODUCTS_CREATE]);

    return (
        <JumboRqList
            ref={listRef}
            dense={true}
            wrapperComponent={Card}
            service={productServices.getList}
            primaryKey={"id"}
            queryOptions={queryOptions}
            itemsPerPage={10}
            itemsPerPageOptions={[10, 15, 20, 50, 100]}
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
                        <Grid container columnSpacing={1} rowSpacing={1}>
                            <Grid size={{xs: 12, lg: 4}}alignItems={'center'}>
                                <ProductsCategorySelector
                                    value={queryOptions.queryParams.category_id}
                                    onChange={handleOnCategoryChange}
                                />
                            </Grid>
                            <Grid size={{xs: 12, lg: 8}}>
                                <Grid container columnSpacing={1} direction={'row'}>
                                    <Grid size={canCreate ? 9.5 : 12}>
                                        <JumboSearch
                                            onChange={handleOnChange}
                                            value={queryOptions.queryParams.keyword}
                                        /> 
                                    </Grid>
                                    {
                                        canCreate &&
                                        <Grid size={2.5}>
                                            <ProductActionTail/>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                />
            }
            onSelectionChange={setSelectedProducts}
        />
    );
};

export default ProductList;