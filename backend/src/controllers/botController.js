const Bot = require('../models/botModel');
const User = require('../models/userModel');
const { Client, GatewayIntentBits } = require('discord.js');

/**
 * @desc    Ottiene tutti i bot dell'utente corrente
 * @route   GET /api/bots
 * @access  Private
 */
const getUserBots = async (req, res) => {
  try {
    const bots = await Bot.find({ owner: req.user._id });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Ottiene un bot specifico per ID
 * @route   GET /api/bots/:id
 * @access  Private
 */
const getBotById = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    res.json(bot);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Crea un nuovo bot
 * @route   POST /api/bots
 * @access  Private
 */
const createBot = async (req, res) => {
  try {
    const { name, token, clientId, prefix, description } = req.body;

    // Crea il nuovo bot
    const bot = await Bot.create({
      name,
      token,
      clientId,
      prefix: prefix || '!',
      description: description || `Un bot Discord creato da ${req.user.username}`,
      owner: req.user._id,
    });

    // Aggiunge il bot alla lista dei bot dell'utente
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bots: bot._id },
    });

    res.status(201).json(bot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Aggiorna un bot esistente
 * @route   PUT /api/bots/:id
 * @access  Private
 */
const updateBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Aggiorna i campi del bot
    bot.name = req.body.name || bot.name;
    bot.prefix = req.body.prefix || bot.prefix;
    bot.description = req.body.description || bot.description;
    bot.avatar = req.body.avatar || bot.avatar;

    // Aggiorna il token solo se fornito
    if (req.body.token) {
      bot.token = req.body.token;
    }

    // Aggiorna le impostazioni se fornite
    if (req.body.settings) {
      bot.settings = { ...bot.settings, ...req.body.settings };
    }

    const updatedBot = await bot.save();
    res.json(updatedBot);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Elimina un bot
 * @route   DELETE /api/bots/:id
 * @access  Private
 */
const deleteBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Rimuove il bot dalla lista dei bot dell'utente
    await User.findByIdAndUpdate(bot.owner, {
      $pull: { bots: bot._id },
    });

    // Elimina il bot
    await bot.remove();

    res.json({ message: 'Bot eliminato' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Avvia un bot
 * @route   POST /api/bots/:id/start
 * @access  Private
 */
const startBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id).select('+token');

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Crea un nuovo client Discord
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    // Evento di login riuscito
    client.once('ready', async () => {
      console.log(`Bot ${bot.name} è online!`);

      // Aggiorna lo stato del bot
      bot.status = 'online';
      bot.statistics.lastActive = Date.now();

      // Raccoglie informazioni sui server
      const servers = client.guilds.cache.map((guild) => ({
        serverId: guild.id,
        serverName: guild.name,
        memberCount: guild.memberCount,
      }));

      bot.statistics.servers = servers;
      await bot.save();
    });

    // Gestione dei messaggi
    client.on('messageCreate', async (message) => {
      // Ignora i messaggi del bot stesso
      if (message.author.bot) return;

      // Incrementa il contatore dei messaggi
      bot.statistics.messageCount += 1;
      await bot.save();

      // Verifica se il messaggio inizia con il prefisso del bot
      if (!message.content.startsWith(bot.prefix)) return;

      // Estrae il comando e gli argomenti
      const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Cerca il comando nella lista dei comandi del bot
      const command = bot.commands.find(
        (cmd) => cmd.name.toLowerCase() === commandName && cmd.enabled
      );

      // Se il comando esiste, esegue la risposta
      if (command) {
        message.channel.send(command.response);
        bot.statistics.commandsUsed += 1;
        await bot.save();
      }
    });

    // Gestione dei nuovi membri
    client.on('guildMemberAdd', async (member) => {
      // Verifica se il messaggio di benvenuto è abilitato
      if (bot.settings.welcomeMessage.enabled) {
        member.send(bot.settings.welcomeMessage.message);
      }

      // Verifica se l'auto-ruolo è abilitato
      if (bot.settings.autoRole.enabled && bot.settings.autoRole.roleId) {
        const role = member.guild.roles.cache.get(bot.settings.autoRole.roleId);
        if (role) {
          member.roles.add(role).catch(console.error);
        }
      }
    });

    // Gestione degli errori
    client.on('error', async (error) => {
      console.error(`Errore nel bot ${bot.name}:`, error);
      bot.status = 'error';
      await bot.save();
    });

    // Login del bot
    await client.login(bot.token);

    res.json({ message: 'Bot avviato con successo' });
  } catch (error) {
    console.error('Errore durante l\'avvio del bot:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Ferma un bot
 * @route   POST /api/bots/:id/stop
 * @access  Private
 */
const stopBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Aggiorna lo stato del bot
    bot.status = 'offline';
    await bot.save();

    res.json({ message: 'Bot fermato con successo' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Aggiunge un comando al bot
 * @route   POST /api/bots/:id/commands
 * @access  Private
 */
const addCommand = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    const { name, description, response } = req.body;

    // Verifica se il comando esiste già
    const commandExists = bot.commands.some((cmd) => cmd.name.toLowerCase() === name.toLowerCase());

    if (commandExists) {
      res.status(400);
      throw new Error('Un comando con questo nome esiste già');
    }

    // Aggiunge il comando
    bot.commands.push({
      name,
      description,
      response,
      enabled: true,
    });

    await bot.save();

    res.status(201).json(bot.commands[bot.commands.length - 1]);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Aggiorna un comando del bot
 * @route   PUT /api/bots/:id/commands/:commandId
 * @access  Private
 */
const updateCommand = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Trova il comando
    const command = bot.commands.id(req.params.commandId);

    if (!command) {
      res.status(404);
      throw new Error('Comando non trovato');
    }

    // Aggiorna il comando
    command.name = req.body.name || command.name;
    command.description = req.body.description || command.description;
    command.response = req.body.response || command.response;
    command.enabled = req.body.enabled !== undefined ? req.body.enabled : command.enabled;

    await bot.save();

    res.json(command);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Elimina un comando del bot
 * @route   DELETE /api/bots/:id/commands/:commandId
 * @access  Private
 */
const deleteCommand = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    // Verifica se il bot esiste
    if (!bot) {
      res.status(404);
      throw new Error('Bot non trovato');
    }

    // Verifica se l'utente è il proprietario del bot
    if (bot.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Non autorizzato');
    }

    // Trova il comando
    const command = bot.commands.id(req.params.commandId);

    if (!command) {
      res.status(404);
      throw new Error('Comando non trovato');
    }

    // Rimuove il comando
    command.remove();
    await bot.save();

    res.json({ message: 'Comando eliminato' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

module.exports = {
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
};