import axios from "@/lib/services/config";

interface AuthResponse {
    data?: {
        token?: string;
        authUser?: any;
        authOrganization?: any;
    };
    status?: number;
    hasError?: boolean;
    error?: string;
}

interface LoginCreds {
    email: string;
    password: string;
}

interface OrganizationParams {
    organization_id: string;
}

interface UserData {
    [key: string]: any;
}

interface TokenMetadata {
    geolocation_accuracy?: number;
    latitude?: number;
    longitude?: number;
    fcm_token?: string;
}

const authServices = {
    async getCurrentUser(): Promise<AuthResponse> {
        try {
            const response = await axios.get("/getuser");
            return response.data;
        } catch (e) {
            return {
                hasError: true,
                error: "Some error received from the API",
            };
        }
    },

    async signUp(userData: UserData): Promise<any> {
        try {
            await axios.get('/sanctum/csrf-cookie');
            return await axios.post('/register', userData);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    async signIn(loginCreds: LoginCreds): Promise<any> {
        try {
            await axios.get('/sanctum/csrf-cookie');
            return await axios.post('/login', loginCreds);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    async loadOrganization(params: OrganizationParams): Promise<any> {
        try {
            await axios.get('/sanctum/csrf-cookie');
            return await axios.put(`/organizations/${params.organization_id}/load`, {
                organization_id: params.organization_id
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    },

    async signOut(): Promise<any> {
        try {
            await axios.get('/sanctum/csrf-cookie');
            return await axios.post("/logout");
        } catch (e:any) {
            return e.response;
        }
    },

    async updateAuthTokenMetaData(metadata: TokenMetadata): Promise<any> {
        try {
            await axios.get('/sanctum/csrf-cookie');
            return await axios.post('/update-authTokenMetadata', metadata);
        } catch (e) {
            return Promise.reject(e);
        }
    }
};

export default authServices;