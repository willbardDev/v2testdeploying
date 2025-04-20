import axios from "./config";

const organizationServices = {
  // GET METHODS
  getList: async (params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get("/organizations", {
      params: { page, limit, ...queryParams }
    });
    return data;
  },

  getUsers: async (organizationId, params = {}) => {
    const { page = 1, limit = 10, ...queryParams } = params;
    const { data } = await axios.get(`/organizations/${organizationId}/users`, {
      params: { page, limit, ...queryParams }
    });
    return data;
  },

  getOptions: async () => {
    const { data } = await axios.get("organizations/get_options");
    return data;
  },

  getPermissionOptions: async (id) => {
    const { data } = await axios.get(`organizations/${id}/permission_options`);
    return data;
  },

  getRoles: async (organizationId) => {
    const { data } = await axios.get(`/organizations/${organizationId}/roles`);
    return data;
  },

  // POST/PUT METHODS (with CSRF protection)
  create: async (organization) => {
    await axios.get("/sanctum/csrf-cookie");
    const formData = buildFormData(organization);
    const { data } = await axios.post("/organizations", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },

  update: async (organization) => {
    await axios.get("/sanctum/csrf-cookie");
    const formData = buildFormData(organization);
    const { data } = await axios.post(
      `/organizations/update/${organization.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  addInvitee: async (organizationId, email) => {
    const { data } = await axios.get(
      `/organizations/${organizationId}/user_to_invite?email=${email}`
    );
    return data;
  },

  addRole: async (roleData) => {
    await axios.get("/sanctum/csrf-cookie");
    const { data } = await axios.post(
      `/organizations/${roleData.organization_id}/new-role`,
      roleData
    );
    return data;
  },

  inviteUsers: async (organizationId, invitationsData) => {
    await axios.get("/sanctum/csrf-cookie");
    const { data } = await axios.post(
      `/organizations/${organizationId}/invite_users`,
      { invitees: invitationsData }
    );
    return data;
  },

  saveUserRoles: async (organizationId, userId, roleIds) => {
    await axios.get("/sanctum/csrf-cookie");
    const { data } = await axios.put(
      `/organizations/${organizationId}/edit-user-roles`,
      { user_id: userId, role_ids: roleIds }
    );
    return data;
  },

  userDetachAction: async (organizationId, actionData) => {
    await axios.get("/sanctum/csrf-cookie");
    const { data } = await axios.put(
      `/organizations/${organizationId}/detach-user`,
      actionData
    );
    return data;
  },

  userLeaveAction: async (organizationId, actionData) => {
    await axios.get("/sanctum/csrf-cookie");
    const { data } = await axios.put(
      `/organizations/${organizationId}/detach-user`,
      actionData
    );
    return data;
  }
};

// Helper function for form data construction
function buildFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    
    if (key === "logo" || key === "organization_symbol") {
      // Handle FileList or single File
      const file = Array.isArray(value) ? value[0] : value;
      if (file) formData.append(key, file);
    } else {
      formData.append(key, value !== "null" ? value : null);
    }
  });
  return formData;
}

export default organizationServices;