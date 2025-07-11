import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente per proteggere le route che richiedono autenticazione
 * Se l'utente non è autenticato, viene reindirizzato alla pagina di login
 */
const PrivateRoute = ({ children }) => {
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

  // Reindirizza alla pagina di login se l'utente non è autenticato
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizza il componente figlio se l'utente è autenticato
  return children;
};

export default PrivateRoute;