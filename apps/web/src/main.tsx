import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import App from './App';
import '@/theme/theme.css';
import { apiClient } from '@/services/api';
import { tokenStorage } from '@/utils/tokenStorage';

const queryClient = new QueryClient();

// Initialize API client with stored token
const accessToken = tokenStorage.getAccessToken();
if ( accessToken ) {
    apiClient.setToken( accessToken );
}

createRoot( document.getElementById( 'root' )! ).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
