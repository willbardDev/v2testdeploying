import { LinearProgress } from '@mui/material';
import React, { createContext, useContext } from 'react'
import { useQuery } from 'react-query'
import productServices from './product-services'

const ProductSelectContext = createContext({});

export const useProductsSelect = () => useContext(ProductSelectContext);

function ProductsSelectProvider({children}) {
  const {data: productOptions,isLoading} = useQuery(['product_select_options'],productServices.getProductSelectOptions,{
    refetchOnWindowFocus: true
  });

  if(isLoading){
    return <LinearProgress/>
  }
  return (
    <ProductSelectContext.Provider value={{ 
      productOptions : productOptions
     }}>
      {children}
    </ProductSelectContext.Provider>
  )
}

export default ProductsSelectProvider