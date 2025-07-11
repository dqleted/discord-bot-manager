const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Il nome utente è obbligatorio'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "L'email è obbligatoria"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Inserisci un indirizzo email valido',
      ],
    },
    password: {
      type: String,
      required: [true, 'La password è obbligatoria'],
      minlength: [6, 'La password deve essere di almeno 6 caratteri'],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    discordId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    bots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Metodo per confrontare la password inserita con quella criptata
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware per criptare la password prima di salvare l'utente
userSchema.pre('save', async function (next) {
  // Esegui solo se la password è stata modificata
  if (!this.isModified('password')) {
    next();
  }

  // Genera il salt
  const salt = await bcrypt.genSalt(10);
  // Cripta la password
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;