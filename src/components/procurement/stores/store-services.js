import axios from "@/lib/services/config";

const storeServices = {};

storeServices.getList = async ({ type, keyword, page, limit }) => {
    const response = await axios.get('/api/stores', {
      params: { type, keyword, page, limit },
    });
    return response.data;
},

storeServices.getStockList = async ({ type, keyword, page, limit }) => {
    const response = await axios.get(`/api/stores/${queryParams.id}/getStockList`, {
      params: { type, keyword, page, limit },
    });
    return response.data;
},

storeServices.getExistedProducts = async (storeId) => {
    const {data} = await axios.get(`/api/stores/${storeId}/getExistedProducts`);
    return data;
};

storeServices.show = async({queryKey}) => {
    const {id} = queryKey[1];
    const {data} = await axios.get(`/api/stores/${id}/show`)
    return data;
}

storeServices.getStoreOptions = async(mainOnly = true) => {
    const {data} = await axios.get(`/api/stores/getStoreOptions`,{
        params: {
            mainOnly: mainOnly,
        }
    })
    return data;
}

storeServices.add = async(store) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/api/stores/add`,store)
        return data;
    })
}

storeServices.update = async(store) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/api/stores/${store.id}/update`,store)
        return data;
    })
}

storeServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/api/stores/${id}/delete`);
        return data;
    })
};

storeServices.getStockMovement = async (params, dormantStock = false) => {
  const { data } = await axios.get(`/api/stores/${params.store_id}/stock_movement/getStockMovement`, {
    params: {
      ...params,
      dormant: dormantStock,
    },
  });
  return data;
};

storeServices.getStock = async (params) => {
    const {data} = await axios.get(`/api/stores/${params.store_id}/getStock`,{
        params
    })
    return data;
}

export default storeServices;