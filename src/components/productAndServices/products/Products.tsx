import React from 'react'
import ProductsList from './ProductsList';
import ProductsProvider from './ProductsProvider';
import { Typography } from '@mui/material';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';
import ProductsSelectProvider from './ProductsSelectProvider';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { MODULES } from 'app/utils/constants/modules';

const Products = () => {
    const {organizationHasSubscribed,checkOrganizationPermission} = useJumboAuth();

    if(!organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY)){
      return <UnsubscribedAccess modules={'Procurement & Supply'}/>
    }

    if(!checkOrganizationPermission([PERMISSIONS.PRODUCTS_CREATE,PERMISSIONS.PRODUCTS_READ,PERMISSIONS.PRODUCTS_EDIT])){
        return <UnauthorizedAccess/>
    }
    return (
        <ProductsProvider>
            <ProductsSelectProvider>
                <Typography variant={'h4'} mb={2}>Products</Typography>
                <ProductsList/>
            </ProductsSelectProvider>
        </ProductsProvider>
    );
}

export default Products