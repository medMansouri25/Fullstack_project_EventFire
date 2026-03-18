const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  categorie: {
    type: String,
    enum: ['Musical', 'Culturel'],
    required: true
  },
  type: {
    type: String,
    enum: ['Symphonie', 'Festival', 'Opéra', 'Concert', 'Théâtre', 'Ballet', 'Exposition', 'Autre'],
    required: true
  },
  date: { type: String, required: true },   // stored as "YYYY-MM-DD"
  heure: { type: String, required: true },  // stored as "HH:MM"
  ville: { type: String, required: true },
  lieu: { type: String, required: true },
  organisateur: { type: String, required: true },
  prix: { type: Number, default: 0 },
  capacite: { type: Number, default: 0 },
  billetsVendus: { type: Number, default: 0 },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
