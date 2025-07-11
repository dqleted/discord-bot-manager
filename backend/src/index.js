const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Carica le variabili d'ambiente
dotenv.config();

// Connessione al database
connectDB();

// Inizializza l'app Express
const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// Definizione delle routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bots', require('./routes/botRoutes'));

// Route di base
app.get('/', (req, res) => {
  res.json({ message: 'API Discord Bot Manager' });
});

// Middleware per la gestione degli errori
app.use(errorHandler);

// Avvio del server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server in esecuzione in modalità ${process.env.NODE_ENV} sulla porta ${PORT}`);
});

// Gestione della chiusura del server
process.on('unhandledRejection', (err) => {
  console.log(`Errore: ${err.message}`);
  server.close(() => process.exit(1));
});