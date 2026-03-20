const Event = require('../models/Event');

// Champs autorisés — empêche le mass assignment (injection de champs arbitraires)
// billetsVendus est géré exclusivement par le système de réservation
const ALLOWED_FIELDS = ['titre', 'description', 'categorie', 'type', 'date', 'heure',
                        'ville', 'lieu', 'organisateur', 'prix', 'capacite', 'image'];

function pickAllowed(body) {
  return ALLOWED_FIELDS.reduce((acc, key) => {
    if (key in body) acc[key] = body[key];
    return acc;
  }, {});
}

// Échappe les caractères spéciaux regex — empêche le ReDoS
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/events — ?search=&category=&type=
const getEvents = async (req, res) => {
  try {
    const { search, category, type } = req.query;
    const filter = {};

    if (search) {
      const safe = escapeRegex(String(search).slice(0, 100)); // max 100 chars
      filter.$or = [
        { titre:        { $regex: safe, $options: 'i' } },
        { description:  { $regex: safe, $options: 'i' } },
        { ville:        { $regex: safe, $options: 'i' } },
        { lieu:         { $regex: safe, $options: 'i' } },
        { organisateur: { $regex: safe, $options: 'i' } },
      ];
    }

    if (category) filter.categorie = { $regex: escapeRegex(String(category).slice(0, 50)), $options: 'i' };
    if (type)     filter.type      = { $regex: escapeRegex(String(type).slice(0, 50)),     $options: 'i' };

    const events = await Event.find(filter).sort({ date: 1, heure: 1 });
    res.json(events);
  } catch (error) {
    console.error('Erreur getEvents:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Événement introuvable' });
    res.json(event);
  } catch (error) {
    console.error('Erreur getEventById:', error);
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Événement introuvable' });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/events (auth required)
const createEvent = async (req, res) => {
  try {
    const event = new Event(pickAllowed(req.body)); // ← plus de mass assignment
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Erreur createEvent:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/events/:id (auth required)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      pickAllowed(req.body), // ← plus de mass assignment
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Événement introuvable' });
    res.json(event);
  } catch (error) {
    console.error('Erreur updateEvent:', error);
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Événement introuvable' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/events/:id (auth required)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Événement introuvable' });
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteEvent:', error);
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Événement introuvable' });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
