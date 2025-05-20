import axios from "@/lib/services/config";

const measurementUnitServices = {};

measurementUnitServices.getList = async (params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get("/masters/measurement_units", {
       params: { page, limit, ...queryParams }
    });
    return data;
},

measurementUnitServices.getAllMeasurementUnits = async(product) => {
    const {data} = await axios.get(`masters/all_measurement_units`)
    return data;
}


measurementUnitServices.add = async(measurementUnit) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`masters/measurement_units`,measurementUnit)
        return data;
    })
}

measurementUnitServices.update = async(measurementUnit) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`masters/measurement_units/${measurementUnit.id}`,measurementUnit)
        return data;
    })
}


measurementUnitServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/masters/measurement_units/${id}`);
        return data;
    })
};


export default measurementUnitServices;