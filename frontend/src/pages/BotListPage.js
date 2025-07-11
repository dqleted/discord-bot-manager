import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const BotListPage = () => {
  const { token } = useAuth();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const botsPerPage = 6;

  // Carica i bot dell'utente
  const fetchBots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/bots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBots(response.data);
      setTotalPages(Math.ceil(response.data.length / botsPerPage));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Si è verificato un errore durante il caricamento dei bot.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [token]);

  // Filtra i bot in base al termine di ricerca
  const filteredBots = bots.filter((bot) =>
    bot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginazione
  const paginatedBots = filteredBots.slice(
    (page - 1) * botsPerPage,
    page * botsPerPage
  );

  // Gestione eliminazione bot
  const handleDeleteClick = (bot) => {
    setBotToDelete(bot);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/bots/${botToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBots(bots.filter((bot) => bot._id !== botToDelete._id));
      setDeleteDialogOpen(false);
      setBotToDelete(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Si è verificato un errore durante l\'eliminazione del bot.'
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBotToDelete(null);
  };

  // Gestione cambio pagina
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          I tuoi Bot
        </Typography>
        <Button
          component={RouterLink}
          to="/dashboard/bots/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Crea Nuovo Bot
        </Button>
      </Box>

      {/* Barra di ricerca e refresh */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Cerca bot..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        <IconButton onClick={fetchBots} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Messaggi di errore */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loader */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Lista dei bot */}
          {paginatedBots.length > 0 ? (
            <Grid container spacing={3}>
              {paginatedBots.map((bot) => (
                <Grid item xs={12} sm={6} md={4} key={bot._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={bot.avatar || 'https://via.placeholder.com/300x140?text=Bot'}
                      alt={bot.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="h2" noWrap>
                          {bot.name}
                        </Typography>
                        <Chip
                          icon={
                            bot.isActive ? <ActiveIcon /> : <InactiveIcon />
                          }
                          label={bot.isActive ? 'Attivo' : 'Inattivo'}
                          color={bot.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 1,
                        }}
                      >
                        {bot.description || 'Nessuna descrizione disponibile'}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          mt: 1,
                        }}
                      >
                        <Chip
                          label={`${bot.servers?.length || 0} server`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`${bot.commands?.length || 0} comandi`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={RouterLink}
                        to={`/dashboard/bots/${bot._id}`}
                        size="small"
                      >
                        Dettagli
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/dashboard/bots/${bot._id}/edit`}
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Modifica
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(bot)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 5,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {searchTerm
                  ? 'Nessun bot corrisponde alla tua ricerca'
                  : 'Non hai ancora creato nessun bot'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? 'Prova a cercare con un altro termine'
                  : 'Crea il tuo primo bot per iniziare'}
              </Typography>
              {!searchTerm && (
                <Button
                  component={RouterLink}
                  to="/dashboard/bots/create"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Crea Nuovo Bot
                </Button>
              )}
            </Box>
          )}

          {/* Paginazione */}
          {filteredBots.length > botsPerPage && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Dialog di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Conferma eliminazione
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare il bot "{botToDelete?.name}"? Questa
            azione non può essere annullata e tutti i dati associati al bot
            saranno persi.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annulla</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BotListPage;