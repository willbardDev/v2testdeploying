import axios from "app/services/config";

const inventoryConsumptionsServices = {};

inventoryConsumptionsServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/inventory-consumptions", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

inventoryConsumptionsServices.getListInStore = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/stores/${queryParams.id}/inventory-consumptions`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

inventoryConsumptionsServices.add = async(inventoryConsumptions) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/inventory-consumptions`,inventoryConsumptions)
        return data;
    })
}

inventoryConsumptionsServices.delete = async (inventoryConsumption) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/inventory-consumptions/${inventoryConsumption.id}`);
        return data;
    })
};

inventoryConsumptionsServices.show = async(id) => {
    const {data} = await axios.get(`inventory-consumptions/${id}`)
    return data;
}

inventoryConsumptionsServices.update = async(inventoryConsumption) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/inventory-consumptions/${inventoryConsumption.id}`,inventoryConsumption)
        return data;
    })
}

export default inventoryConsumptionsServices;