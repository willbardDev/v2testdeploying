const { default: axios } = require("app/services/config");


const priceListServices = {};

priceListServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("price_list", {
        params: {
            page: page,
            limit: limit,
            ...queryParams  
        }
    });
    return data;
};

priceListServices.getCostInsights = async(params) => {
    const {data} = await axios.get(`/products/${params.product_id}/average-cost`,{
        params
    });
    return data;
}

priceListServices.add = async(priceList) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`price_list`,priceList);
         return data;
     })
}

priceListServices.update = async(priceList) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`price_list/${priceList.id}`,priceList)
        return data;
    })
}

priceListServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`price_list/${id}`);
        return data;
    })
};

priceListServices.show = async (id) => {
    const {data} = await axios.get(`/price_list/${id}`);
    return data;
}

priceListServices.importPriceListsExcel = async (postData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async () => {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
            if (key === 'price_lists_excel') {
                formData.append(key, postData[key][0]);
            } else if (key === 'sales_outlet_ids') {
                postData[key].forEach((id) => {
                    formData.append('sales_outlet_ids[]', id);
                });
            } else {
                formData.append(key, postData[key] !== 'null' ? postData[key] : null);
            }
        });

        const { data } = await axios.post(`pricelist-excel-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    });
};

priceListServices.downloadExcelTemplate = async (stores) => {
    const { data } = await axios.post(`/pricelist-excel-template`, stores, {
      responseType: 'blob',
    });      
    return data;
};

export default priceListServices;