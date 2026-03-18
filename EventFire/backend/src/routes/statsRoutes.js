const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');

// GET / → getStats (auth required)
router.get('/', auth, getStats);

module.exports = router;
