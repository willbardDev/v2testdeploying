import axios from "@/lib/services/config";

const productCategoryServices = {};

productCategoryServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("product_categories", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

productCategoryServices.getCategoryOptions = async() => {
    const {data} = await axios.get(`product_category_options`);
    return data;
}

productCategoryServices.add = async(productCategory) => {
   return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`product_categories`,productCategory)
        return data;
    })
}

productCategoryServices.update = async(productCategory) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`product_categories/${productCategory.id}`,productCategory)
        return data;
    });
}


productCategoryServices.delete = async (productCategory) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`product_categories/${productCategory.id}`);
        return data;
    })
};


export default productCategoryServices;