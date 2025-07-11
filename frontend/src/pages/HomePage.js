import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  // Caratteristiche del prodotto
  const features = [
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Facile da usare',
      description:
        'Interfaccia intuitiva che ti permette di creare e gestire i tuoi bot Discord in pochi minuti, senza bisogno di conoscenze di programmazione.',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Sicuro e affidabile',
      description:
        'I tuoi bot e i loro token sono protetti con i più alti standard di sicurezza. La nostra piattaforma garantisce un uptime del 99.9%.',
    },
    {
      icon: <InsightsIcon fontSize="large" color="primary" />,
      title: 'Statistiche dettagliate',
      description:
        'Monitora l\'attività dei tuoi bot con statistiche in tempo reale. Analizza l\'utilizzo dei comandi e l\'engagement degli utenti.',
    },
    {
      icon: <CodeIcon fontSize="large" color="primary" />,
      title: 'Personalizzabile',
      description:
        'Crea comandi personalizzati, configura messaggi di benvenuto, imposta ruoli automatici e molto altro ancora, tutto senza scrivere codice.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: '0 0 20px 20px',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="text.primary"
                gutterBottom
                fontWeight="bold"
              >
                Gestisci i tuoi bot Discord con facilità
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Crea, configura e monitora i tuoi bot Discord attraverso un'interfaccia
                web intuitiva. Nessuna conoscenza di programmazione richiesta.
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Vai alla Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      size="large"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Inizia Gratis
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      size="large"
                    >
                      Accedi
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.png"
                alt="Discord Bot Manager"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  display: { xs: 'none', md: 'block' },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          fontWeight="bold"
        >
          Caratteristiche
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Tutto ciò di cui hai bisogno per gestire i tuoi bot Discord in un unico posto
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography align="center">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          borderRadius: '20px 20px 0 0',
          mt: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            Pronto a iniziare?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Crea il tuo primo bot Discord in pochi minuti
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <Button
                component={RouterLink}
                to="/bots/create"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Crea un Bot
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Registrati Gratuitamente
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;