import React, { useContext, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ColorModeContext, tokens } from '../../theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importiere das Logout-Icon
import { auth } from '../../config/firebase'; // Importiere Firebase-Auth
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigate = useNavigate(); // Verwende useNavigate, um auf die navigate-Funktion zuzugreifen

    // Funktion zum Ausloggen
    const handleLogout = async () => {
        try {
            await auth.signOut(); // Firebase-Logout aufrufen
            setLogoutMessage('Logout erfolgreich.'); // Erfolgsmeldung setzen
            setTimeout(() => {
                setLogoutMessage(''); // Erfolgsmeldung nach einigen Sekunden löschen
                navigate('/signin'); // Auf die Google-Login-Seite umleiten
            }, 2000); // Nach 2 Sekunden umleiten
        } catch (error) {
            console.error('Fehler beim Ausloggen:', error);
        }
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <PersonOutlinedIcon />
                </IconButton>
                <IconButton onClick={handleLogout}>
                    <ExitToAppIcon /> {/* Logout-Icon */}
                </IconButton>
                {logoutMessage && <p>{logoutMessage}</p>} {/* Erfolgsmeldung anzeigen */}
            </Box>
        </Box>
    );
};

export default Topbar;

