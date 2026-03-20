import { useState, useCallback, useEffect, useRef } from 'react';

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin',
               'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function buildGrid(year, month) {
  const firstDow      = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ day: daysInPrevMonth - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  let next = 1;
  while (cells.length % 7 !== 0)
    cells.push({ day: next++, current: false });
  return cells;
}

function formatDisplay(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

/* ── Icônes SVG ─────────────────────────────────────────────────────────── */
function CalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function ChevronLeft()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRight() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>; }
function XIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

/**
 * CalendarPicker — datepicker en popover
 * Props :
 *   date          {string}  "YYYY-MM-DD"
 *   heure         {string}  "HH:MM"
 *   onDateChange  (dateStr)  → void
 *   onHeureChange (heureStr) → void
 */
export default function CalendarPicker({ date, heure, onDateChange, onHeureChange }) {
  const today    = new Date();
  const selected = date ? new Date(date + 'T00:00:00') : null;

  const [open, setOpen] = useState(false);
  const [viewYear,  setViewYear]  = useState(selected ? selected.getFullYear()  : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth()     : today.getMonth());

  const wrapRef = useRef(null);

  // Fermer en cliquant en dehors
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Fermer avec Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const prevMonth = useCallback(() => {
    setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
  }, []);
  const nextMonth = useCallback(() => {
    setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
  }, []);

  const selectDay = useCallback((cell) => {
    if (!cell.current) return;
    const d    = new Date(viewYear, viewMonth, cell.day);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    onDateChange(`${yyyy}-${mm}-${dd}`);
    setOpen(false); // ferme après sélection
  }, [viewYear, viewMonth, onDateChange]);

  const clearDate = useCallback((e) => {
    e.stopPropagation();
    onDateChange('');
  }, [onDateChange]);

  const grid = buildGrid(viewYear, viewMonth);

  return (
    <div className="cal-wrap" ref={wrapRef}>

      {/* ── Trigger ─────────────────────────────────────────────────── */}
      <div className="cal-fields-row">
        {/* Champ Date (trigger) */}
        <div className="cal-trigger-group">
          <label className="cal-trigger-label">Date</label>
          <button
            type="button"
            className={`cal-trigger${open ? ' cal-trigger--open' : ''}${date ? ' cal-trigger--filled' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span className="cal-trigger-icon"><CalIcon /></span>
            <span className="cal-trigger-text">
              {date ? formatDisplay(date) : 'Sélectionner une date'}
            </span>
            {date && (
              <span className="cal-trigger-clear" onClick={clearDate} title="Effacer">
                <XIcon />
              </span>
            )}
          </button>
        </div>

        {/* Champ Heure (toujours visible) */}
        <div className="cal-trigger-group">
          <label className="cal-trigger-label" htmlFor="cal-heure">Heure</label>
          <div className="cal-time-input-wrap">
            <span className="cal-time-icon"><ClockIcon /></span>
            <input
              id="cal-heure"
              type="time"
              className="cal-time-input"
              value={heure}
              onChange={e => onHeureChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Popover calendrier ──────────────────────────────────────── */}
      {open && (
        <div className="cal-popover" role="dialog" aria-label="Sélecteur de date">
          <div className="cal-body">

            {/* Navigation mois */}
            <div className="cal-nav">
              <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Mois précédent">
                <ChevronLeft />
              </button>
              <span className="cal-month-label">{MOIS[viewMonth]} {viewYear}</span>
              <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Mois suivant">
                <ChevronRight />
              </button>
            </div>

            {/* Grille */}
            <div className="cal-grid">
              {JOURS.map(j => (
                <span key={j} className="cal-day-header">{j}</span>
              ))}
              {grid.map((cell, i) => {
                const cellDate = new Date(viewYear, viewMonth + (cell.current ? 0 : cell.day > 15 ? -1 : 1), cell.day);
                const isToday  = cell.current && isSameDay(cellDate, today);
                const isSel    = selected && cell.current && isSameDay(cellDate, selected);
                const isPast   = cell.current && cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                let cls = 'cal-day';
                if (!cell.current)  cls += ' cal-day--out';
                else if (isSel)     cls += ' cal-day--selected';
                else if (isToday)   cls += ' cal-day--today';
                else if (isPast)    cls += ' cal-day--past';

                return (
                  <button
                    key={i}
                    type="button"
                    className={cls}
                    onClick={() => selectDay(cell)}
                    disabled={!cell.current}
                    aria-label={cell.current ? `${cell.day} ${MOIS[viewMonth]} ${viewYear}` : undefined}
                    aria-pressed={isSel || undefined}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer résumé */}
          {(date || heure) && (
            <div className="cal-footer">
              {date  && <span>📅 {formatDisplay(date)}</span>}
              {heure && <span>🕐 {heure}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
