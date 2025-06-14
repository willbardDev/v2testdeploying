import axios from "app/services/config";

const purchaseServices = {};

purchaseServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/purchase_orders", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

purchaseServices.getEditComplements = async (order_id) => {
    const {data} = await axios.get(`/purchase_orders/${order_id}/edit`);
    return data;
}

purchaseServices.PurchaseGrnsReport = async (id) => {
    const {data} = await axios.get(`/purchase_orders/${id}/grns-report`);
    return data;
}

purchaseServices.add = async(order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`purchase_orders`,order)
        return data;
    })
}

purchaseServices.update = async(order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`purchase_orders/${order.id}`,order)
        return data;
    })
}

purchaseServices.delete = async (order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`purchase_orders/${order.id}`);
        return data;
    })
};

purchaseServices.orderDetails = async (id) => {
    const {data} = await axios.get(`purchase_orders/${id}`);
    return data;
}

purchaseServices.getPurchaseOrderGrns = async (id) => {
    const {data} = await axios.get(`/purchase_orders/${id}/grns`);
    return data;
}

purchaseServices.unReceiveOrderGrn = async (id) => {
    const {data} = await axios.delete(`/grns/${id}`);
    return data;
}

purchaseServices.purchaseValues = async(params) => {
    const {data} = await axios.get(`purchase-values`,{params});
    return data;
}

purchaseServices.receive = async(order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`purchase_orders/${order.id}/receive`,order)
        return data;
    })
}

purchaseServices.getPurchasesReport = async(params) => {
    const {data} = await axios.get(`/purchase-orders-report`,{
        params
    });
    return data;
}

purchaseServices.getLastPrice = async(params) => {
    const {data} = await axios.get(`/stakeholders/product-last-price/purchase`,{
        params
    });
    return data;
}

purchaseServices.closeOrder = async(order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/purchase_orders/${order.id}/close`,order)
        return data;
    })
}

purchaseServices.reOpenOrder = async(order) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/purchase_orders/${order.id}/reopen`,order)
        return data;
    })
}

export default purchaseServices;