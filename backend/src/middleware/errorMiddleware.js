/**
 * Middleware per la gestione degli errori
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Middleware per la gestione delle risorse non trovate
 */
const notFound = (req, res, next) => {
  const error = new Error(`Non trovato - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware per la protezione delle route che richiedono autenticazione
 */
const protect = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/userModel');

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ottieni il token dall'header
      token = req.headers.authorization.split(' ')[1];

      // Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ottieni i dati dell'utente dal token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorizzato, token non valido');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorizzato, token non trovato');
  }
};

/**
 * Middleware per verificare se l'utente è un amministratore
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Non autorizzato come amministratore');
  }
};

module.exports = { errorHandler, notFound, protect, admin };