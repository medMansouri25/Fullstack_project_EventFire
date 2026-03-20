import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'AD';
}

/* Logo SVG flame — accessible, scalable */
function FlameLogo() {
  return (
    <svg
      className="navbar-logo-svg"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* outer flame */}
      <path
        d="M14 2C14 2 8 8.5 8 14.5C8 18.09 10.69 21 14 21C17.31 21 20 18.09 20 14.5C20 8.5 14 2 14 2Z"
        fill="#E84C1E"
      />
      {/* inner glow */}
      <path
        d="M14 8C14 8 10.5 12 10.5 15C10.5 17.49 12.02 19 14 19C15.98 19 17.5 17.49 17.5 15C17.5 12 14 8 14 8Z"
        fill="#FF8C42"
      />
      {/* core */}
      <ellipse cx="14" cy="16.5" rx="2.5" ry="3" fill="#FFD580" />
    </svg>
  );
}

export default function Navbar() {
  const { isAdmin, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* ── Admin navbar ── */
  if (isAdmin && isAdminRoute) {
    return (
      <nav className="navbar" role="navigation" aria-label="Navigation administrateur">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="EventFire — Retour à l'accueil">
            <FlameLogo />
            <span>EventFire</span>
          </Link>

          <div className="navbar-links" role="menubar">
            <Link
              to="/admin"
              className={`navbar-link${location.pathname === '/admin' ? ' active' : ''}`}
              role="menuitem"
              aria-current={location.pathname === '/admin' ? 'page' : undefined}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.9"/>
              </svg>
              Tableau de bord
            </Link>
            <Link
              to="/admin/events"
              className={`navbar-link${location.pathname.startsWith('/admin/events') ? ' active' : ''}`}
              role="menuitem"
              aria-current={location.pathname.startsWith('/admin/events') ? 'page' : undefined}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="2" y="11.5" width="8" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
              Gestion des événements
            </Link>

            {/* ── Avatar + info admin ── */}
            <div className="navbar-admin-info" aria-label="Compte administrateur">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name || 'Admin'} />
                <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
              </Avatar>
              <div className="navbar-admin-meta">
                <span className="navbar-admin-name">{user?.name || user?.email || 'Administrateur'}</span>
                <span className="navbar-admin-role">Admin</span>
              </div>
            </div>

            <button
              className="btn-logout"
              onClick={handleLogout}
              aria-label="Se déconnecter"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10.5 5L13.5 8L10.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    );
  }

  /* ── Public navbar ── */
  return (
    <nav className="navbar" role="navigation" aria-label="Navigation principale">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="EventFire — Retour à l'accueil">
          <FlameLogo />
          <span>EventFire</span>
        </Link>

        <div className="navbar-links" role="menubar">
          <Link to="/" className="navbar-link" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="2" rx="1" fill="currentColor"/>
              <rect x="9" y="2" width="5" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="12" width="5" height="2" rx="1" fill="currentColor"/>
              <rect x="9" y="12" width="5" height="2" rx="1" fill="currentColor"/>
            </svg>
            Événements
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="btn-admin-nav" role="menuitem">
              Admin
            </Link>
          ) : (
            <Link to="/login" className="btn-admin-nav" role="menuitem">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
