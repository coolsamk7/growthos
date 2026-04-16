import axios, { type AxiosInstance } from 'axios';
import { client } from './generated/client.gen';

export class ApiClient {
    private axiosInstance: AxiosInstance;

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
