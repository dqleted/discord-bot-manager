const mongoose = require('mongoose');

const botSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Il nome del bot è obbligatorio'],
      trim: true,
    },
    token: {
      type: String,
      required: [true, 'Il token del bot è obbligatorio'],
      select: false, // Non includere il token nelle query
    },
    clientId: {
      type: String,
      required: [true, "L'ID client del bot è obbligatorio"],
    },
    prefix: {
      type: String,
      default: '!',
    },
    description: {
      type: String,
      default: 'Un bot Discord creato con Discord Bot Manager',
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'error'],
      default: 'offline',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commands: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        response: {
          type: String,
          required: true,
        },
      },
    ],
    settings: {
      welcomeMessage: {
        enabled: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: 'Benvenuto nel server!',
        },
      },
      autoRole: {
        enabled: {
          type: Boolean,
          default: false,
        },
        roleId: {
          type: String,
        },
      },
      moderationEnabled: {
        type: Boolean,
        default: false,
      },
    },
    statistics: {
      messageCount: {
        type: Number,
        default: 0,
      },
      commandsUsed: {
        type: Number,
        default: 0,
      },
      lastActive: {
        type: Date,
      },
      servers: [
        {
          serverId: String,
          serverName: String,
          memberCount: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;