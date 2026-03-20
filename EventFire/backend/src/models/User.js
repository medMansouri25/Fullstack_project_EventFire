const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null },   // null pour les comptes Google
  googleId: { type: String, default: null },   // ID Google OAuth
  name:     { type: String, default: '' },
  avatar:   { type: String, default: '' },
  role: { type: String, enum: ['admin', 'visiteur'], default: 'visiteur' }
}, { timestamps: true });

// Hash password before save (Mongoose 7+ : async middleware sans next())
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
