import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function AvailabilityBar({ capacite, billetsVendus }) {
  const total = capacite || 0;
  const sold = billetsVendus || 0;
  const pct = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
  const remaining = Math.max(0, total - sold);

  let fillClass = 'avail-fill green';
  if (pct >= 80) fillClass = 'avail-fill red';
  else if (pct >= 50) fillClass = 'avail-fill amber';

  return (
    <>
      <div className="price-avail-row">
        <span className="price-avail-label">
          🎟️ Billets vendus
        </span>
        <span className="price-avail-count">{sold.toLocaleString('fr-FR')}/{total.toLocaleString('fr-FR')} places</span>
      </div>
      <div className="avail-track" style={{ marginBottom: 8 }}>
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
      {total > 0 && (
        <p className={`price-avail-note ${pct >= 100 ? 'full' : pct >= 80 ? 'last' : pct >= 50 ? 'low' : 'ok'}`}>
          {pct >= 100
            ? 'Complet — plus de places disponibles'
            : pct >= 80
            ? `⚡ Dernières places ! (${remaining} restantes)`
            : pct >= 50
            ? `Places limitées (${remaining} restantes)`
            : `${remaining.toLocaleString('fr-FR')} places disponibles`}
        </p>
      )}
    </>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger cet événement.");
      } finally {
        setLoading(false);
      }
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
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
        <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>Événement introuvable</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>{error}</p>
        <Link to="/" className="btn btn-primary btn-sm">← Retour aux événements</Link>
      </div>
    );
  }

  const {
    titre, description, categorie, type, date, heure, ville,
    lieu, organisateur, prix, capacite, billetsVendus, image,
  } = event;

  return (
    <div>
      {/* ── Back link ── */}
      <div className="back-link-wrap">
        <Link to="/" className="back-link">← Retour aux événements</Link>
      </div>

      {/* ── Hero image with bottom-left overlay ── */}
      <div className="details-hero">
        {image ? (
          <img src={image} alt={titre} />
        ) : (
          <div className="details-hero-placeholder">🎭</div>
        )}
        <div className="details-hero-overlay">
          <div className="details-hero-badges">
            {categorie && (
              <span className="badge badge-detail-category">{categorie}</span>
            )}
            {type && (
              <span className="badge badge-detail-type">{type}</span>
            )}
          </div>
          <h1 className="details-hero-title">{titre}</h1>
          {organisateur && (
            <p className="details-hero-organizer">
              🏢 {organisateur}
            </p>
          )}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="details-content">
        {/* Left: about + practical info */}
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
                <span className="details-info-icon">📅</span>
                <div>
                  <span className="details-info-label">Date</span>
                  <span className="details-info-value">{formatDate(date)}</span>
                </div>
              </div>
            )}
            {heure && (
              <div className="details-info-item">
                <span className="details-info-icon">🕐</span>
                <div>
                  <span className="details-info-label">Heure</span>
                  <span className="details-info-value">{heure}</span>
                </div>
              </div>
            )}
            {(lieu || ville) && (
              <div className="details-info-item">
                <span className="details-info-icon">📍</span>
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
                <span className="details-info-icon">🏢</span>
                <div>
                  <span className="details-info-label">Organisateur</span>
                  <span className="details-info-value">{organisateur}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: sticky price + reservation card */}
        <div className="price-card">
          <div className="price-main">
            <span className="price-main-euro">€</span>
            {prix === 0 || prix === undefined || prix === null
              ? 'Gratuit'
              : `${prix}€`}
          </div>
          <p className="price-sub">par billet</p>

          <AvailabilityBar capacite={capacite} billetsVendus={billetsVendus} />

          <button className="btn btn-primary reserve-btn">
            Réserver maintenant
          </button>

          <p className="secure-note">
            Réservation sécurisée • Annulation gratuite
          </p>
        </div>
      </div>
    </div>
  );
}
