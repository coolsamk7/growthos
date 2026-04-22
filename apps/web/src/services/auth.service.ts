import { authForgotPassword, authForgotPasswordReset, authLogin, authRefreshToken, authResendOtp, authSignup, authVerifyOtp } from '@growthos/api-client';
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

    if ( response.error ) {
        throw response.error;
    }

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

    if ( response.error ) {
        throw response.error;
    }

    if ( response.data && 'data' in response.data ) {
        const { data: responseData } = response.data;
        otpSessionStorage.setOtpSessionData( responseData.sessionId, responseData.email );
    }

    return response.data;
};

export const logoutUser = () => {
    tokenStorage.clearTokens();
    apiClient.clearToken();
};

export const verifyOTP = async ( data: { otp: string } ) => {
    const response = await authVerifyOtp( {
        body: {
            sessionId: otpSessionStorage.getOtpSessionId() || "",
            email: otpSessionStorage.getOtpSessionEmail() || "",
            otp: data.otp
        }
    } )
    if( response.data && 'message' in response.data ) {
        otpSessionStorage.clearSessionData()
    }
    return response.data;
}

export const resendOTP = async () => {
    const response = await authResendOtp( {
        body: {
            email : otpSessionStorage.getOtpSessionEmail() || ""
        }
    } )

    if( response.data && 'data' in response.data ) {
        const { data } = response.data;
        otpSessionStorage.setOtpSessionData( data.sessionId, data.email );
    }
    return response.data;
}

export const forgotPassword = async ( data: { email: string } ) => {

    const response = await authForgotPassword( {
        body: {
            email: data.email
        }
    } )

    if( response.data && 'data' in response.data ) {
        const { data } = response.data;
        otpSessionStorage.setOtpSessionData( data.sessionId, data.email );
    }
    return response.data;
}

export const restorePassword = async ( data: {
    sessionId: string;
    email: string;
    otp: string;
    newPassword: string
} ) => {
    const response = await authForgotPasswordReset( {
        body: {
            email: otpSessionStorage?.getOtpSessionEmail() || "", 
            otp: data.otp, 
            sessionId: otpSessionStorage?.getOtpSessionId() || "", 
            newPassword: data.newPassword
        }
    } )
    return response.data;
}

export const refreshToken = async ( data: {
    refreshToken: string
} ) => {
    const response = await authRefreshToken( {
        body: {
            refreshToken: data.refreshToken
        }
    } );

    if ( response.error ) {
        throw response.error;
    }

    if ( response.data && 'accessToken' in response.data ) {
        const accessToken = response.data.accessToken as string;
        const refreshToken = 'refreshToken' in response.data ? ( response.data.refreshToken as string ) : undefined;

        tokenStorage.setTokens( accessToken, refreshToken );
        apiClient.setToken( accessToken );
    }

    return response.data;
}
