# Backend Discord Bot Manager

## Inizializzazione del Database

Per inizializzare il database MongoDB con dati di esempio, segui questi passaggi:

1. Assicurati che MongoDB sia installato e in esecuzione sul tuo sistema
2. Assicurati che tutte le dipendenze siano installate:
   ```
   npm install
   ```
3. Esegui lo script di inizializzazione del database:
   ```
   node src/utils/initDb.js
   ```

Questo script creerà:
- Due utenti di esempio (admin e utente normale)
- Tre bot di esempio con comandi, impostazioni e statistiche

## Credenziali di Accesso

### Utente Admin
- Email: admin@example.com
- Password: password123

### Utente Normale
- Email: utente@example.com
- Password: password123

## Avvio del Server

Per avviare il server in modalità sviluppo:
```
npm run dev
```

Per avviare il server in modalità produzione:
```
npm start
```

Il server sarà disponibile all'indirizzo: http://localhost:5000