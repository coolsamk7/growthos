import axios, { type AxiosInstance } from 'axios';
import { client } from './generated/client.gen';

export class ApiClient {
    private axiosInstance: AxiosInstance;
    private refreshTokenCallback?: () => Promise<string>;

    constructor( baseURL: string, token?: string ) {
        this.axiosInstance = axios.create( {
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...( token && { Authorization: `Bearer ${token}` } ),
            },
        } );

        client.setConfig( {
            baseUrl: baseURL,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        } );

        this.setupInterceptors();
    }

    private setupInterceptors() {
        client.interceptors.response.use( async ( response, request, options ) => {
            if ( response.status === 401 && this.refreshTokenCallback ) {
                try {
                    const newAccessToken = await this.refreshTokenCallback();
                    
                    // Update the token
                    this.setToken( newAccessToken );
                    
                    // Retry the original request with new token
                    const retryHeaders = new Headers( request.headers );
                    retryHeaders.set( 'Authorization', `Bearer ${newAccessToken}` );
                    
                    const retryRequest = new Request( request.url, {
                        method: request.method,
                        headers: retryHeaders,
                        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().text() : undefined,
                    } );
                    
                    const retryResponse = await fetch( retryRequest );
                    return retryResponse;
                } catch ( error ) {
                    // If refresh fails, return the original 401 response
                    return response;
                }
            }
            return response;
        } );
    }

    setRefreshTokenCallback( callback: () => Promise<string> ) {
        this.refreshTokenCallback = callback;
    }

    setToken( token: string ) {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        client.setConfig( {
            headers: { Authorization: `Bearer ${token}` },
        } );
    }

    clearToken() {
        delete this.axiosInstance.defaults.headers.common['Authorization'];
        client.setConfig( {
            headers: {},
        } );
    }

    getInstance() {
        return this.axiosInstance;
    }
}
