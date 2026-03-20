import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, BanknoteIcon } from './ui/Icons';

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

/* Placeholder quand pas d'image */
function ImagePlaceholder() {
  return (
    <div className="event-card-image-placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
           style={{ color: '#c5c9d1' }}>
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    </div>
  );
}

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const {
    _id, titre, description, categorie, type,
    date, heure, ville, lieu, prix, capacite, billetsVendus, image,
  } = event;

  return (
    <article className="event-card" onClick={() => navigate(`/events/${_id}`)}>
      {/* Image */}
      <div className="event-card-image-wrap">
        {image ? (
          <img src={image} alt={titre} />
        ) : (
          <ImagePlaceholder />
        )}
        <div className="event-card-badges">
          {categorie && <span className="badge badge-category">{categorie}</span>}
          {type      && <span className="badge badge-type">{type}</span>}
        </div>
      </div>

      {/* Corps */}
      <div className="event-card-body">
        <h3 className="event-card-title">{titre}</h3>
        {description && <p className="event-card-desc">{description}</p>}

        <div className="event-card-meta">
          {(date || heure) && (
            <div className="event-meta-item">
              <span className="meta-icon"><CalendarIcon size={14} /></span>
              <span>{formatDate(date)}{heure ? ` · ${heure}` : ''}</span>
            </div>
          )}
          {(ville || lieu) && (
            <div className="event-meta-item">
              <span className="meta-icon"><MapPinIcon size={14} /></span>
              <span>{[lieu, ville].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {prix !== undefined && prix !== null && (
            <div className="event-meta-item">
              <span className="meta-icon"><BanknoteIcon size={14} /></span>
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
