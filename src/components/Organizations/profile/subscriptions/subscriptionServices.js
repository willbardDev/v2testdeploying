import axios from "../../../../lib/services/config";

const subscriptionServices = {};

subscriptionServices.getSubscriptionModules = async () =>{
    const {data} = await axios.get(`/api/organizations/subscriptions/modulesOptions`);
    return data;
}

subscriptionServices.addSubscription = async(subscription) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/api/organizations/subscriptions`,subscription);
         return data;
     })
}

subscriptionServices.updateSubscription = async(subscription) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/api/organizations/subscriptions/${subscription.id}`,subscription)
        return data;
    })
}

subscriptionServices.deleteSubscription = async (subscription) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/api/organizations/subscriptions/${subscription.id}`);
        return data;
    })
};

export default subscriptionServices;