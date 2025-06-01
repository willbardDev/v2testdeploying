import axios from "@/lib/services/config";

const journalServices = {};

journalServices.add = async(journal) => {
   return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.post(`accounts/journal_vouchers`,journal);
        return data;
    })
}

journalServices.show = async (id) => {
    const {data} = await axios.get(`/accounts/journal_vouchers/${id}`);
    return data;
}


journalServices.update = async(journal) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`accounts/journal_vouchers/${journal.id}`,journal)
        return data;
    });
}


journalServices.delete = async (journal) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`accounts/journal_vouchers/${journal.id}`);
        return data;
    })
};


export default journalServices;