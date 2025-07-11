const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT
 * @param {string} id - ID dell'utente
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * @desc    Registra un nuovo utente
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Utente già esistente');
    }

    // Crea un nuovo utente
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Dati utente non validi');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Autentica un utente e restituisce un token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email o password non validi');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * @desc    Ottiene il profilo dell'utente corrente
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bots', 'name status');

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        bots: user.bots,
        avatar: user.avatar,
      });
    } else {
      res.status(404);
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @desc    Aggiorna il profilo dell'utente
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Inizia il processo di autenticazione con Discord
 * @route   GET /api/auth/discord
 * @access  Public
 */
const discordAuth = (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const scope = 'identify email';

  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
  );
};

/**
 * @desc    Callback per l'autenticazione Discord
 * @route   GET /api/auth/discord/callback
 * @access  Public
 */
const discordCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    // Ottieni il token di accesso da Discord
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenData = await tokenResponse.json();

    // Ottieni le informazioni dell'utente da Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Cerca l'utente nel database o creane uno nuovo
    let user = await User.findOne({ discordId: userData.id });

    if (!user) {
      // Verifica se esiste un utente con la stessa email
      user = await User.findOne({ email: userData.email });

      if (user) {
        // Aggiorna l'utente esistente con le informazioni di Discord
        user.discordId = userData.id;
        user.avatar = userData.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : null;
        await user.save();
      } else {
        // Crea un nuovo utente
        user = await User.create({
          username: userData.username,
          email: userData.email,
          password: Math.random().toString(36).slice(-8), // Password casuale
          discordId: userData.id,
          avatar: userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : null,
        });
      }
    }

    // Genera un token JWT
    const token = generateToken(user._id);

    // Reindirizza l'utente al frontend con il token
    res.redirect(`${process.env.FRONTEND_URL}/auth/discord?token=${token}`);
  } catch (error) {
    console.error('Errore durante l\'autenticazione Discord:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  discordAuth,
  discordCallback,
};