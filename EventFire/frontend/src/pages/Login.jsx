import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { loginUser, googleLoginUser } from '../services/authService';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  /* ── Connexion email/password ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    try {
      const data = await loginUser(email, password);
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'Impossible de joindre le serveur (port 2004).' : 'Identifiants incorrects. Veuillez réessayer.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Connexion Google ── */
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); setError('');
    try {
      const data = await googleLoginUser(credentialResponse.credential);
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'Impossible de joindre le serveur (port 2004).' : 'Connexion Google échouée.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('La connexion avec Google a échoué. Veuillez réessayer.');
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 2C14 2 8 8.5 8 14.5C8 18.09 10.69 21 14 21C17.31 21 20 18.09 20 14.5C20 8.5 14 2 14 2Z" fill="#E84C1E"/>
            <path d="M14 8C14 8 10.5 12 10.5 15C10.5 17.49 12.02 19 14 19C15.98 19 17.5 17.49 17.5 15C17.5 12 14 8 14 8Z" fill="#FF8C42"/>
            <ellipse cx="14" cy="16.5" rx="2.5" ry="3" fill="#FFD580"/>
          </svg>
          <span>EventFire</span>
        </div>

        <h1 className="login-title">Connexion Admin</h1>
        <p className="login-subtitle">Accès réservé aux administrateurs</p>

        {/* Erreur */}
        {error && (
          <div className="error-alert" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Bouton Google ── */}
        <div className="google-btn-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
            width="100%"
            locale="fr"
          />
        </div>

        {/* Séparateur */}
        <div className="login-divider">
          <span>ou</span>
        </div>

        {/* ── Formulaire email/password ── */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@eventfire.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: 6, padding: '12px' }}
          >
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>
        </form>

        <div className="login-back">
          <Link to="/" className="back-link" style={{ justifyContent: 'center' }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
