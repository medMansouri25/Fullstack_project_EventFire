import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEvents, deleteEvent } from '../services/eventService';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Returns a CSS class name for the type/category badge */
function typeBadgeClass(value) {
  if (!value) return 'badge badge-other';
  const v = value.toLowerCase();
  if (v === 'musical') return 'badge badge-musical';
  if (v === 'culturel') return 'badge badge-culturel';
  return 'badge badge-other';
}

export default function AdminEvents() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les événements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id, titre) => {
    if (!window.confirm(`Supprimer l'événement "${titre}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await deleteEvent(id, token);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (e.titre || '').toLowerCase().includes(q) ||
      (e.organisateur || '').toLowerCase().includes(q) ||
      (e.ville || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-content">
      {/* ── Page header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestion des événements</h1>
          <p className="admin-page-subtitle">Créer, modifier et supprimer des événements</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/events/new')}
        >
          ➕ Nouvel événement
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="table-wrap">
        {/* Toolbar: search + count */}
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <span className="icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un événement…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!loading && (
            <span className="table-count">
              {filtered.length} événement{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <p className="loading-text">Chargement…</p>
          </div>
        ) : error ? (
          <div className="loading-wrap">
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">Aucun événement trouvé</h3>
            <p className="empty-state-sub">
              {search
                ? 'Aucun résultat pour cette recherche.'
                : 'Commencez par créer votre premier événement.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Événement</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Billets</th>
                  <th>Prix</th>
                  <th style={{ width: 96 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => {
                  const sold = event.billetsVendus || 0;
                  const total = event.capacite || 0;
                  const pct = total > 0 ? Math.round((sold / total) * 100) : 0;

                  return (
                    <tr key={event._id}>
                      {/* Événement: thumbnail + title + organizer */}
                      <td>
                        <div className="table-event-cell">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.titre}
                              className="table-thumbnail"
                            />
                          ) : (
                            <div className="table-thumbnail-placeholder">🎭</div>
                          )}
                          <div>
                            <div className="table-event-name">{event.titre}</div>
                            {event.organisateur && (
                              <div className="table-event-org">{event.organisateur}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type + categorie badges */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {event.type && (
                            <span
                              className={typeBadgeClass(event.type)}
                              style={{ alignSelf: 'flex-start' }}
                            >
                              {event.type}
                            </span>
                          )}
                          {event.categorie && (
                            <span
                              className={typeBadgeClass(event.categorie)}
                              style={{ alignSelf: 'flex-start' }}
                            >
                              {event.categorie}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.84rem' }}>{formatDate(event.date)}</div>
                        {event.heure && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {event.heure}
                          </div>
                        )}
                      </td>

                      {/* Lieu */}
                      <td>
                        {event.ville && (
                          <div style={{ fontSize: '0.84rem' }}>{event.ville}</div>
                        )}
                        {event.lieu && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {event.lieu}
                          </div>
                        )}
                      </td>

                      {/* Billets: X/Y + % + mini bar */}
                      <td style={{ minWidth: 110 }}>
                        <div style={{ fontSize: '0.8rem', marginBottom: 5, color: 'var(--text-muted)' }}>
                          {sold}/{total} · {pct}%
                        </div>
                        <div className="avail-track" style={{ height: 5 }}>
                          <div
                            className={`avail-fill ${pct >= 80 ? 'red' : pct >= 50 ? 'amber' : 'green'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Prix */}
                      <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {event.prix === 0 ? 'Gratuit' : `${event.prix} €`}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-icon edit"
                            title="Modifier"
                            onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon delete"
                            title="Supprimer"
                            disabled={deletingId === event._id}
                            onClick={() => handleDelete(event._id, event.titre)}
                          >
                            {deletingId === event._id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
