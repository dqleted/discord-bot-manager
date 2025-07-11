const express = require('express');
const {
  getUserBots,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  startBot,
  stopBot,
  addCommand,
  updateCommand,
  deleteCommand,
} = require('../controllers/botController');
const { protect } = require('../middleware/errorMiddleware');

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(protect);

// Route per i bot
router.route('/')
  .get(getUserBots)
  .post(createBot);

router.route('/:id')
  .get(getBotById)
  .put(updateBot)
  .delete(deleteBot);

// Route per avviare/fermare i bot
router.post('/:id/start', startBot);
router.post('/:id/stop', stopBot);

// Route per i comandi dei bot
router.route('/:id/commands')
  .post(addCommand);

router.route('/:id/commands/:commandId')
  .put(updateCommand)
  .delete(deleteCommand);

module.exports = router;