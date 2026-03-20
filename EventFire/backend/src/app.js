const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const passport = require('./config/passport');
const { helmetMiddleware, authLimiter, apiLimiter, mongoSanitizeMiddleware } = require('./middleware/security');

const app = express();

// ── 1. Helmet (headers sécurité) — en tout premier ─────────────────────────
app.use(helmetMiddleware);

// ── 2. CORS restreint ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, curl, scripts serveur)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origine non autorisée — ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── 3. Body parsing avec limite de taille (anti-DoS payload) ───────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── 4. NoSQL injection sanitization ───────────────────────────────────────
app.use(mongoSanitizeMiddleware);

// ── 5. Passport (sans session — JWT only) ──────────────────────────────────
app.use(passport.initialize());

// ── 5. Rate limiting général sur toutes les routes API ────────────────────
app.use('/api', apiLimiter);

// ── 6. Fichiers statiques (images uploadées) ───────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── 7. Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',   authLimiter, require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/stats',        require('./routes/statsRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// ── 7. Health check ────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'API EventFire', status: 'ok' }));

// ── 8. Global error handler ───────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err.message);
  // Ne jamais exposer la stack en production
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
  });
});

module.exports = app;
