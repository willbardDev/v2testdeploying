import axios from "@/lib/services/config";

const currencyServices = {};

currencyServices.getList = async (params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get("masters/currencies", {
      params: { page, limit, ...queryParams }
    });
    return data;
},

currencyServices.add = async(currency) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`masters/currencies`,currency)
        return data;
    })
}

currencyServices.updateCurrencyExchangeRate = async(exchangeRate) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`masters/currencies/${exchangeRate.id}/update_exchange_rates`,exchangeRate)
        return data;
    })
}

currencyServices.update = async(currency) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`masters/currencies/${currency.id}`,currency)
        return data;    
    })
}

currencyServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`masters/currencies/${id}`);
        return data;
    })
};

currencyServices.deleteExchangeRate = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/masters/exchange-rates-updates/${id}`);
        return data;
    })
};

currencyServices.getExchangeRate = async(params) => {
    const {data} = await axios.get(`/masters/currencies/${params.currencyId}/exchange_rates`,{
        params
    });
    return data;
}

export default currencyServices;