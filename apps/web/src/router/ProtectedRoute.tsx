import { Navigate } from 'react-router-dom';
import { tokenStorage } from '@/utils/tokenStorage';

export default function ProtectedRoute( { children }: any ) {
    const token = tokenStorage.getAccessToken();

    if ( !token ) {
        return <Navigate to="/signIn" replace />;
    }

    return children;
}
