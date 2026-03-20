const router = require('express').Router();
const { login, googleLogin } = require('../controllers/authController');

router.post('/login', login);
router.post('/google', googleLogin);

module.exports = router;
