import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Boards = lazy(() => import('../pages/Boards'));
const ConfirmEmail = lazy(() => import('../pages/ConfirmEmail'));
const Profile = lazy(() => import('../pages/Profile'));
const Board = lazy(() => import('../pages/Board'));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
);

const withSuspense = (element: React.ReactNode) => (
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const routes = createBrowserRouter([
    {
        path: '/login',
        element: withSuspense(
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: '/register',
        element: withSuspense(
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
    },
    {
        path: '/confirm-email',
        element: withSuspense(<ConfirmEmail />),
    },
    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: '/', element: <Navigate to="/boards" replace /> },
            { path: '/boards', element: withSuspense(<Boards />) },
            { path: '/profile', element: withSuspense(<Profile />) },
            { path: '/board/:id', element: withSuspense(<Board />) },
        ],
    },
]);