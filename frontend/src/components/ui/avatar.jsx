import { useState } from 'react';

export function Avatar({ className = '', children }) {
  return (
    <span className={`ui-avatar ${className}`}>
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt = '', className = '' }) {
  const [error, setError] = useState(false);
  if (!src || error) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`ui-avatar-image ${className}`}
      onError={() => setError(true)}
    />
  );
}

export function AvatarFallback({ children, className = '' }) {
  return (
    <span className={`ui-avatar-fallback ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}
