import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { LearningPathPage } from '@/pages/learning-path/LearningPathPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import ProtectedRoute from './ProtectedRoute';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPassword';
import { OTPPage } from '@/pages/auth/OTPPage';
import { RestorePasswordPage } from '@/pages/auth/RestorePasswordPage';

export const router = createBrowserRouter( [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/signIn',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '/otp',
        element: <OTPPage />,
    },
    {
        path: '/restore-password',
        element: <RestorePasswordPage />
    },
    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'learning-paths',
                element: <LearningPathPage />,
            },
            {
                path: 'learning-paths/:id',
                element: <LearningPathPage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
        ],
    },
] );
