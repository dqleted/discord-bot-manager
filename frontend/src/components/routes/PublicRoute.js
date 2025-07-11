import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente per le route pubbliche
 * Se l'utente è già autenticato, viene reindirizzato alla dashboard
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra un loader durante il controllo dell'autenticazione
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Reindirizza alla dashboard se l'utente è già autenticato
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Renderizza il componente figlio se l'utente non è autenticato
  return children;
};

export default PublicRoute;