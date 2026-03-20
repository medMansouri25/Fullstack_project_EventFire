const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  visiteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event:    { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  places:   { type: Number, required: true, min: 1 },
  statut:   { type: String, enum: ['confirmée', 'annulée'], default: 'confirmée' },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
