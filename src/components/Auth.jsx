import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase'; // Importieren Sie Ihre Firebase-Konfiguration
import LandingPage from './LandingPage';
import CircularProgress from '@mui/material/CircularProgress';

const Auth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        console.log('Aktueller Benutzer:', user); // Protokollieren des eingeloggten Benutzers
      } else {
        console.log('Kein Benutzer eingeloggt');
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return currentUser ? children : <LandingPage />;
};

export default Auth;
