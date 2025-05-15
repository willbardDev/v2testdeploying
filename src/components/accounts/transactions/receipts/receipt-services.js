import axios from "app/services/config";

const receiptServices = {};

receiptServices.add = async(receipt) => {
   return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`accounts/receipts`,receipt);
        return data;
    })
}

receiptServices.show = async (id) => {
    const {data} = await axios.get(`/accounts/receipts/${id}`);
    return data;
}

receiptServices.update = async(receipt) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`accounts/receipts/${receipt.id}`,receipt)
        return data;
    });
}


receiptServices.delete = async (receipt) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`accounts/receipts/${receipt.id}`);
        return data;
    })
};


export default receiptServices;