import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [success, setSuccess] = useState(false);

  // Schema di validazione con Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Il nome utente deve contenere almeno 3 caratteri')
      .max(20, 'Il nome utente non può superare i 20 caratteri')
      .required('Il nome utente è obbligatorio'),
    email: Yup.string()
      .email('Inserisci un indirizzo email valido')
      .required('L\'email è obbligatoria'),
    password: Yup.string()
      .min(6, 'La password deve contenere almeno 6 caratteri')
      .nullable(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Le password devono corrispondere'
    ),
    avatar: Yup.string().url('Inserisci un URL valido').nullable(),
  });

  // Configurazione di Formik
  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      avatar: user?.avatar || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSuccess(false);
        // Rimuovi confirmPassword e password vuota prima di inviare i dati
        const { confirmPassword, ...userData } = values;
        if (!userData.password) delete userData.password;

        await updateProfile(userData);
        setSuccess(true);
      } catch (err) {
        // L'errore viene già gestito nel contesto Auth
        setSuccess(false);
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Il tuo profilo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestisci le tue informazioni personali
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Sezione Avatar */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {!user?.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h6">{user?.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>

              {user?.discordId && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Account Discord collegato
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {user.discordId}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Sezione Form */}
          <Grid item xs={12} md={8}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Profilo aggiornato con successo!
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nome utente"
                name="username"
                autoComplete="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Indirizzo Email"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                fullWidth
                id="avatar"
                label="URL Avatar"
                name="avatar"
                placeholder="https://esempio.com/avatar.jpg"
                value={formik.values.avatar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.avatar && Boolean(formik.errors.avatar)}
                helperText={
                  (formik.touched.avatar && formik.errors.avatar) ||
                  'Inserisci l\'URL di un\'immagine per il tuo avatar'
                }
              />

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Cambia Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Lascia vuoto se non vuoi cambiare la password
              </Typography>

              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Nuova Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Conferma Nuova Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Aggiorna Profilo'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;