import axios from "app/services/config";

const inventoryTransferServices = {};

inventoryTransferServices.getList = async ({ type, keyword, page, limit }) => {
    const response = await axios.get(`stores/${queryParams.store_id}/inventory-transfers`, {
      params: { type, keyword, page, limit },
    });
    return response.data;
},

inventoryTransferServices.add = async(transfers) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`inventory-transfers`,transfers);
         return data;
     })
}

inventoryTransferServices.transferDetails = async (id) => {
    const {data} = await axios.get(`inventory-transfers/${id}`);
    return data;
}

inventoryTransferServices.update = async(transfer) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`inventory-transfers/${transfer.id}`,transfer)
        return data;
    })
}

inventoryTransferServices.delete = async (transfers) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`inventory-transfers/${transfers.id}`);
        return data;
    })
};

inventoryTransferServices.receive = async(transfer) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`inventory-transfers/${transfer.id}/receive`,transfer)
        return data;
    })
}

inventoryTransferServices.getInventoryTrns = async (id) => {
    const {data} = await axios.get(`/inventory-transfers/${id}/trns`);
    return data;
}

inventoryTransferServices.trnDetails = async (id) => {
    const {data} = await axios.get(`/trns/${id}`);
    return data;
}

inventoryTransferServices.unReceiveTrn = async (id) => {
    const {data} = await axios.delete(`/trns/${id}`);
    return data;
}

export default inventoryTransferServices;