import axios from "app/services/config";

const paymentServices = {};

paymentServices.add = async(payment) => {
   return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`accounts/payments`,payment);
        return data;
    })
}

paymentServices.show = async (id) => {
    const {data} = await axios.get(`/accounts/payments/${id}`);
    return data;
}


paymentServices.update = async(payment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`accounts/payments/${payment.id}`,payment)
        return data;
    });
}


paymentServices.delete = async (payment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`accounts/payments/${payment.id}`);
        return data;
    })
};


export default paymentServices;