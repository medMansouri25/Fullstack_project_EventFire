const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (auth required)
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
