import axios from "@/lib/services/config";

const attachmentsServices = {};

attachmentsServices.addAttachment = async(postData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
            if(key === 'file') {
                // If the value is a FileList (like it will be for file inputs),
                // append the first file in the list.
                formData.append(key, postData[key][0]);
            } else {
                formData.append(key, postData[key] !== 'null' ? postData[key] : null);
            }
        });

        const {data} = await axios.post(`/attachments`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return data;
    })
}
attachmentsServices.attachments = async(params) => {
    const {data} = await axios.get(`/attachments`,{
        params
    });
    return data;
}

attachmentsServices.deleteAttachment = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`attachments/${id}`);
        return data;
    })
};

attachmentsServices.updateAttachment = async(attachment) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`attachments/${attachment.id}`,attachment)
        return data;
    });
}

export default attachmentsServices;
