const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  discordAuth,
  discordCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/errorMiddleware');

const router = express.Router();

// Registrazione e login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Autenticazione Discord
router.get('/discord', discordAuth);
router.get('/discord/callback', discordCallback);

// Profilo utente (richiede autenticazione)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;