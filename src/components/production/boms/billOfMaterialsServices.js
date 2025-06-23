import axios from "@/lib/services/config";

const billOfMaterialsServices = {};

billOfMaterialsServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/boms`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;    
};

billOfMaterialsServices.getBOMs = async() => {
    const {data} = await axios.get(`bom-options`)
    return data;
}

billOfMaterialsServices.billOfMaterialDetails = async (id) => {
    const {data} = await axios.get(`/boms/${id}`);
    return data;
}

billOfMaterialsServices.addBillOfMaterials = async(billOfMaterial) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/boms`,billOfMaterial)
        return data;
    })
}

billOfMaterialsServices.updateBillOfMaterial = async(billOfMaterial) => {
    const id = billOfMaterial.id;
    return await axios.get('/sanctum/csrf-cookie').then(    async (response) => {
        const {data} = await axios.put(`/boms/${id}`,billOfMaterial)
        return data;    
    })
}

billOfMaterialsServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/boms/${id}`);
        return data;
    })
};

export default billOfMaterialsServices;