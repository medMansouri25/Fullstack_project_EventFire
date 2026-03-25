import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { creerReservation } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';
import {
  CalendarIcon, ClockIcon, MapPinIcon, BuildingIcon,
  TicketIcon, ZapIcon, AlertTriangleIcon, ArrowLeftIcon, MusicIcon,
} from '../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

function AvailabilityBar({ capacite, billetsVendus }) {
  const total     = capacite || 0;
  const sold      = billetsVendus || 0;
  const pct       = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
  const remaining = Math.max(0, total - sold);

  let fillClass = 'avail-fill green';
  if (pct >= 80) fillClass = 'avail-fill red';
  else if (pct >= 50) fillClass = 'avail-fill amber';

  return (
    <>
      <div className="price-avail-row">
        <span className="price-avail-label">
          <TicketIcon size={14} /> Billets vendus
        </span>
        <span className="price-avail-count">
          {sold.toLocaleString('fr-FR')}/{total.toLocaleString('fr-FR')} places
        </span>
      </div>
      <div className="avail-track" style={{ marginBottom: 8 }}>
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
      {total > 0 && (
        <p className={`price-avail-note ${pct >= 100 ? 'full' : pct >= 80 ? 'last' : pct >= 50 ? 'low' : 'ok'}`}>
          {pct >= 100
            ? 'Complet — plus de places disponibles'
            : pct >= 80
            ? <><ZapIcon size={13} /> Dernières places ! ({remaining} restantes)</>
            : pct >= 50
            ? `Places limitées (${remaining} restantes)`
            : `${remaining.toLocaleString('fr-FR')} places disponibles`}
        </p>
      )}
    </>
  );
}

export default function EventDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [places, setPlaces]       = useState(1);
  const [resLoading, setResLoading] = useState(false);
  const [resMsg, setResMsg]       = useState({ type: '', text: '' });

  useEffect(() => {
    async function load() {
      setLoading(true); setError('');
      try { setEvent(await getEventById(id)); }
      catch (err) { console.error(err); setError("Impossible de charger cet événement."); }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <p className="loading-text">Chargement de l'événement…</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="loading-wrap">
        <span style={{ color: 'var(--primary)', marginBottom: 12 }}>
          <AlertTriangleIcon size={40} />
        </span>
        <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>Événement introuvable</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>{error}</p>
        <Link to="/" className="btn btn-primary btn-sm">
          <ArrowLeftIcon size={14} /> Retour aux événements
        </Link>
      </div>
    );
  }

  const { titre, description, categorie, type, date, heure, ville, lieu, organisateur, prix, capacite, billetsVendus, image } = event;

  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const isPast = eventDate < todayDate;

  return (
    <div>
      {/* Back link */}
      <div className="back-link-wrap">
        <Link to="/" className="back-link">
          <ArrowLeftIcon size={15} /> Retour aux événements
        </Link>
      </div>

      {/* Hero */}
      <div className="details-hero">
        {image ? (
          <img src={image} alt={titre} />
        ) : (
          <div className="details-hero-placeholder">
            <MusicIcon size={64} />
          </div>
        )}
        <div className="details-hero-overlay">
          <div className="details-hero-badges">
            {categorie && <span className="badge badge-detail-category">{categorie}</span>}
            {type      && <span className="badge badge-detail-type">{type}</span>}
          </div>
          <h1 className="details-hero-title">{titre}</h1>
          {organisateur && (
            <p className="details-hero-organizer">
              <BuildingIcon size={14} /> {organisateur}
            </p>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="details-content">
        {/* Left */}
        <div className="details-left-card">
          {description && (
            <>
              <h2 className="details-section-h2">À propos de l'événement</h2>
              <p className="details-description">{description}</p>
            </>
          )}

          <h3 className="details-section-h3">Informations pratiques</h3>
          <div className="details-info-list">
            {date && (
              <div className="details-info-item">
                <span className="details-info-icon"><CalendarIcon size={16} /></span>
                <div>
                  <span className="details-info-label">Date</span>
                  <span className="details-info-value">{formatDate(date)}</span>
                </div>
              </div>
            )}
            {heure && (
              <div className="details-info-item">
                <span className="details-info-icon"><ClockIcon size={16} /></span>
                <div>
                  <span className="details-info-label">Heure</span>
                  <span className="details-info-value">{heure}</span>
                </div>
              </div>
            )}
            {(lieu || ville) && (
              <div className="details-info-item">
                <span className="details-info-icon"><MapPinIcon size={16} /></span>
                <div>
                  <span className="details-info-label">Lieu</span>
                  <span className="details-info-value">
                    {[lieu, ville].filter(Boolean).join(' — ')}
                  </span>
                </div>
              </div>
            )}
            {organisateur && (
              <div className="details-info-item">
                <span className="details-info-icon"><BuildingIcon size={16} /></span>
                <div>
                  <span className="details-info-label">Organisateur</span>
                  <span className="details-info-value">{organisateur}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: prix */}
        <div className="price-card">
          {/* Prix */}
          <div className="price-main">
            {prix === 0 || prix === undefined || prix === null ? (
              <span style={{ color: 'var(--green)', fontSize: '2rem', fontWeight: 800 }}>Gratuit</span>
            ) : (
              <>
                {prix}
                <span className="price-main-euro"> €</span>
              </>
            )}
          </div>
          <p className="price-sub">par billet</p>

          {/* Disponibilité */}
          <AvailabilityBar capacite={capacite} billetsVendus={billetsVendus} />

          {/* ── Événement clôturé ── */}
          {isPast ? (
            <div style={{
              textAlign: 'center', padding: '20px 0',
              color: '#6b7280', borderTop: '1px solid var(--border)', marginTop: 12
            }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Événement clôturé</p>
              <p style={{ fontSize: '0.83rem' }}>Cet événement s'est déjà déroulé.</p>
            </div>
          ) : (
          <>
          {/* Message réservation */}
          {resMsg.text && (
            <div className={resMsg.type === 'success' ? 'res-msg res-msg--success' : 'res-msg res-msg--error'}>
              {resMsg.text}
            </div>
          )}

          {/* ── Visiteur connecté ── */}
          {user?.role === 'visiteur' ? (
            <>
              <div className="places-row">
                <label className="places-label">Nombre de places</label>
                <div className="places-input-wrap">
                  <button
                    className="places-stepper"
                    type="button"
                    onClick={() => setPlaces(p => Math.max(1, p - 1))}
                    aria-label="Moins"
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, (event.capacite || 0) - (event.billetsVendus || 0))}
                    value={places}
                    onChange={(e) => setPlaces(Math.max(1, parseInt(e.target.value) || 1))}
                    className="places-input"
                    aria-label="Nombre de places"
                  />
                  <button
                    className="places-stepper"
                    type="button"
                    onClick={() => setPlaces(p => Math.min((event.capacite || 0) - (event.billetsVendus || 0), p + 1))}
                    aria-label="Plus"
                  >+</button>
                </div>
              </div>
              {prix > 0 && (
                <p className="places-total">
                  Total : <strong>{(prix * places).toLocaleString('fr-FR')} €</strong>
                </p>
              )}
              <button
                className="btn btn-primary reserve-btn"
                disabled={resLoading || (event.capacite - event.billetsVendus) <= 0}
                onClick={async () => {
                  setResLoading(true); setResMsg({ type: '', text: '' });
                  try {
                    await creerReservation(event._id, places, token);
                    setResMsg({ type: 'success', text: `${places} place(s) réservée(s) avec succès ! Un email de confirmation vous a été envoyé.` });
                  } catch (err) {
                    setResMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la réservation.' });
                  } finally {
                    setResLoading(false);
                  }
                }}
              >
                {resLoading ? 'Réservation en cours…' : 'Réserver maintenant'}
              </button>
            </>

          ) : user?.role === 'admin' ? (
            /* ── Admin ── */
            <div className="price-card-notice">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              La réservation est réservée aux visiteurs
            </div>

          ) : (
            /* ── Non connecté ── */
            <div className="price-cta-anon">
              <button className="btn btn-primary reserve-btn" onClick={() => navigate('/register')}>
                Créer un compte pour réserver
              </button>
              <Link to="/login?role=client" className="btn-outline-login">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Déjà un compte ? Se connecter
              </Link>
            </div>
          )}

          <p className="secure-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Réservation sécurisée · Annulation gratuite
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
