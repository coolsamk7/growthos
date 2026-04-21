import { ApiClient } from '@growthos/api-client';
import { tokenStorage } from '@/utils/tokenStorage';
import { refreshToken } from './auth.service';

export const apiClient = new ApiClient( import.meta.env['VITE_API_URL'] );

// Setup automatic token refresh
apiClient.setRefreshTokenCallback( async () => {
    const storedRefreshToken = tokenStorage.getRefreshToken();
    
    if ( !storedRefreshToken ) {
        throw new Error( 'No refresh token available' );
    }
    
    await refreshToken( { refreshToken: storedRefreshToken } );
    
    const newAccessToken = tokenStorage.getAccessToken();
    if ( !newAccessToken ) {
        throw new Error( 'Failed to refresh token' );
    }
    
    return newAccessToken;
} );
