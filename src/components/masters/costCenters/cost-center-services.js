import axios from "@/lib/services/config";

const costCenterservices = {};

costCenterservices.getList = async (params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get("cost-centers", {
      params: { page, limit, ...queryParams }
    });
    return data;
},

costCenterservices.getCostCenters = async(response) => {
    const {data} = await axios.get(`/all-cost-centers`)
    return data;
}

costCenterservices.costCenterDetails = async(id) => {
    const {data} = await axios.get(`/cost-centers/${id}`);
    return data;
}

costCenterservices.getAllOutlets = async(response) => {
    const {data} = await axios.get(`cost-centers`)
    return data;
}

costCenterservices.add = async(costCenter) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/cost-centers`,costCenter)
        return data;
    })
}

costCenterservices.update = async(costCenter) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/cost-centers/${costCenter.id}`,costCenter)
        return data;    
    })
}

export default costCenterservices;