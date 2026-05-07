import axios, { type AxiosInstance } from 'axios';
import { client } from './generated/client.gen';

export class ApiClient {
    private axiosInstance: AxiosInstance;
    private refreshTokenCallback?: () => Promise<string>;
    private onUnauthorizedCallback?: () => void;

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
            auth: token,
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
                    // If refresh fails, trigger unauthorized callback
                    if ( this.onUnauthorizedCallback ) {
                        this.onUnauthorizedCallback();
                    }
                    return response;
                }
            }
            return response;
        } );
    }

    setRefreshTokenCallback( callback: () => Promise<string> ) {
        this.refreshTokenCallback = callback;
    }

    setOnUnauthorizedCallback( callback: () => void ) {
        this.onUnauthorizedCallback = callback;
    }

    setToken( token: string ) {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        client.setConfig( {
            auth: token,
            headers: { Authorization: `Bearer ${token}` },
        } );
    }

    clearToken() {
        delete this.axiosInstance.defaults.headers.common['Authorization'];
        client.setConfig( {
            auth: undefined,
            headers: {},
        } );
    }

    getInstance() {
        return this.axiosInstance;
    }

    // HTTP method proxies
    async get( url: string, config?: any ) {
        return this.axiosInstance.get( url, config );
    }

    async post( url: string, data?: any, config?: any ) {
        return this.axiosInstance.post( url, data, config );
    }

    async put( url: string, data?: any, config?: any ) {
        return this.axiosInstance.put( url, data, config );
    }

    async delete( url: string, config?: any ) {
        return this.axiosInstance.delete( url, config );
    }

    async patch( url: string, data?: any, config?: any ) {
        return this.axiosInstance.patch( url, data, config );
    }
}
