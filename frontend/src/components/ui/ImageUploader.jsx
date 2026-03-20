import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

/* ── Icônes ────────────────────────────────────────────────────────────── */
function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

/**
 * ImageUploader
 * Props :
 *   value    {string}  URL actuelle de l'image
 *   onChange (url) → void
 */
export default function ImageUploader({ value, onChange }) {
  const { token } = useAuth();
  const [tab, setTab]         = useState('url');   // 'url' | 'upload'
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  /* ── Upload vers le backend ──────────────────────────────────────────── */
  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Seules les images sont acceptées (JPEG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux. Maximum 5 Mo.');
      return;
    }

    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur upload');
      // Construire l'URL absolue si besoin
      const url = data.url.startsWith('http') ? data.url : `${API}${data.url}`;
      onChange(url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }, [token, onChange]);

  /* ── Drag & drop ─────────────────────────────────────────────────────── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const hasPreview = value && (isValidUrl(value) || value.startsWith('/uploads'));

  return (
    <div className="img-uploader">

      {/* ── Onglets ─────────────────────────────────────────────────── */}
      <div className="img-tabs" role="tablist">
        <button
          type="button" role="tab"
          className={`img-tab${tab === 'url' ? ' img-tab--active' : ''}`}
          onClick={() => setTab('url')}
        >
          <LinkIcon /> URL
        </button>
        <button
          type="button" role="tab"
          className={`img-tab${tab === 'upload' ? ' img-tab--active' : ''}`}
          onClick={() => setTab('upload')}
        >
          <ImageIcon /> Importer un fichier
        </button>
      </div>

      {/* ── Contenu ──────────────────────────────────────────────────── */}
      <div className="img-panel">

        {/* Onglet URL */}
        {tab === 'url' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        )}

        {/* Onglet Upload */}
        {tab === 'upload' && (
          <div
            className={`img-dropzone${dragging ? ' img-dropzone--drag' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            aria-label="Zone de dépôt d'image"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
            {uploading ? (
              <div className="img-dropzone-content">
                <div className="loading-spinner" style={{ width: 28, height: 28 }} />
                <p className="img-dropzone-text">Envoi en cours…</p>
              </div>
            ) : (
              <div className="img-dropzone-content">
                <span className="img-dropzone-icon"><UploadIcon /></span>
                <p className="img-dropzone-text">
                  <strong>Glissez une image</strong> ou <span className="img-dropzone-link">parcourez</span>
                </p>
                <p className="img-dropzone-hint">JPEG, PNG, WebP, GIF — max 5 Mo</p>
              </div>
            )}
          </div>
        )}

        {/* Erreur upload */}
        {uploadError && (
          <p className="img-error">⚠️ {uploadError}</p>
        )}

        {/* ── Prévisualisation ─────────────────────────────────────── */}
        {hasPreview && (
          <div className="img-preview">
            <img
              src={value}
              alt="Aperçu"
              onError={e => e.currentTarget.style.display = 'none'}
            />
            <button
              type="button"
              className="img-preview-clear"
              onClick={() => onChange('')}
              title="Supprimer l'image"
            >
              <XIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
