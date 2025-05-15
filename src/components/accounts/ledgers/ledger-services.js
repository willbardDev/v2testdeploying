import axios from "@/lib/services/config";

const ledgerServices = {};

ledgerServices.getLedgers = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/accounts/ledger", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

ledgerServices.storeLedgerGroup = async(group) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post('/accounts/ledger_group',group)
        return data;
    })
}

ledgerServices.getLedgerOptions = async() => {
    const {data} = await axios.get("/accounts/ledgerOptions");
    return data;
}

ledgerServices.add = async (ledger) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post("/accounts/ledger", ledger).then(res => res.data).catch(err => {
            return Promise.reject(err);
        });
        return data;
    });
};

ledgerServices.update = async (ledger) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/accounts/ledger/${ledger.id}`, ledger);
        return data;
    });
};

ledgerServices.updateLedgerGroup = async (group) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/accounts/ledger_group/${group.id}`, group);
        return data;
    });
};

ledgerServices.delete = async (ledger) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/accounts/ledger/${ledger.id}`);
        return data;
    });
};

ledgerServices.deleteMultiple = async (selectedIDs) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put("/accounts/delete_multiple_ledgers", {
            ledgerIDs: selectedIDs
        });
        return data;
    });
};

ledgerServices.statement = async (params) => {
    const {data} = await axios.get(`accounts/ledger/${params.ledger_id}/statement`,{
        params
    })
    return data;
}

ledgerServices.mergeLedgers = async(ledger) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/accounts/merge-ledgers`,ledger)
        return data;
    })
}

export default ledgerServices;