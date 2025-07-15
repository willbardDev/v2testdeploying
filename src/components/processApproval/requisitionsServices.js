import axios from "@/lib/services/config";

const requisitionsServices = {};

requisitionsServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/requisitions", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

requisitionsServices.addRequisitions = async(requisitions) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/requisitions`,requisitions)
        return data;
    })
}

requisitionsServices.getRolesOptions = async(mainOnly = true) => {
    const {data} = await axios.get(`/approving-roles`,{
        params: {
            mainOnly: mainOnly,
        }
    })
    return data;
}


requisitionsServices.approveRequisition = async(approval) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/requisition-approvals`,approval)
        return data;
    })
}

requisitionsServices.getRequisitionDetails = async (id) => {
    const { data } = await axios.get(`/requisitions/${id}`);
    return data;
}

requisitionsServices.getRelatedTransactions = async(params) => {
    const {data} = await axios.get(`ledgers/related-transactions`,{
        params
    });
    return data;
}

requisitionsServices.retrieveApprovalDetails = async (id) => {
    const {data} = await axios.get(`/requisition-approvals/${id}`);
    return data;
}

requisitionsServices.getApprovedRequisitionDetails = async (id) => {
    const { data } = await axios.get(`/approved-requisitions/${id}`);
    return data;
}

requisitionsServices.getApprovedPurchaseOrders = async (id) => {
    const { data } = await axios.get(`approved-requisitions/${id}/purchase-orders`);
    return data;
}

requisitionsServices.getApprovedPayments = async (id) => {
    const { data } = await axios.get(`/approved-requisitions/${id}/payments`);
    return data;
}

requisitionsServices.updateRequisition = async(requisition) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/requisitions/${requisition.id}`,requisition)
        return data;
    })
}

requisitionsServices.editApprovalRequisition = async(approval) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/requisition-approvals/${approval.id}`,approval)
        return data;
    })
}

requisitionsServices.deleteRequisiton = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/requisitions/${id}`);
        return data;
    })
};

requisitionsServices.deleteApprovedPurchaseOrder = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(``);
        return data;
    })
};

requisitionsServices.deleteApprovedPaymentOrder = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(``);
        return data;
    })
};

requisitionsServices.deleteApproval = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/requisition-approvals/${id}`);
        return data;
    })
};

export default requisitionsServices;