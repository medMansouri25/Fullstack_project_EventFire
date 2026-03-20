import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import { AlertTriangleIcon, ArrowLeftIcon } from '../components/ui/Icons';

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    try {
      const data = await registerUser(name, email, password);
      login(data.token, data.user);
      navigate('/mes-reservations');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 2C14 2 8 8.5 8 14.5C8 18.09 10.69 21 14 21C17.31 21 20 18.09 20 14.5C20 8.5 14 2 14 2Z" fill="#E84C1E"/>
            <path d="M14 8C14 8 10.5 12 10.5 15C10.5 17.49 12.02 19 14 19C15.98 19 17.5 17.49 17.5 15C17.5 12 14 8 14 8Z" fill="#FF8C42"/>
            <ellipse cx="14" cy="16.5" rx="2.5" ry="3" fill="#FFD580"/>
          </svg>
          <span>EventFire</span>
        </div>

        <h1 className="login-title">Créer un compte</h1>
        <p className="login-subtitle">Réservez vos événements en quelques clics</p>

        {error && (
          <div className="error-alert" role="alert">
            <AlertTriangleIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nom complet</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="jean@exemple.fr"
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
              placeholder="6 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: 6, padding: '12px' }}
          >
            {loading ? 'Inscription en cours…' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <Link to="/login?role=client" style={{ color: 'var(--primary)', fontWeight: 600 }}>Se connecter</Link>
        </p>

        <div className="login-back">
          <Link to="/" className="back-link" style={{ justifyContent: 'center' }}>
            <ArrowLeftIcon size={15} /> Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
