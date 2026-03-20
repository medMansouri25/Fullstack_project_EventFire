const Reservation = require('../models/Reservation');
const Event       = require('../models/Event');
const { sendConfirmationEmail } = require('../utils/mailer');

// ── POST /api/reservations ───────────────────────────────────────────────────
const creerReservation = async (req, res) => {
  try {
    const { eventId, places } = req.body;
    if (!eventId || !places || places < 1)
      return res.status(400).json({ message: 'eventId et places (≥1) requis' });

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: 'Événement introuvable' });

    const placesRestantes = event.capacite - event.billetsVendus;
    if (places > placesRestantes)
      return res.status(400).json({ message: `Seulement ${placesRestantes} place(s) disponible(s)` });

    const reservation = await Reservation.create({
      visiteur: req.user.id,
      event: eventId,
      places,
    });

    // Mettre à jour les billets vendus
    await Event.findByIdAndUpdate(eventId, { $inc: { billetsVendus: places } });

    // Envoyer l'email de confirmation (non bloquant — une erreur SMTP ne doit pas annuler la résa)
    try {
      await sendConfirmationEmail(req.user.email, req.user.name, event, places);
    } catch (mailErr) {
      console.error('Email non envoyé (réservation OK):', mailErr.message);
    }

    res.status(201).json({ message: 'Réservation confirmée', reservation });
  } catch (error) {
    console.error('Erreur réservation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ── GET /api/reservations/me ─────────────────────────────────────────────────
const mesReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ visiteur: req.user.id })
      .populate('event', 'titre date heure lieu ville prix image')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Erreur mes réservations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ── DELETE /api/reservations/:id ─────────────────────────────────────────────
const annulerReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, visiteur: req.user.id });
    if (!reservation)
      return res.status(404).json({ message: 'Réservation introuvable' });
    if (reservation.statut === 'annulée')
      return res.status(400).json({ message: 'Réservation déjà annulée' });

    reservation.statut = 'annulée';
    await reservation.save();

    // Remettre les billets en stock
    await Event.findByIdAndUpdate(reservation.event, { $inc: { billetsVendus: -reservation.places } });

    res.json({ message: 'Réservation annulée' });
  } catch (error) {
    console.error('Erreur annulation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { creerReservation, mesReservations, annulerReservation };
