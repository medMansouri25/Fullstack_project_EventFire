const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// ── 1. Helmet — HTTP security headers ──────────────────────────────────────
const helmetMiddleware = helmet({
  // CSP désactivé : API JSON pure, pas de rendu HTML
  contentSecurityPolicy: false,
  // Empêche les navigateurs de deviner le Content-Type (MIME sniffing)
  noSniff: true,
  // Empêche le clickjacking (X-Frame-Options: DENY)
  frameguard: { action: 'deny' },
  // Force HTTPS en prod (HSTS)
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true }
    : false,
  // Masque le header "X-Powered-By: Express"
  hidePoweredBy: true,
  // XSS filter header pour les anciens navigateurs
  xssFilter: true,
});

// ── 2. Rate limiting — anti brute-force ────────────────────────────────────
// Auth : 10 tentatives max / 15 min / IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // ne compte que les échecs
});

// API générale : 200 requêtes / 15 min / IP (anti-scraping / DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Trop de requêtes. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── 3. Mongo Sanitize — anti NoSQL injection ───────────────────────────────
// express-mongo-sanitize incompatible avec Express 5 (req.query est read-only)
// On sanitise manuellement req.body et req.params uniquement
const mongoSanitizeMiddleware = (req, _res, next) => {
  const sanitize = mongoSanitize.sanitize;
  if (req.body)   req.body   = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
};

module.exports = { helmetMiddleware, authLimiter, apiLimiter, mongoSanitizeMiddleware };
