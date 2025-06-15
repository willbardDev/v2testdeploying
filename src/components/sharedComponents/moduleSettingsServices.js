import axios from "app/services/config";

const moduleSettingsServices = {};

moduleSettingsServices.updateSettings = async(updatedSettings) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/api/sharedComponents/module-settings`,updatedSettings);
         return data;
     })
}

export default moduleSettingsServices;