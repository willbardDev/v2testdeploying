import { LinearProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext } from 'react'
import productServices from './productServices';

const ProductSelectContext = createContext({});

export const useProductsSelect = () => useContext(ProductSelectContext);

function ProductsSelectProvider({ children }) {
  const { data: productOptions, isLoading } = useQuery({
    queryKey: ['product_select_options'],
    queryFn: productServices.getProductSelectOptions,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <ProductSelectContext.Provider value={{ productOptions }}>
      {children}
    </ProductSelectContext.Provider>
  );
}


export default ProductsSelectProvider