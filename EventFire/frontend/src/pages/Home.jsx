import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/eventService';
import { AlertTriangleIcon, MusicIcon } from '../components/ui/Icons';

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', type: '' });
  const [showPast, setShowPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEvents(filters);
      const all = Array.isArray(data) ? data : data.events || [];
      setEvents(all);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les événements. Vérifiez que le serveur est démarré.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents     = events.filter(e => new Date(e.date) < today);
  const pastCount      = pastEvents.length;
  const visibleEvents  = showPast ? events : upcomingEvents;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero" aria-label="Bannière principale">
        <div className="hero-content">
          <h1 className="hero-title">Découvrez les meilleurs événements</h1>
          <p className="hero-subtitle">
            Concerts, opéras, théâtres, expositions et bien plus encore
          </p>
        </div>
      </section>

      {/* ── Filter bar (below hero, NOT overlapping) ── */}
      <div className="page-section">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* ── Results count + toggle événements passés ── */}
      {!loading && !error && (
        <div className="results-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <strong>{visibleEvents.length}</strong>{' '}
            événement{visibleEvents.length !== 1 ? 's' : ''} trouvé{visibleEvents.length !== 1 ? 's' : ''}
          </span>
          {pastCount > 0 && (
            <button
              onClick={() => setShowPast(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
            >
              {showPast ? 'Masquer les événements passés' : `Voir les ${pastCount} événement${pastCount > 1 ? 's' : ''} passé${pastCount > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="loading-wrap">
          <div className="loading-spinner" />
          <p className="loading-text">Chargement des événements…</p>
        </div>
      ) : error ? (
        <div className="loading-wrap">
          <span style={{ color: 'var(--primary)', marginBottom: 12 }}><AlertTriangleIcon size={40} /></span>
          <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>Erreur de connexion</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{error}</p>
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="events-grid">
          <div className="empty-state">
            <div className="empty-state-icon"><MusicIcon size={40} /></div>
            <h3 className="empty-state-title">Aucun événement trouvé</h3>
            <p className="empty-state-sub">Essayez de modifier vos filtres de recherche.</p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {visibleEvents.map((event) => (
            <EventCard key={event._id} event={event} isPast={new Date(event.date) < today} />
          ))}
        </div>
      )}
    </div>
  );
}
