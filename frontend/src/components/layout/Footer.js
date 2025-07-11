import React from 'react';
import { Box, Typography, Link, Container, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Typography variant="h6" color="text.primary" gutterBottom>
              Discord Bot Manager
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align={{ xs: 'center', sm: 'left' }}
            >
              © {currentYear} Discord Bot Manager. Tutti i diritti riservati.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Link component={RouterLink} to="/" color="inherit" underline="hover">
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              underline="hover"
            >
              Chi siamo
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="inherit"
              underline="hover"
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              underline="hover"
            >
              Termini
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="inherit"
              underline="hover"
            >
              Contatti
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;