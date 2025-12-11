import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>Verificando autenticação...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }

    return <Outlet />;
}