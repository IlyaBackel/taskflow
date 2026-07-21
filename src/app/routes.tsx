import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Boards from "../pages/Boards";
import ConfirmEmail from "../pages/ConfirmEmail";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import PublicRoute from "./PublicRoute";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>)
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>)
    },
    {
        path: '/confirm-email',
        element: <ConfirmEmail />,
    },
    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: '/', element: <Navigate to="/boards" replace /> },
            { path: '/boards', element: <Boards /> },
            { path: '/profile', element: <Profile /> },
        ],
    },
])