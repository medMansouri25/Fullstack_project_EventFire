import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventById, createEvent, updateEvent } from '../services/eventService';
import CalendarPicker from '../components/ui/CalendarPicker';
import ImageUploader from '../components/ui/ImageUploader';
import { AlertTriangleIcon, ArrowLeftIcon, SaveIcon } from '../components/ui/Icons';

const EMPTY_FORM = {
  titre: '',
  description: '',
  categorie: '',
  type: '',
  date: '',
  heure: '',
  ville: '',
  lieu: '',
  organisateur: '',
  prix: '',
  capacite: '',
  image: '',
};


function SectionHeader({ title }) {
  return (
    <div className="form-section-header">
      <p className="form-section-title">{title}</p>
    </div>
  );
}

export default function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* Load existing event in edit mode */
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      setLoading(true);
      try {
        const data = await getEventById(id);
        setForm({
          titre: data.titre || '',
          description: data.description || '',
          categorie: data.categorie || '',
          type: data.type || '',
          date: data.date ? data.date.substring(0, 10) : '',
          heure: data.heure || '',
          ville: data.ville || '',
          lieu: data.lieu || '',
          organisateur: data.organisateur || '',
          prix: data.prix !== undefined ? String(data.prix) : '',
          capacite: data.capacite !== undefined ? String(data.capacite) : '',
          image: data.image || '',
          _billetsVendus: data.billetsVendus || 0, // lecture seule, non envoyé
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    setSaving(true);
    setError('');

    const { _billetsVendus, ...formData } = form; // eslint-disable-line no-unused-vars
    const payload = {
      ...formData,
      prix: form.prix !== '' ? Number(form.prix) : 0,
      capacite: form.capacite !== '' ? Number(form.capacite) : 0,
    };

    try {
      if (isEdit) {
        await updateEvent(id, payload, token);
      } else {
        await createEvent(payload, token);
      }
      navigate('/admin/events');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <p className="loading-text">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back link */}
      <Link to="/admin/events" className="back-link" style={{ marginBottom: 16, display: 'inline-flex' }}>
        ← Retour à la liste
      </Link>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="admin-page-title">
          {isEdit ? "Modifier l'événement" : 'Nouvel événement'}
        </h1>
        <p className="admin-page-subtitle">
          {isEdit
            ? 'Modifiez les informations de cet événement.'
            : 'Remplissez les informations pour créer un nouvel événement.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          {/* Error alert */}
          {error && (
            <div className="error-alert" style={{ marginBottom: 20 }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Informations générales ── */}
          <SectionHeader title="Informations générales" />
          <div className="form-grid form-spacer">
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="titre">
                Titre
              </label>
              <input
                id="titre"
                type="text"
                className="form-input"
                placeholder="Ex : Symphonie n°9 de Beethoven"
                value={form.titre}
                onChange={handleChange('titre')}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Décrivez l'événement…"
                value={form.description}
                onChange={handleChange('description')}
                rows={4}
              />
            </div>
          </div>

          {/* ── Classification ── */}
          <SectionHeader title="Classification" />
          <div className="form-grid-2 form-spacer">
            <div className="form-group">
              <label className="form-label" htmlFor="categorie">Catégorie</label>
              <select
                id="categorie"
                className="form-select"
                value={form.categorie}
                onChange={handleChange('categorie')}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Musical">Musical</option>
                <option value="Culturel">Culturel</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="type">Type</label>
              <select
                id="type"
                className="form-select"
                value={form.type}
                onChange={handleChange('type')}
              >
                <option value="">Sélectionner un type</option>
                <option value="Symphonie">Symphonie</option>
                <option value="Festival">Festival</option>
                <option value="Opéra">Opéra</option>
                <option value="Concert">Concert</option>
                <option value="Théâtre">Théâtre</option>
                <option value="Ballet">Ballet</option>
                <option value="Exposition">Exposition</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {/* ── Date & Lieu ── */}
          <SectionHeader title="Date & Lieu" />
          <div className="form-spacer">
            <CalendarPicker
              date={form.date}
              heure={form.heure}
              onDateChange={(d) => setForm(prev => ({ ...prev, date: d }))}
              onHeureChange={(h) => setForm(prev => ({ ...prev, heure: h }))}
            />
          </div>
          <div className="form-grid-2 form-spacer">
            <div className="form-group">
              <label className="form-label" htmlFor="ville">Ville</label>
              <input
                id="ville"
                type="text"
                className="form-input"
                placeholder="Ex : Paris"
                value={form.ville}
                onChange={handleChange('ville')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lieu">Salle / Lieu</label>
              <input
                id="lieu"
                type="text"
                className="form-input"
                placeholder="Ex : Opéra Garnier"
                value={form.lieu}
                onChange={handleChange('lieu')}
              />
            </div>
          </div>
          <div className="form-grid form-spacer">
            <div className="form-group">
              <label className="form-label" htmlFor="organisateur">Organisateur</label>
              <input
                id="organisateur"
                type="text"
                className="form-input"
                placeholder="Ex : Orchestre National de France"
                value={form.organisateur}
                onChange={handleChange('organisateur')}
              />
            </div>
          </div>

          {/* ── Billetterie ── */}
          <SectionHeader title="Billetterie" />
          <div className={`form-spacer ${isEdit ? 'form-grid-3' : 'form-grid-2'}`}>
            <div className="form-group">
              <label className="form-label" htmlFor="prix">Prix (€)</label>
              <input
                id="prix"
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0"
                value={form.prix}
                onChange={handleChange('prix')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="capacite">Capacité totale</label>
              <input
                id="capacite"
                type="number"
                min="1"
                className="form-input"
                placeholder="100"
                value={form.capacite}
                onChange={handleChange('capacite')}
              />
            </div>
            {isEdit && (
              <div className="form-group">
                <label className="form-label">Billets vendus</label>
                <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'default' }}>
                  {form._billetsVendus ?? 0}
                  <span style={{ fontSize: '0.75rem', marginLeft: 6 }}>(géré par les réservations)</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Image ── */}
          <SectionHeader title="Image" />
          <div className="form-grid form-spacer">
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
            />
          </div>

          {/* ── Actions ── */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/events')}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? 'Enregistrement…'
                : isEdit
                  ? '💾 Enregistrer les modifications'
                  : '💾 Créer l\'événement'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
