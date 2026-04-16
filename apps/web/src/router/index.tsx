import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/home/HomePage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { LoginPage } from '@/pages/auth/LoginPage'
import { LearningPathPage } from "@/pages/learning-path/LearningPathPage";
import { SignupPage } from "@/pages/auth/SignupPage";

export const router = createBrowserRouter( [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/signIn",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignupPage />
    },
    {
        path: "/app",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "learning-paths",
                element: <LearningPathPage />,
            },
            {
                path: "learning-paths/:id",
                element: <LearningPathPage />,
            },
        ],
    },
] );
