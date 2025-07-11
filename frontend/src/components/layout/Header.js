import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  Dashboard,
  ExitToApp,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Stato per il menu utente
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Gestisce l'apertura del menu utente
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Gestisce la chiusura del menu utente
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Gestisce il logout
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Discord Bot Manager
        </Typography>

        {/* Pulsante per cambiare tema */}
        <Tooltip title={`Passa al tema ${mode === 'light' ? 'scuro' : 'chiaro'}`}>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        {isAuthenticated ? (
          <Box>
            <Tooltip title="Impostazioni account">
              <IconButton
                onClick={handleMenu}
                color="inherit"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleClose}
              >
                <Dashboard sx={{ mr: 1 }} /> Dashboard
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleClose}
              >
                <Settings sx={{ mr: 1 }} /> Profilo
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            {!isMobile && (
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ mr: 1 }}
              >
                Home
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              color="inherit"
              variant="outlined"
            >
              Registrati
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;