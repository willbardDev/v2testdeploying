"use client"

import React from 'react'
import ProductsList from './ProductsList';
import ProductsProvider from './ProductsProvider';
import { Typography } from '@mui/material';
import ProductsSelectProvider from './ProductsSelectProvider';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { MODULES } from '@/utilities/constants/modules';
import UnsubscribedAccess from '@/shared/Information/UnsubscribedAccess';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';

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