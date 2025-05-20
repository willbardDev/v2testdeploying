import axios from "@/lib/services/config";

const stakeholderServices = {}; 

    stakeholderServices.getList = async (params = {}) => {
        const { page = 1, limit = 10, ...queryParams } = params;
        const { data } = await axios.get("/stakeholders", {
            params: { page, limit, ...queryParams }
        });
        return data;
    },

    stakeholderServices.getSelectOptions = async (type = 'all') => {
        const {data} = await axios.get("/stakeholders", {
            params: {
                type: type,
            }
        });
        return data;
    }

    stakeholderServices.getLedgers = async(params) => {
        const {data} = await axios.get(`stakeholders/${params.stakeholder_id}/ledgers`,{
            params
        });
        return data;
    }

    stakeholderServices.add = async(formData) => {
        return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
            const {data} = await axios.post(`stakeholders`,formData)
            return data;
        })
    }

    stakeholderServices.update = async(stakeholder) => {
        return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
            const {data} = await axios.put(`stakeholders/${stakeholder.id}`,stakeholder)
            return data;
        })
    }
    
    stakeholderServices.delete = async (id) => {
        return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
            const {data} = await axios.delete(`/stakeholders/${id}`);
            return data;
        })
    }

export default stakeholderServices;