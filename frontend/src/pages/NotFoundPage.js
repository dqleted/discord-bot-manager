import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '80vh' }}
      >
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 5,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h1" color="primary" sx={{ fontSize: '8rem', fontWeight: 'bold' }}>
              404
            </Typography>
            <Typography variant="h4" gutterBottom>
              Pagina Non Trovata
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              La pagina che stai cercando non esiste o è stata spostata.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to={isAuthenticated ? '/dashboard' : '/'}
                startIcon={<HomeIcon />}
                size="large"
              >
                {isAuthenticated ? 'Torna alla Dashboard' : 'Torna alla Home'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFoundPage;