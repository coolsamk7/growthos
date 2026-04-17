import { authLogin, authSignup } from '@growthos/api-client';
import { apiClient } from './api';
import { tokenStorage } from '@/utils/tokenStorage';
import { otpSessionStorage } from '@/utils/otpSessionStorage';

export const loginUser = async ( data: { email: string; password: string } ) => {
    const response = await authLogin( {
        body: {
            email: data.email,
            password: data.password,
        },
    } );

    if ( response.data && 'accessToken' in response.data ) {
        const accessToken = response.data.accessToken as string;
        const refreshToken = 'refreshToken' in response.data ? ( response.data.refreshToken as string ) : undefined;

        tokenStorage.setTokens( accessToken, refreshToken );
        apiClient.setToken( accessToken );
    }

    return response.data;
};

export const signupUser = async ( data: { firstName: string; lastName: string; email: string; password: string } ) => {
    const response = await authSignup( {
        body: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        },
    } );
    if( response.data && 'data' in response.data ) {
        const { data } = response.data
        otpSessionStorage.setOtpSessionData( data.sessionId, data.email );
    }
    return response.data;
};



export const logoutUser = () => {
    tokenStorage.clearTokens();
    apiClient.clearToken();
};
