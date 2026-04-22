import { ApiClient } from '@growthos/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5600';

export const apiClient = new ApiClient( API_BASE_URL );

export const setAuthToken = ( token: string ) => {
    apiClient.setToken( token );
};

export const clearAuthToken = () => {
    apiClient.clearToken();
};

export default apiClient;
