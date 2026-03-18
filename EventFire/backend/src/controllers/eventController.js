const Event = require('../models/Event');

// GET /api/events — supports ?search=&category=&type= query params (case-insensitive regex)
const getEvents = async (req, res) => {
  try {
    const { search, category, type } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ville: { $regex: search, $options: 'i' } },
        { lieu: { $regex: search, $options: 'i' } },
        { organisateur: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.categorie = { $regex: category, $options: 'i' };
    }

    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }

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
    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erreur getEventById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/events (auth required)
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Erreur createEvent:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/events/:id (auth required)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erreur updateEvent:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/events/:id (auth required)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteEvent:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Événement introuvable' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
