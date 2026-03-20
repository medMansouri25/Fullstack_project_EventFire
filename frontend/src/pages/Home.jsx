import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/eventService';
import { AlertTriangleIcon, MusicIcon } from '../components/ui/Icons';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEvents(filters);
      setEvents(Array.isArray(data) ? data : data.events || []);
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

      {/* ── Results count ── */}
      {!loading && !error && (
        <div className="results-bar">
          <strong>{events.length}</strong>{' '}
          événement{events.length !== 1 ? 's' : ''} trouvé{events.length !== 1 ? 's' : ''}
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
      ) : events.length === 0 ? (
        <div className="events-grid">
          <div className="empty-state">
            <div className="empty-state-icon"><MusicIcon size={40} /></div>
            <h3 className="empty-state-title">Aucun événement trouvé</h3>
            <p className="empty-state-sub">Essayez de modifier vos filtres de recherche.</p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
