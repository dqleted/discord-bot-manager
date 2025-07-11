import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se l'utente è già autenticato all'avvio dell'app
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        // Configura l'header di autorizzazione
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Ottieni il profilo dell'utente
        const { data } = await axios.get('/api/auth/profile');
        setUser(data);
      } catch (error) {
        console.error('Errore durante il controllo dell\'autenticazione:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Registrazione utente
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/register', userData);

      // Salva il token nel localStorage
      localStorage.setItem('token', data.token);

      // Configura l'header di autorizzazione
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Imposta l'utente
      setUser(data);

      toast.success('Registrazione completata con successo!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Errore durante la registrazione';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login utente
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/login', credentials);

      // Salva il token nel localStorage
      localStorage.setItem('token', data.token);

      // Configura l'header di autorizzazione
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Imposta l'utente
      setUser(data);

      toast.success('Login effettuato con successo!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Credenziali non valide';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout utente
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logout effettuato con successo');
  };

  // Aggiornamento profilo utente
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put('/api/auth/profile', userData);

      // Aggiorna il token se è stato restituito
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      // Aggiorna l'utente
      setUser(data);

      toast.success('Profilo aggiornato con successo!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valore del contesto
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};