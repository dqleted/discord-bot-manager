/**
 * Script per inizializzare il database MongoDB con le collezioni e dati di esempio
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Bot = require('../models/botModel');
require('dotenv').config();

// Connessione a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connesso: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Errore: ${error.message}`);
    process.exit(1);
  }
};

// Cancella i dati esistenti
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Bot.deleteMany({});
    console.log('Dati esistenti cancellati');
  } catch (error) {
    console.error(`Errore durante la cancellazione dei dati: ${error.message}`);
    process.exit(1);
  }
};

// Crea utenti di esempio
const createUsers = async () => {
  try {
    // Genera salt per la password
    const salt = await bcrypt.genSalt(10);
    
    // Crea un utente admin
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', salt),
      isAdmin: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
    });

    // Crea un utente normale
    const regularUser = await User.create({
      username: 'utente',
      email: 'utente@example.com',
      password: await bcrypt.hash('password123', salt),
      isAdmin: false,
      avatar: 'https://ui-avatars.com/api/?name=Utente&background=random',
    });

    console.log('Utenti di esempio creati');
    return { adminUser, regularUser };
  } catch (error) {
    console.error(`Errore durante la creazione degli utenti: ${error.message}`);
    process.exit(1);
  }
};

// Crea bot di esempio
const createBots = async (users) => {
  try {
    // Bot per l'admin
    const adminBot1 = await Bot.create({
      name: 'AdminBot',
      token: 'token_esempio_admin_bot_1',
      clientId: '123456789012345678',
      prefix: '!',
      description: 'Un bot di esempio per l\'amministratore',
      avatar: 'https://ui-avatars.com/api/?name=AdminBot&background=random',
      status: 'offline',
      owner: users.adminUser._id,
      commands: [
        {
          name: 'saluta',
          description: 'Saluta l\'utente',
          enabled: true,
          response: 'Ciao {user}! Come stai?',
        },
        {
          name: 'info',
          description: 'Mostra informazioni sul server',
          enabled: true,
          response: 'Questo è il server {server_name} con {member_count} membri.',
        },
      ],
      settings: {
        welcomeMessage: {
          enabled: true,
          message: 'Benvenuto {user} nel server {server_name}!',
        },
        autoRole: {
          enabled: false,
          roleId: '',
        },
        moderationEnabled: true,
      },
      statistics: {
        messageCount: 1250,
        commandsUsed: 350,
        lastActive: new Date(),
        servers: [
          {
            serverId: '987654321098765432',
            serverName: 'Server di Test 1',
            memberCount: 120,
          },
          {
            serverId: '876543210987654321',
            serverName: 'Server di Test 2',
            memberCount: 85,
          },
        ],
      },
    });

    // Secondo bot per l'admin
    const adminBot2 = await Bot.create({
      name: 'ModeratorBot',
      token: 'token_esempio_admin_bot_2',
      clientId: '234567890123456789',
      prefix: '/',
      description: 'Un bot per la moderazione del server',
      avatar: 'https://ui-avatars.com/api/?name=ModBot&background=random',
      status: 'offline',
      owner: users.adminUser._id,
      commands: [
        {
          name: 'ban',
          description: 'Banna un utente',
          enabled: true,
          response: 'Utente {target} bannato per {reason}.',
        },
        {
          name: 'kick',
          description: 'Espelle un utente',
          enabled: true,
          response: 'Utente {target} espulso per {reason}.',
        },
        {
          name: 'mute',
          description: 'Silenzia un utente',
          enabled: true,
          response: 'Utente {target} silenziato per {duration}.',
        },
      ],
      settings: {
        welcomeMessage: {
          enabled: false,
          message: '',
        },
        autoRole: {
          enabled: true,
          roleId: '123456789012345678',
        },
        moderationEnabled: true,
      },
      statistics: {
        messageCount: 850,
        commandsUsed: 210,
        lastActive: new Date(),
        servers: [
          {
            serverId: '987654321098765432',
            serverName: 'Server di Test 1',
            memberCount: 120,
          },
        ],
      },
    });

    // Bot per l'utente normale
    const userBot = await Bot.create({
      name: 'HelperBot',
      token: 'token_esempio_user_bot',
      clientId: '345678901234567890',
      prefix: '?',
      description: 'Un bot di supporto per il server',
      avatar: 'https://ui-avatars.com/api/?name=HelperBot&background=random',
      status: 'offline',
      owner: users.regularUser._id,
      commands: [
        {
          name: 'aiuto',
          description: 'Mostra i comandi disponibili',
          enabled: true,
          response: 'Comandi disponibili: aiuto, meteo, dado',
        },
        {
          name: 'meteo',
          description: 'Mostra il meteo',
          enabled: true,
          response: 'Il meteo a {location} è {weather}.',
        },
        {
          name: 'dado',
          description: 'Lancia un dado',
          enabled: true,
          response: 'Hai lanciato un {sides} e hai ottenuto {result}!',
        },
      ],
      settings: {
        welcomeMessage: {
          enabled: true,
          message: 'Ehi {user}, benvenuto nel server!',
        },
        autoRole: {
          enabled: false,
          roleId: '',
        },
        moderationEnabled: false,
      },
      statistics: {
        messageCount: 520,
        commandsUsed: 180,
        lastActive: new Date(),
        servers: [
          {
            serverId: '765432109876543210',
            serverName: 'Server di Prova',
            memberCount: 45,
          },
        ],
      },
    });

    // Aggiorna gli utenti con i riferimenti ai bot
    await User.findByIdAndUpdate(users.adminUser._id, {
      $push: { bots: [adminBot1._id, adminBot2._id] },
    });

    await User.findByIdAndUpdate(users.regularUser._id, {
      $push: { bots: userBot._id },
    });

    console.log('Bot di esempio creati');
  } catch (error) {
    console.error(`Errore durante la creazione dei bot: ${error.message}`);
    process.exit(1);
  }
};

// Funzione principale
const initDb = async () => {
  const conn = await connectDB();
  await clearData();
  const users = await createUsers();
  await createBots(users);
  
  console.log('Inizializzazione del database completata!');
  process.exit(0);
};

// Esegui lo script
initDb();