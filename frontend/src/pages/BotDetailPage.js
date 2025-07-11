import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  ContentCopy as CopyIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Componente per il grafico delle statistiche (placeholder)
const StatisticsChart = ({ data, title }) => {
  return (
    <Card sx={{ height: '100%', minHeight: 250 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Grafico statistiche (implementazione futura)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const BotDetailPage = () => {
  const { botId } = useParams();
  const { token } = useAuth();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Carica i dettagli del bot
  const fetchBotDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBot(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Si è verificato un errore durante il caricamento dei dettagli del bot.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotDetails();
  }, [botId, token]);

  // Gestione cambio tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gestione avvio/arresto bot
  const handleBotStatusChange = async (action) => {
    setStatusLoading(true);
    setStatusMessage(null);
    try {
      const response = await axios.post(
        `/api/bots/${botId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBot({ ...bot, isActive: action === 'start' });
      setStatusMessage({
        type: 'success',
        text: response.data.message || `Bot ${action === 'start' ? 'avviato' : 'arrestato'} con successo!`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          `Si è verificato un errore durante l'${action === 'start' ? 'avvio' : 'arresto'} del bot.`,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // Copia token
  const handleCopyToken = () => {
    navigator.clipboard.writeText(bot.token);
    setStatusMessage({
      type: 'success',
      text: 'Token copiato negli appunti!',
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={RouterLink}
          to="/dashboard/bots"
          variant="outlined"
        >
          Torna alla lista dei bot
        </Button>
      </Container>
    );
  }

  if (!bot) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Bot non trovato o non hai i permessi per visualizzarlo.
        </Alert>
        <Button
          component={RouterLink}
          to="/dashboard/bots"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Torna alla lista dei bot
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header con info bot e azioni */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={bot.avatar}
                alt={bot.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4" component="h1">
                    {bot.name}
                  </Typography>
                  <Chip
                    icon={bot.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={bot.isActive ? 'Attivo' : 'Inattivo'}
                    color={bot.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {bot.description || 'Nessuna descrizione disponibile'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Token del Bot:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  maxWidth: '100%',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {bot.token}
                </Typography>
                <Tooltip title="Copia token">
                  <IconButton
                    size="small"
                    onClick={handleCopyToken}
                    sx={{ ml: 1 }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                color={bot.isActive ? 'error' : 'success'}
                startIcon={bot.isActive ? <StopIcon /> : <StartIcon />}
                onClick={() =>
                  handleBotStatusChange(bot.isActive ? 'stop' : 'start')
                }
                disabled={statusLoading}
              >
                {statusLoading ? (
                  <CircularProgress size={24} />
                ) : bot.isActive ? (
                  'Arresta Bot'
                ) : (
                  'Avvia Bot'
                )}
              </Button>

              <Button
                component={RouterLink}
                to={`/dashboard/bots/${botId}/edit`}
                variant="outlined"
                startIcon={<EditIcon />}
              >
                Modifica Bot
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={fetchBotDetails}
              >
                Aggiorna Dati
              </Button>
            </Box>
          </Grid>
        </Grid>

        {statusMessage && (
          <Alert
            severity={statusMessage.type}
            sx={{ mt: 2 }}
            onClose={() => setStatusMessage(null)}
          >
            {statusMessage.text}
          </Alert>
        )}
      </Paper>

      {/* Statistiche rapide */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {bot.servers?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Server Connessi
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <CodeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {bot.commands?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comandi
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <MessageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {bot.messageCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Messaggi Processati
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <TimelineIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {bot.uptime ? `${Math.floor(bot.uptime / 3600)}h` : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tempo di Attività
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs per diverse sezioni */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Panoramica" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Comandi" icon={<CodeIcon />} iconPosition="start" />
          <Tab label="Server" icon={<GroupIcon />} iconPosition="start" />
          <Tab
            label="Configurazione"
            icon={<SettingsIcon />}
            iconPosition="start"
          />
          <Tab label="Logs" icon={<DatabaseIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Contenuto delle tab */}
      <Box sx={{ mt: 3 }}>
        {/* Tab Panoramica */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatisticsChart
                title="Messaggi processati (ultimi 7 giorni)"
                data={[]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatisticsChart
                title="Comandi eseguiti (ultimi 7 giorni)"
                data={[]}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Generali
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CodeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Prefisso Comandi"
                          secondary={bot.prefix || '!'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <GroupIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Server Connessi"
                          secondary={bot.servers?.length || 0}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <MessageIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Messaggi Totali"
                          secondary={bot.messageCount || 0}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TimelineIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Creato il"
                          secondary={
                            new Date(bot.createdAt).toLocaleDateString('it-IT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tab Comandi */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Comandi del Bot</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                component={RouterLink}
                to={`/dashboard/bots/${botId}/commands/create`}
              >
                Aggiungi Comando
              </Button>
            </Box>

            {bot.commands && bot.commands.length > 0 ? (
              <List>
                {bot.commands.map((command, index) => (
                  <React.Fragment key={command._id || index}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            component={RouterLink}
                            to={`/dashboard/bots/${botId}/commands/${command._id}/edit`}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <CodeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {bot.prefix || '!'}{command.name}
                            </Typography>
                            {command.isEnabled ? (
                              <Chip
                                label="Attivo"
                                size="small"
                                color="success"
                                sx={{ ml: 1 }}
                              />
                            ) : (
                              <Chip
                                label="Disattivato"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={command.description || 'Nessuna descrizione'}
                      />
                    </ListItem>
                    {index < bot.commands.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Nessun comando configurato per questo bot
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to={`/dashboard/bots/${botId}/commands/create`}
                  sx={{ mt: 2 }}
                >
                  Aggiungi il primo comando
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {/* Tab Server */}
        {activeTab === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Server Connessi
            </Typography>

            {bot.servers && bot.servers.length > 0 ? (
              <List>
                {bot.servers.map((server, index) => (
                  <React.Fragment key={server._id || index}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar
                          src={server.icon}
                          alt={server.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {server.name?.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={server.name}
                        secondary={`ID: ${server.serverId} • Membri: ${server.memberCount || 'N/A'}`}
                      />
                    </ListItem>
                    {index < bot.servers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Il bot non è ancora connesso a nessun server Discord
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Tab Configurazione */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Configurazione del Bot
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Modifica le impostazioni generali del tuo bot dalla pagina di
              modifica.
            </Typography>
            <Button
              component={RouterLink}
              to={`/dashboard/bots/${botId}/edit`}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Modifica Configurazione
            </Button>
          </Paper>
        )}

        {/* Tab Logs */}
        {activeTab === 4 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Log del Bot
            </Typography>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                height: 300,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                I log del bot saranno visualizzati qui (funzionalità in arrivo)
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default BotDetailPage;