const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
    setTokens( accessToken: string, refreshToken?: string ) {
        localStorage.setItem( ACCESS_TOKEN_KEY, accessToken );
        if ( refreshToken ) {
            localStorage.setItem( REFRESH_TOKEN_KEY, refreshToken );
        }
    },

    getAccessToken(): string | null {
        return localStorage.getItem( ACCESS_TOKEN_KEY );
    },

    getRefreshToken(): string | null {
        return localStorage.getItem( REFRESH_TOKEN_KEY );
    },

    clearTokens() {
        localStorage.removeItem( ACCESS_TOKEN_KEY );
        localStorage.removeItem( REFRESH_TOKEN_KEY );
    },
};
