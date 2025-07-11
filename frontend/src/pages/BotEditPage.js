import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Save as SaveIcon,
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const BotEditPage = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Schema di validazione con Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Il nome deve contenere almeno 3 caratteri')
      .max(32, 'Il nome non può superare i 32 caratteri')
      .required('Il nome è obbligatorio'),
    description: Yup.string().max(
      100,
      'La descrizione non può superare i 100 caratteri'
    ),
    prefix: Yup.string()
      .min(1, 'Il prefisso deve contenere almeno 1 carattere')
      .max(5, 'Il prefisso non può superare i 5 caratteri')
      .required('Il prefisso è obbligatorio'),
    avatar: Yup.string().url('Inserisci un URL valido').nullable(),
  });

  // Configurazione di Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      prefix: '!',
      avatar: '',
      isActive: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSaving(true);
      setError(null);
      setSuccess(false);
      try {
        await axios.put(
          `/api/bots/${botId}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Si è verificato un errore durante l\'aggiornamento del bot.'
        );
      } finally {
        setSaving(false);
      }
    },
  });

  // Carica i dati del bot
  useEffect(() => {
    const fetchBotDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/bots/${botId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bot = response.data;
        
        // Imposta i valori iniziali del form
        formik.setValues({
          name: bot.name || '',
          description: bot.description || '',
          prefix: bot.prefix || '!',
          avatar: bot.avatar || '',
          isActive: bot.isActive || false,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Si è verificato un errore durante il caricamento dei dettagli del bot.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBotDetails();
  }, [botId, token]);

  // Gestione eliminazione bot
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteDialogOpen(false);
      navigate('/dashboard/bots');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Si è verificato un errore durante l\'eliminazione del bot.'
      );
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/dashboard/bots/${botId}`)}
              sx={{ mr: 2 }}
            >
              Indietro
            </Button>
            <Typography variant="h4" component="h1">
              Modifica Bot
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Aggiorna le impostazioni del tuo bot Discord
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Bot aggiornato con successo!
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informazioni di Base
              </Typography>

              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nome del Bot"
                margin="normal"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  (formik.touched.name && formik.errors.name) ||
                  'Il nome che verrà visualizzato per il tuo bot'
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Il nome deve avere tra 3 e 32 caratteri">
                        <IconButton edge="end" size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="description"
                name="description"
                label="Descrizione"
                margin="normal"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  (formik.touched.description && formik.errors.description) ||
                  'Una breve descrizione del tuo bot e delle sue funzionalità'
                }
              />

              <TextField
                fullWidth
                id="prefix"
                name="prefix"
                label="Prefisso Comandi"
                margin="normal"
                value={formik.values.prefix}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.prefix && Boolean(formik.errors.prefix)}
                helperText={
                  (formik.touched.prefix && formik.errors.prefix) ||
                  'Il carattere o simbolo che precede i comandi (es. !, /, $)'
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Il prefisso è il simbolo che gli utenti useranno prima dei comandi, ad esempio !help">
                        <IconButton edge="end" size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Aspetto e Comportamento
              </Typography>

              <TextField
                fullWidth
                id="avatar"
                name="avatar"
                label="URL Avatar"
                margin="normal"
                placeholder="https://esempio.com/avatar.png"
                value={formik.values.avatar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.avatar && Boolean(formik.errors.avatar)}
                helperText={
                  (formik.touched.avatar && formik.errors.avatar) ||
                  'URL dell\'immagine che verrà usata come avatar del bot (opzionale)'
                }
              />

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                      name="isActive"
                    />
                  }
                  label={formik.values.isActive ? "Bot attivo" : "Bot inattivo"}
                />
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Gestione Token:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per motivi di sicurezza, non è possibile visualizzare il token completo del bot in questa pagina. 
                  Puoi visualizzare e copiare il token dalla pagina dei dettagli del bot.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Elimina Bot
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/dashboard/bots/${botId}`)}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Salvataggio...' : 'Salva Modifiche'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

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
            Sei sicuro di voler eliminare questo bot? Questa azione non può
            essere annullata e tutti i dati associati al bot saranno persi.
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

export default BotEditPage;