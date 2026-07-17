import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Boards from "../pages/Boards";
import ConfirmEmail from "../pages/ConfirmEmail";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
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
        ],
    },
])