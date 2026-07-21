import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useSession();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/boards" replace />;
    }

    return <>{children}</>;
}