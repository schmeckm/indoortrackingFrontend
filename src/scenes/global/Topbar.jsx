import React, { useContext, useState } from 'react';
import { Box, IconButton, useTheme, Snackbar, Alert} from '@mui/material';
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
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    // Funktion zum Ausloggen
    const handleLogout = async () => {
        try {
            await auth.signOut();
            setSnackbarMessage('Logout erfolgreich.');
            setSnackbarSeverity('success');
            navigate('/login'); // Passen Sie diesen Pfad an Ihre Login-Route an
        } catch (error) {
            console.error('Fehler beim Ausloggen:', error);
            setSnackbarMessage('Fehler beim Ausloggen.');
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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
                <IconButton onClick={() => navigate('/form')}>
    <PersonOutlinedIcon />
</IconButton>

                <IconButton onClick={handleLogout}>
                    <ExitToAppIcon /> {/* Logout-Icon */}
                </IconButton>
                {logoutMessage && <p>{logoutMessage}</p>} {/* Erfolgsmeldung anzeigen */}
                <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            </Box>
        </Box>
    );
};

export default Topbar;

