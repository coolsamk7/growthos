import { authLogin } from '@growthos/api-client';
import { apiClient } from './api';
import { tokenStorage } from '@/utils/tokenStorage';

export const loginUser = async ( data: {
    email: string;
    password: string;
} ) => {
    const response = await authLogin( {
        body: {
            email: data.email,
            password: data.password,
        },
    } );

    if ( response.data && 'accessToken' in response.data ) {
        const accessToken = response.data.accessToken as string;
        const refreshToken = 'refreshToken' in response.data ? response.data.refreshToken as string : undefined;
        
        tokenStorage.setTokens( accessToken, refreshToken );
        apiClient.setToken( accessToken );
    }

    return response.data;
};

export const logoutUser = () => {
    tokenStorage.clearTokens();
    apiClient.clearToken();
};
