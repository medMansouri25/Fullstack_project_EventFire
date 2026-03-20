import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mesReservations, annulerReservation } from '../services/reservationService';
import { CalendarIcon, MapPinIcon, TicketIcon, AlertTriangleIcon } from '../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function MesReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [annulant, setAnnulant]         = useState(null); // id en cours d'annulation

  async function charger() {
    setLoading(true); setError('');
    try {
      const data = await mesReservations(token);
      setReservations(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { charger(); }, [token]);

  async function handleAnnuler(id) {
    if (!window.confirm('Confirmer l\'annulation de cette réservation ?')) return;
    setAnnulant(id);
    try {
      await annulerReservation(id, token);
      charger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation.');
    } finally {
      setAnnulant(null);
    }
  }

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <p className="loading-text">Chargement de vos réservations…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Mes réservations</h1>
      <p className="dashboard-subtitle">Historique de vos billets réservés</p>

      {error && (
        <div className="error-alert" style={{ maxWidth: 500, marginBottom: 24 }}>
          <AlertTriangleIcon size={16} /> {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 60 }}>
          <div className="empty-state-icon"><TicketIcon size={40} /></div>
          <h3 className="empty-state-title">Aucune réservation</h3>
          <p className="empty-state-sub">Explorez les événements et réservez vos places !</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Voir les événements</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
          {reservations.map((r) => (
            <div key={r._id} style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
              padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start',
              opacity: r.statut === 'annulée' ? 0.6 : 1,
            }}>
              {r.event?.image && (
                <img
                  src={r.event.image}
                  alt={r.event.titre}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{r.event?.titre}</h3>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: r.statut === 'confirmée' ? '#dcfce7' : '#fee2e2',
                    color: r.statut === 'confirmée' ? '#166534' : '#991b1b',
                    whiteSpace: 'nowrap',
                  }}>
                    {r.statut === 'confirmée' ? '✅ Confirmée' : '❌ Annulée'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    <CalendarIcon size={13} /> {formatDate(r.event?.date)} à {r.event?.heure}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    <MapPinIcon size={13} /> {r.event?.lieu}, {r.event?.ville}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    <TicketIcon size={13} /> {r.places} place{r.places > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                    {((r.event?.prix || 0) * r.places).toLocaleString('fr-FR')} €
                  </span>
                  {r.statut === 'confirmée' && (
                    <button
                      className="btn btn-sm"
                      onClick={() => handleAnnuler(r._id)}
                      disabled={annulant === r._id}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none', fontSize: '0.8rem', padding: '6px 14px', opacity: annulant === r._id ? 0.6 : 1 }}
                    >
                      {annulant === r._id ? 'Annulation…' : 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
