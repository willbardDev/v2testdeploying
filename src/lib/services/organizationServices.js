import axios from "./config";

const organizationServices = {};

organizationServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/organizations", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

organizationServices.getUsers = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length-1];
    const { data } = await axios.get(`/organizations/${queryParams.organizationId}/users`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams,
        }
    });
    return data;
};

organizationServices.getOptions = async () => {
    const {data} = await axios.get('organizations/get_options');
    return data
}

organizationServices.add = async(organization) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const formData = new FormData();
        Object.keys(organization).forEach((key) => {
            if(key === 'logo' || key === 'organization_symbol') {
                // If the value is a FileList (like it will be for file inputs),
                // append the first file in the list.
                formData.append(key, organization[key][0]);
            } else {
                formData.append(key, organization[key] !== 'null' ? organization[key] : null);
            }
        });

        const {data} = await axios.post(`/organizations`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
         return data;
     })
}

organizationServices.update = async(organization) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const formData = new FormData();
        Object.keys(organization).forEach((key) => {
            if(key === 'logo' || key === 'organization_symbol') {
                // If the value is a FileList (like it will be for file inputs),
                // append the first file in the list.
                formData.append(key, organization[key][0]);
            } else {
                formData.append(key, organization[key] !== 'null' ? organization[key] : null);
            }
        });

        const {data} = await axios.post(`/organizations/update/${organization.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    })
}

organizationServices.addInvitee = async(organization,email) => {
    const {data} = await axios.get(`/organizations/${organization.id}/user_to_invite?email=${email}`)
    return data;
}

organizationServices.addRole = async(roleData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/organizations/${roleData.organization_id}/new-role`,roleData);
         return data;
     })
}

organizationServices.permissionOptions = async(id) => {
    const {data} = await axios.get(`organizations/${id}/permission_options`);
    return data;
}

organizationServices.roles = async(organizationId) => {
    const {data} = await axios.get(`/organizations/${organizationId}/roles`);
    return data;
}

organizationServices.inviteUsers = async(organization,invitationsData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/organizations/${organization.id}/invite_users`,{invitees: invitationsData});
         return data;
     })
 }

 organizationServices.saveUserRoles = async(organization,user,selectedRoles) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.put(`organizations/${organization.id}/edit-user-roles`,{
            user_id: user.id,
            role_ids: selectedRoles
          });
         return data;
     })
 }

 organizationServices.userDetachAction = async(organization, data) => {
    const action = data;
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/organizations/${organization.id}/detach-user`, action);
        return data; 
    })
 }

 organizationServices.userLeaveAction = async(organization, data) => {
    const action = data;
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/organizations/${organization.id}/detach-user`, action);
        return data; 
    })
 }

export default organizationServices;