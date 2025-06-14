import axios from "app/services/config";

const storeServices = {};

storeServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/stores", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

storeServices.getStockList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/stores/${queryParams.id}/stock_list`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

storeServices.getExistedProducts = async (storeId) => {
    const {data} = await axios.get(`/stores/${storeId}/existed_products`);
    return data;
};

storeServices.show = async({queryKey}) => {
    const {id} = queryKey[1];
    const {data} = await axios.get(`stores/${id}`)
    return data;
}

storeServices.getStoreOptions = async(mainOnly = true) => {
    const {data} = await axios.get(`store_options`,{
        params: {
            mainOnly: mainOnly,
        }
    })
    return data;
}


storeServices.add = async(store) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`stores`,store)
        return data;
    })
}

storeServices.update = async(store) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`stores/${store.id}`,store)
        return data;
    })
}


storeServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/stores/${id}`);
        return data;
    })
};

storeServices.getStockMovement = async (params,dormantStock = false) => {
    const {data} = await axios.get(`stores/${params.store_id}/${!dormantStock ? 'stock_movement' : 'dormant_stock'}`,{
        params
    })
    return data;
}

storeServices.getStock = async (params) => {
    const {data} = await axios.get(`/stores/${params.store_id}/stock_list`,{
        params
    })
    return data;
}


export default storeServices;