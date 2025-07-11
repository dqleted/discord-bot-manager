import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const BotCreatePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      autoStart: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          '/api/bots',
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate(`/dashboard/bots/${response.data._id}`);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Si è verificato un errore durante la creazione del bot.'
        );
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard/bots')}
              sx={{ mr: 2 }}
            >
              Indietro
            </Button>
            <Typography variant="h4" component="h1">
              Crea Nuovo Bot
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Configura le impostazioni di base per il tuo nuovo bot Discord
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
                      checked={formik.values.autoStart}
                      onChange={formik.handleChange}
                      name="autoStart"
                    />
                  }
                  label="Avvia automaticamente il bot dopo la creazione"
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
                  Nota Importante:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dopo la creazione del bot, riceverai un token che potrai
                  utilizzare per connettere il tuo bot a Discord. Assicurati di
                  mantenere questo token privato e sicuro.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard/bots')}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Creazione in corso...' : 'Crea Bot'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BotCreatePage;