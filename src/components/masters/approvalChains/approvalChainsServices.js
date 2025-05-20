const { default: axios } = require("app/services/config");


const approvalChainsServices = {};

approvalChainsServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/approval-chains", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

approvalChainsServices.getApprovalRequisitionsList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/approved-requisitions", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

approvalChainsServices.getApprovalChainLevels = async (id, status) => {
    const { data } = await axios.get(`/approval-chains/${id}/levels`, {
      params: { status },
    });
    return data;
};  

approvalChainsServices.addApprovalChains = async(ApprovalChains) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/approval-chains`,ApprovalChains)
        return data;
    })
}

approvalChainsServices.addNewChainLevel = async(newLevel) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/approval-chain-levels`,newLevel)
        return data;
    })
}

approvalChainsServices.activateChain = async(chain) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/approval-chains/${chain.id}/restore`,chain)
        return data;
    })
}

approvalChainsServices.activateLevel = async(chainLevel) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/approval-chain-levels/${chainLevel.id}/restore`,chainLevel)
        return data;
    })
}

approvalChainsServices.editApprovalChain = async(chain) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/approval-chains/${chain.id}`,chain)
        return data;
    })
}

approvalChainsServices.editApprovalChainLevel = async(level) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/approval-chain-levels/${level.id}`,level)
        return data;
    })
}

approvalChainsServices.deactivateChain = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/approval-chains/${id}`);
        return data;
    })
};

approvalChainsServices.deactivateLevel = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/approval-chain-levels/${id}`);
        return data;
    })
};


export default approvalChainsServices;