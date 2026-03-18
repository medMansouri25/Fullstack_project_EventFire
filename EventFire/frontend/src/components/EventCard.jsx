import { useNavigate } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
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

  let fillClass = 'avail-fill green';
  if (pct >= 80) fillClass = 'avail-fill red';
  else if (pct >= 50) fillClass = 'avail-fill amber';

  return (
    <div className="avail-wrap">
      <div className="avail-labels">
        <span className="avail-label-left">Billets vendus</span>
        <span>{sold.toLocaleString('fr-FR')}/{total.toLocaleString('fr-FR')} places</span>
      </div>
      <div className="avail-track">
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const {
    _id,
    titre,
    description,
    categorie,
    type,
    date,
    heure,
    ville,
    lieu,
    prix,
    capacite,
    billetsVendus,
    image,
  } = event;

  return (
    <article className="event-card" onClick={() => navigate(`/events/${_id}`)}>
      {/* Image with badges overlaid at bottom-left */}
      <div className="event-card-image-wrap">
        {image ? (
          <img src={image} alt={titre} />
        ) : (
          <div className="event-card-image-placeholder">🎭</div>
        )}
        <div className="event-card-badges">
          {/* Left badge: category — white bg, black text */}
          {categorie && (
            <span className="badge badge-category">{categorie}</span>
          )}
          {/* Right badge: type — orange bg, white text */}
          {type && (
            <span className="badge badge-type">{type}</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="event-card-body">
        <h3 className="event-card-title">{titre}</h3>

        {description && (
          <p className="event-card-desc">{description}</p>
        )}

        <div className="event-card-meta">
          {(date || heure) && (
            <div className="event-meta-item">
              <span className="meta-icon">📅</span>
              <span>{formatDate(date)}{heure ? ` · ${heure}` : ''}</span>
            </div>
          )}
          {(ville || lieu) && (
            <div className="event-meta-item">
              <span className="meta-icon">📍</span>
              <span>{[lieu, ville].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {prix !== undefined && prix !== null && (
            <div className="event-meta-item">
              <span className="meta-icon">💶</span>
              <span className="event-price-tag">
                {prix === 0 ? 'Gratuit' : `${prix} €`}
              </span>
            </div>
          )}
        </div>

        <AvailabilityBar capacite={capacite} billetsVendus={billetsVendus} />
      </div>
    </article>
  );
}
