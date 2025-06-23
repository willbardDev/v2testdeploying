import axios from "@/lib/services/config";

const productionBatchesServices = {};

productionBatchesServices.getProductionBatches = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey?.length - 1];
    const {data} = await axios.get(`/production-batches`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

productionBatchesServices.showBatchDetails = async (id) => {
    const {data} = await axios.get(`/production-batches/${id}`);
    return data;
}

productionBatchesServices.getUserWorkCenters = async ({ queryKey }) => {
    const { userId, type } = queryKey[1];
    const { data } = await axios.get(`/pos/user_outlets/${userId}`, {
        params: { type }
    });
    return data;
};

productionBatchesServices.addProduction = async(batch) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post('/production-batches',batch)
        return data;
    })
}

productionBatchesServices.updateProduction = async(batch) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/production-batches/${batch.id}`,batch)
        return data;    
    })
}

productionBatchesServices.deleteProduction = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/production-batches/${id}`);
        return data;
    })
};

productionBatchesServices.expensesManifest = async(params) => {
    const {data} = await axios.get(`/accounts/expenses-manifest`,{
        params
    });
    return data;
}

productionBatchesServices.deleteProductionBatch = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/production-batches/${id}`);
        return data;
    })
};

export default productionBatchesServices;