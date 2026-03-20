import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token, isAdmin } = useAuth();

  if (!token) return <Navigate to="/login?role=admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
