const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Générer le JWT interne ──────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/auth/login  (email + password) ────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar } });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ── POST /api/auth/google  (Google ID token) ────────────────────────────────
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: 'Token Google manquant' });

    // Vérifier le token avec Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Chercher ou créer l'utilisateur
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.collection.insertOne({
        email,
        googleId,
        name: name || '',
        avatar: picture || '',
        password: null,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      user = await User.findOne({ email });
    } else if (!user.googleId) {
      // Lier le compte Google à un compte existant
      await User.updateOne({ _id: user._id }, { googleId, name, avatar: picture });
      user = await User.findById(user._id);
    }

    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar } });

  } catch (error) {
    console.error('Erreur Google login:', error.message);
    res.status(401).json({ message: 'Token Google invalide' });
  }
};

module.exports = { login, googleLogin };
