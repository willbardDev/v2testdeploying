import axios from "@/lib/services/config";

const productServices = {};

productServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/products", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

productServices.downloadExcelTemplate = async (stores) => {
    const { data } = await axios.post(`products-registration-excel-template`, stores, {
      responseType: 'blob',
    });      
    return data;
  };

productServices.getProductSelectOptions = async() => {
    const {data} = await axios.get(`product_options`);
    return data;
}

productServices.getStoreBalances = async(params) => {
    const {data} = await axios.get(`products/${params.productId}/balances`,{
        params
    });
    return data;
}

productServices.secondaryUnits = async (id) => {
    const {data} = await axios.get(`/products/${id}/secondary-units`);
    return data;
}

productServices.getProductMovements = async (params) => {
    const {data} = await axios.get(`products/${params.product_id}/movements`,{
        params
    })
    return data;
}

productServices.getUnitCosts = async(params) => {
    const {data} = await axios.get(`products/${params.product_id}/unit-costs`,{
        params
    });
    return data;
}

productServices.getSellingPrices = async(params) => {
    const {data} = await axios.get(`products/${params.productId}/selling-price`,{
        params
    });
    return data;
}

productServices.getProductBrands = async() => {
    const {data} = await axios.get(`product_brands`);
    return data;
}

productServices.getProductNames = async() => {
    const {data} = await axios.get(`product_names`);
    return data;
}

productServices.getProductParams = async() => {
    const {data} = await axios.get(`product_params`);
    return data;
}

productServices.getProductSpecifications = async() => {
    const {data} = await axios.get(`product_specifications`);
    return data;
}

productServices.add = async(product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`products`,product)
        return data;
    })
}

productServices.addSecondaryUnit = async(product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/products/${product.id}/secondary-units`,product)
        return data;
    })
}

productServices.importProductsExcel = async(postData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
            if(key === 'products_excel') {
                // If the value is a FileList (like it will be for file inputs),
                // append the first file in the list.
                formData.append(key, postData[key][0]);
            } else {
                formData.append(key, postData[key] !== 'null' ? postData[key] : null);
            }
        });

        const {data} = await axios.post(`products/import_registration_excel`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return data;
    })
}

productServices.update = async(product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`products/${product.id}`,product)
        return data;
    })
}

productServices.updateUnit = async(product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/products/${product.id}/secondary-units`,product)
        return data;
    })
}

productServices.delete = async (product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`products/${product.id}`);
        return data;
    })
};

productServices.deleteUnit = async ({productId, unitId}) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`products/${productId}/secondary-units/${unitId}`);
        return data;
    })
};

productServices.mergeProducts = async(product) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/merge-products`,product)
        return data;
    })
}

export default productServices;