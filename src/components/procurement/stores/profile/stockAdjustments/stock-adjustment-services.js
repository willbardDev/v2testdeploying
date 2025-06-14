import axios from "app/services/config";

const stockAdjustmentServices = {};

stockAdjustmentServices.add = async (postData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
      console.log(postData);
      const formData = new FormData();
      
      Object.keys(postData).forEach((key) => {
        if (key === 'stock_excel') {
          // If the value is a FileList (like it will be for file inputs),
          // append the first file in the list.
          formData.append(key, postData[key][0]);
        } else if (key === 'items') {
          // If key is 'items' and its value is an array, append each item individually
          if (Array.isArray(postData[key])) {
            postData[key].forEach((item, index) => {
              // Append each item with a unique key
              Object.keys(item).forEach((itemKey) => {
                formData.append(`items[${index}][${itemKey}]`, item[itemKey]);
              });
            });
          }
        } else {
          // Append other key-value pairs
          !(postData['stock_excel'] && key === 'items') && formData.append(key, postData[key] !== 'null' ? postData[key] : null);
        }
      });
  
      const { data } = await axios.post(`stock_adjustments`, formData);
      return data;
    });
  };

stockAdjustmentServices.update = async(stockAdjustment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`stock_adjustments/${stockAdjustment.id}`,stockAdjustment)
        return data;
    })
}

stockAdjustmentServices.delete = async (stockAdjustment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/stock_adjustments/${stockAdjustment.id}`);
        return data;
    })
};

stockAdjustmentServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/stores/${queryParams.id}/stock_adjustments`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

stockAdjustmentServices.show = async(id) => {
    const {data} = await axios.get(`stock_adjustments/${id}`)
    return data;
}

export default stockAdjustmentServices;