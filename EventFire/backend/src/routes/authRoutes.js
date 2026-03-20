const router   = require('express').Router();
const passport  = require('../config/passport');
const jwt       = require('jsonwebtoken');
const { login, googleLogin, register } = require('../controllers/authController');

// ── Email / password ────────────────────────────────────────────────────────
router.post('/login', login);
router.post('/register', register);

// ── Google (ID token depuis le bouton front) ────────────────────────────────
router.post('/google', googleLogin);

// ── Google OAuth2 redirect (Passport.js) ───────────────────────────────────
router.get('/google/redirect',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`, session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );
    // Redirige vers le front avec le JWT dans l'URL
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  }
);

module.exports = router;
