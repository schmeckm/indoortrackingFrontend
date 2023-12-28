import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth(); // Nutzen des Hooks, um den Benutzerstatus zu erhalten

    const isAuthenticated = user != null; // Überprüfen, ob ein Benutzer angemeldet ist

    return isAuthenticated ? children : < Navigate to = "/login" / > ;
};

export default ProtectedRoute;