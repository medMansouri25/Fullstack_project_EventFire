import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminEvents from './pages/AdminEvents';
import EventForm from './pages/EventForm';
import MesReservations from './pages/MesReservations';

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mes-reservations" element={<MesReservations />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/new" element={<EventForm />} />
          <Route path="/admin/events/:id/edit" element={<EventForm />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={
          <div className="loading-wrap">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>404</div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Page introuvable</p>
            <a href="/" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', marginTop: 8 }}>
              Retour à l'accueil
            </a>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
