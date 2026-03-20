const router = require('express').Router();
const auth  = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
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

// Admin-only routes
router.post('/',     auth, admin, createEvent);
router.put('/:id',   auth, admin, updateEvent);
router.delete('/:id', auth, admin, deleteEvent);

module.exports = router;
