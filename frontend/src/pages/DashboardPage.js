import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBots: 0,
    activeBots: 0,
    totalServers: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/bots');
        setBots(data);

        // Calcola le statistiche
        const activeBots = data.filter((bot) => bot.status === 'online').length;
        const totalServers = data.reduce(
          (acc, bot) => acc + (bot.stats?.servers || 0),
          0
        );
        const totalMessages = data.reduce(
          (acc, bot) => acc + (bot.stats?.messageCount || 0),
          0
        );

        setStats({
          totalBots: data.length,
          activeBots,
          totalServers,
          totalMessages,
        });

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Si è verificato un errore durante il caricamento dei bot'
        );
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  // Funzione per ottenere il colore dello stato del bot
  const getBotStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'starting':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Benvenuto, {user?.username}! Gestisci i tuoi bot Discord da qui.
        </Typography>
      </Box>

      {/* Statistiche generali */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Typography variant="h6">Bot Totali</Typography>
            <Typography variant="h3">{stats.totalBots}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Typography variant="h6">Bot Attivi</Typography>
            <Typography variant="h3">{stats.activeBots}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'info.light',
              color: 'info.contrastText',
            }}
          >
            <Typography variant="h6">Server Totali</Typography>
            <Typography variant="h3">{stats.totalServers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <Typography variant="h6">Messaggi Totali</Typography>
            <Typography variant="h3">{stats.totalMessages}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista dei bot */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">I tuoi Bot</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/bots/create"
        >
          Crea Nuovo Bot
        </Button>
      </Box>

      {bots.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Non hai ancora creato nessun bot.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/bots/create"
          >
            Crea il tuo primo Bot
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bots.map((bot) => (
            <Grid item xs={12} sm={6} md={4} key={bot._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {bot.name}
                    </Typography>
                    <Chip
                      label={bot.status}
                      color={getBotStatusColor(bot.status)}
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {bot.description || 'Nessuna descrizione'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Prefix: <strong>{bot.prefix}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Server: <strong>{bot.stats?.servers || 0}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Comandi: <strong>{bot.customCommands?.length || 0}</strong>
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    component={RouterLink}
                    to={`/bots/${bot._id}`}
                  >
                    Dettagli
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    to={`/bots/${bot._id}/edit`}
                  >
                    Modifica
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;