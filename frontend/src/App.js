import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contesto e tema
import { useThemeContext } from './context/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Pagine pubbliche
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Pagine private
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BotListPage from './pages/BotListPage';
import BotDetailPage from './pages/BotDetailPage';
import BotCreatePage from './pages/BotCreatePage';
import BotEditPage from './pages/BotEditPage';

// Componenti di protezione delle route
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Route pubbliche */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Route private */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="bots"
            element={
              <PrivateRoute>
                <BotListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="bots/create"
            element={
              <PrivateRoute>
                <BotCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="bots/:id"
            element={
              <PrivateRoute>
                <BotDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="bots/:id/edit"
            element={
              <PrivateRoute>
                <BotEditPage />
              </PrivateRoute>
            }
          />

          {/* Pagina 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;