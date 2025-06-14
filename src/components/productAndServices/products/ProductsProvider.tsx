import React from 'react';
import { createContext, useContext } from "react";
import { useQuery } from 'react-query';
import LedgerSelectProvider from '../../accounts/ledgers/forms/LedgerSelectProvider';
import storeServices from '../../procurement/stores/store-services';
import measurementUnitServices from '../../masters/measurementUnits/measurement-unit-services';
import productCategoryServices from '../productCategories/product-category-services';
import productServices from './product-services';
import { LinearProgress } from '@mui/material';

export const ProductsAppContext = createContext({});

export const useProductApp = () => {
    return useContext(ProductsAppContext);
}

const PRODUCT_ACTIONS = {
    SET_SELECTED_ITEMS: "set-selected-items",
    SET_PRODUCT_LIST_REFRESH: "set-products-list-refresh",
};

const init = (appState) => appState;

const ProductReducer = (state, action) => {
    switch (action.type) {
        case PRODUCT_ACTIONS.SET_SELECTED_ITEMS:
            return {
                ...state,
                selectedProducts: action?.payload
            };
        case PRODUCT_ACTIONS.SET_PRODUCT_LIST_REFRESH:
            return {
                ...state,
                refreshProductsList: action.payload,
            };
        default:
            return state;
    }

};

export default function ProductsProvider({children}){
    const [productsApp, setProductsApp] = React.useReducer(ProductReducer, {
        selectedProducts: [],
        refreshProductsList: false
    }, init);

    const setSelectedProducts = React.useCallback((products) => {
        setProductsApp({type: PRODUCT_ACTIONS.SET_SELECTED_ITEMS, payload: products});
    }, [setProductsApp]);

    const setProductsListRefresh = React.useCallback((refresh) => {
        setProductsApp({type: PRODUCT_ACTIONS.SET_PRODUCT_LIST_REFRESH, payload: refresh})
    }, [setProductsApp]);

    const {data : productCategories, isLoading: isLoadingProductCategories} = useQuery('productCategoryOptions',productCategoryServices.getCategoryOptions);
    const {data : measurementUnits, isLoading: isLoadingMeasurementUnits} = useQuery('allMeasurementUnits',measurementUnitServices.getAllMeasurementUnits);
    const {data : productParams, isLoading : isLoadingProductParams} = useQuery('productParams',productServices.getProductParams);
    const {data : storeOptions, isLoading : isLoadingStores} = useQuery(['storeOptions',{mainOnly:true}],storeServices.getStoreOptions);

    if(isLoadingMeasurementUnits || isLoadingProductParams || isLoadingProductCategories || isLoadingStores){
        return <LinearProgress/>
    }
    
    const contextValue = {
        ...productsApp,
        setSelectedProducts: setSelectedProducts,
        setProductsListRefresh: setProductsListRefresh,
        productCategories,
        brands : productParams.brands,
        item_names: productParams.item_names,
        models: productParams.models,
        measurementUnits,
        specifications: productParams.specifications,
        storeOptions
    }

    return (
        <ProductsAppContext.Provider value={contextValue}>
            <LedgerSelectProvider>{children}</LedgerSelectProvider>
        </ProductsAppContext.Provider>
    )
    
}