const mongoose = require('mongoose');

/**
 * Funzione per connettersi al database MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Errore: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };