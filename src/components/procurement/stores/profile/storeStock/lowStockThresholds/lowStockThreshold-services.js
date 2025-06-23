const { default: axios } = require("app/services/config");


const lowStockThresholdServices = {};

lowStockThresholdServices.getList = async ({ type, keyword, page, limit }) => {
    const response = await axios.get(`/api/lowStockThreshold/${queryParams.store_id}`, {
      params: { type, keyword, page, limit },
    });
    return response.data;
},

lowStockThresholdServices.add = async(thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/api/lowStockThreshold/add`,thresholdId);
         return data;
     })
}

lowStockThresholdServices.update = async(thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/api/lowStockThreshold/${thresholdId}/update`,thresholdId)
        return data;
    })
}

lowStockThresholdServices.delete = async (thresholdId) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/api/lowStockThreshol/${thresholdId}/delete`);
        return data;
    })
};

lowStockThresholdServices.alerts = async (params) => {
    const {data} = await axios.get(`/api/lowStockThreshold/alerts`, {
        params
    });
    return data;
};

export default lowStockThresholdServices;