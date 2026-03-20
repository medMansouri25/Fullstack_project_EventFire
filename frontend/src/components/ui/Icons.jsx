/**
 * Bibliothèque d'icônes SVG — EventFire
 * Toutes les icônes partagent : stroke="currentColor", strokeWidth="1.75",
 * strokeLinecap="round", strokeLinejoin="round", fill="none"
 * Usage : <CalendarIcon size={16} />
 */

function Icon({ size = 16, children, ...rest }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function CalendarIcon({ size }) {
  return (
    <Icon size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </Icon>
  );
}

export function ClockIcon({ size }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </Icon>
  );
}

export function MapPinIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </Icon>
  );
}

export function EuroIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M18 6.527A9 9 0 116 17.473"/>
      <line x1="3" y1="10" x2="14" y2="10"/>
      <line x1="3" y1="14" x2="14" y2="14"/>
    </Icon>
  );
}

export function BanknoteIcon({ size }) {
  return (
    <Icon size={size}>
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </Icon>
  );
}

export function TicketIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M2 9a3 3 0 010-6h20a3 3 0 010 6"/>
      <path d="M2 15a3 3 0 000 6h20a3 3 0 000-6"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </Icon>
  );
}

export function BuildingIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </Icon>
  );
}

export function BarChartIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </Icon>
  );
}

export function TrendingUpIcon({ size }) {
  return (
    <Icon size={size}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </Icon>
  );
}

export function AlertTriangleIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </Icon>
  );
}

export function ZapIcon({ size }) {
  return (
    <Icon size={size}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </Icon>
  );
}

export function MusicIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </Icon>
  );
}

export function InboxIcon({ size }) {
  return (
    <Icon size={size}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
    </Icon>
  );
}

export function EditIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </Icon>
  );
}

export function TrashIcon({ size }) {
  return (
    <Icon size={size}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </Icon>
  );
}

export function PlusIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </Icon>
  );
}

export function SearchIcon({ size }) {
  return (
    <Icon size={size}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </Icon>
  );
}

export function SaveIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </Icon>
  );
}

export function ArrowLeftIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </Icon>
  );
}

export function LoaderIcon({ size }) {
  return (
    <Icon size={size} style={{ animation: 'spin 1s linear infinite' }}>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </Icon>
  );
}
