import axios from "@/lib/services/config";

const fundTransferServices = {};

fundTransferServices.add = async(receipt) => {
   return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`accounts/transfers`,receipt);
        return data;
    })
}

fundTransferServices.show = async (id) => {
    const {data} = await axios.get(`/accounts/transfers/${id}`);
    return data;
}

fundTransferServices.update = async(receipt) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`accounts/transfers/${receipt.id}`,receipt)
        return data;
    });
}

fundTransferServices.delete = async (receipt) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`accounts/transfers/${receipt.id}`);
        return data;
    })
};


export default fundTransferServices;