const express = require('express');
const { protect, admin } = require('../middleware/errorMiddleware');

const router = express.Router();

// Controller per gli utenti (da implementare)
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Tutte le route richiedono autenticazione e privilegi di amministratore
router.use(protect);
router.use(admin);

// Route per gli utenti (solo per amministratori)
router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;