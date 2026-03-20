const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { creerReservation, mesReservations, annulerReservation } = require('../controllers/reservationController');

router.post('/',        auth, creerReservation);
router.get('/me',       auth, mesReservations);
router.delete('/:id',   auth, annulerReservation);

module.exports = router;
