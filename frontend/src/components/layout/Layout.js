import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Gestisce l'apertura/chiusura della sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} />

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Mostra la sidebar solo se l'utente è autenticato */}
        {isAuthenticated && (
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        {/* Contenuto principale */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(isAuthenticated && {
              marginLeft: isMobile ? 0 : sidebarOpen ? '240px' : 0,
            }),
          }}
        >
          {/* Spazio per evitare che il contenuto finisca sotto l'header */}
          <Box sx={{ height: '64px' }} />

          {/* Contenuto della pagina corrente */}
          <Outlet />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;