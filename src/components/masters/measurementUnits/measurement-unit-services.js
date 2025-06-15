import axios from "@/lib/services/config";

const measurementUnitServices = {};

measurementUnitServices.getList = async (params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get("/api/measurement_units", {
       params: { page, limit, ...queryParams }
    });
    return data;
},

measurementUnitServices.getAllMeasurementUnits = async(product) => {
    const {data} = await axios.get(`/api/measurement_units/all_measurement_units`)
    return data;
}


measurementUnitServices.add = async(measurementUnit) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`/api/measurement_units/add`,measurementUnit)
        return data;
    })
}

measurementUnitServices.update = async(measurementUnit) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/api/measurement_units/${measurementUnit.id}/update`,measurementUnit)
        return data;
    })
}


measurementUnitServices.delete = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`//api/measurement_units/${id}/delete`);
        return data;
    })
};


export default measurementUnitServices;