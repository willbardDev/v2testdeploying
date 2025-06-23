import { LinearProgress } from '@mui/material';
import React, { createContext, useContext, useState } from 'react'
import storeServices from '../store-services';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import UnsubscribedAccess from '@/shared/Information/UnsubscribedAccess';
import { MODULES } from '@/utilities/constants/modules';
import ProductsSelectProvider from '@/components/productAndServices/products/ProductsSelectProvider';

const StoreProfileContext = createContext({});

export const useStoreProfile = () => useContext(StoreProfileContext);

function StoreProfileProvider({children}) {
  const params = useParams();
  const [content, setContent] = useState(0);
  const [activeStore, setActiveStore] = useState(mainStore);
  const [storeArrays, setStoreArrays] = useState({ storeIds: [],selectOptions:[]})

  const { data: mainStore, isFetching: isFetchingStore, isFetched } = useQuery({
    queryKey: ['showStore', { id: params.store_id }],
    queryFn: () => storeServices.show(params.store_id),
    enabled: !!params.store_id,
  });

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