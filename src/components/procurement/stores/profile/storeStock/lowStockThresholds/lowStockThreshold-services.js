const { default: axios } = require("app/services/config");


const lowStockThresholdServices = {};

lowStockThresholdServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/low_stock_thresholds/${queryParams.store_id}`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams  
        }
    });
    return data;
};

lowStockThresholdServices.add = async(thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/low_stock_thresholds`,thresholdId);
         return data;
     })
}

lowStockThresholdServices.update = async(thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/low_stock_thresholds/${thresholdId}`,thresholdId)
        return data;
    })
}

lowStockThresholdServices.delete = async (thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`low_stock_thresholds/${thresholdId}`);
        return data;
    })
};

lowStockThresholdServices.alerts = async (params) => {
    const {data} = await axios.get(`low-stock-alerts`, {
        params
    });
    return data;
};

export default lowStockThresholdServices;