import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, CircularProgress, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from './useAuth';
import { Button } from 'react-bootstrap';
import { GoogleButton } from 'react-google-button';
import './LandingPage.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login');
  const { isLoading, error, setError, signInWithEmail, signInWithGoogle, register, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignInWithEmail = async () => {
    try {
        await signInWithEmail(email, password);
        navigate('/dashboard');
        // Navigate to dashboard or other logic
    } catch (error) {
        // Use setError to set the error message
        setError('Custom error message based on the error type.');
        console.error(error);
    }
};

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      alert('Anweisungen zum Zurücksetzen des Passworts wurden gesendet.');
      setMode('login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" className="landing-container">
      <Box className="image-section">
        <Paper style={{ height: '100%', backgroundSize: 'cover' }} />
      </Box>
      <Box className="login-section">
        <h4 style={{ marginBottom: '20px' }}>{mode === 'login' ? 'Anmelden' : 'Passwort zurücksetzen'}</h4>

        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            value={email}
            onChange={handleEmailChange}
            label="Email"
          />
        </FormControl>

        {mode === 'login' && (
          <>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="password">Passwort</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Passwort"
              />
            </FormControl>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? <CircularProgress /> : (
              <>
                <Button variant="primary" onClick={handleSignInWithEmail}>Mit Email anmelden</Button>
                <Button variant="contained" color="secondary" className="btn btn-google" onClick={handleSignInWithGoogle}><GoogleButton /></Button>
                <Button variant="outline-primary" onClick={() => register(email, password)}>Neues Konto erstellen</Button>
                <Button variant="outline-secondary" onClick={() => setMode('resetPassword')}>Passwort zurücksetzen</Button>
              </>
            )}
          </>
        )}

        {mode === 'resetPassword' && (
          <>
            <Button variant="primary" onClick={handleResetPassword}>Passwort zurücksetzen senden</Button>
            <Button variant="outline-secondary" onClick={() => setMode('login')}>Zurück zum Anmelden</Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LandingPage;
