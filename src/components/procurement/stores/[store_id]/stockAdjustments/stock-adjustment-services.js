import axios from "@/lib/services/config";

const stockAdjustmentServices = {};

stockAdjustmentServices.add = async (postData) => {
  return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
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

    const { data } = await axios.post(`/api/stockAdjustment/add`, formData);
    return data;
  });
};

stockAdjustmentServices.update = async(stockAdjustment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/api/stockAdjustment/${stockAdjustment.id}/update`,stockAdjustment)
        return data;
    })
}

stockAdjustmentServices.delete = async (stockAdjustment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/api/stockAdjustment/${stockAdjustment.id}/delete`);
        return data;
    })
};

stockAdjustmentServices.getList = async ({ store_id, keyword, page, limit, from, to }) => {
  const response = await axios.get(`/api/stores/${store_id}/getStockAdjustmentList`, {
    params: { store_id, keyword, page, limit, from, to },
  });
  return response.data;
};

stockAdjustmentServices.show = async(id) => {
    const {data} = await axios.get(`/api/stockAdjustment/${id}/show`)
    return data;
}

export default stockAdjustmentServices;