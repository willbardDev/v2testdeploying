import { LinearProgress } from '@mui/material';
import ProductsSelectProvider from 'app/prosServices/prosERP/productAndServices/products/ProductsSelectProvider';
import React, { createContext, useContext, useState } from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import storeServices from '../store-services';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';
import { MODULES } from 'app/utils/constants/modules';

const StoreProfileContext = createContext({});

export const useStoreProfile = () => useContext(StoreProfileContext);

function StoreProfileProvider({children}) {
  const params = useParams();
  const {data:mainStore,isFetching : isFetchingStore,isFetched} = useQuery(['showStore',{id:params.store_id}],storeServices.show);
  const [content, setContent] = useState(0);
  const [activeStore, setActiveStore] = useState(mainStore);
  const [storeArrays, setStoreArrays] = useState({ storeIds: [],selectOptions:[]})

  const populateStoreArrays = (store) => {
    setStoreArrays(storeArrays => ({
       ...storeArrays,
       storeIds : [
        ...storeArrays.storeIds,
        String(store.id)
       ],
       selectOptions : [
        ...storeArrays.selectOptions,
        store
       ]
    }))
    store.children.forEach(store => populateStoreArrays(store));
  }

React.useEffect(() => {
  setStoreArrays({ storeIds: [],selectOptions:[]});
  if(isFetched){
    populateStoreArrays(mainStore);
    setActiveStore(mainStore);
  }
}, [isFetchingStore])

const {organizationHasSubscribed} = useJumboAuth();

  if(isFetchingStore){
    return <LinearProgress/>
  }

  if(!organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY)){
    return <UnsubscribedAccess modules={'Procurement & Supply'}/>
  }

  document.title = mainStore.name;

  const contextValue = {
    mainStore,
    content,
    setContent,
    activeStore,
    setActiveStore,
    storeArrays,
    isFetchingStore
  }

  return (
    <StoreProfileContext.Provider value={contextValue}>
      <ProductsSelectProvider>
        {children}
      </ProductsSelectProvider>
    </StoreProfileContext.Provider>
  )
}

export default StoreProfileProvider