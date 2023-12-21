import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { auth } from './config/firebase'; // Stellen Sie sicher, dass Sie Ihre Firebase-Konfiguration hier importieren
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Contacts from './scenes/contacts';
import Environment from './scenes/Environment';
import EnvironmentDetail from './scenes/Environment/EnvironmentDetail';
import Gateways from './scenes/gateways';
import Beacons from './scenes/beacons';
import Position from './scenes/position';
import PositionA from './scenes/postionall';
import Temperature from './scenes/linedate';
import Scanner from './scenes/scanner';
import Middleware from './scenes/middleware';
import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
import MapPage from './scenes/position/MapPage';

function App() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Der Benutzer ist angemeldet
                console.log("Auth state changed: true");
                setIsAuthenticated(true);
            } else {
                // Der Benutzer ist nicht angemeldet
                console.log("Auth state changed: false");
                setIsAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return ( <
        ColorModeContext.Provider value = { colorMode } >
        <
        ThemeProvider theme = { theme } >
        <
        CssBaseline / >
        <
        div className = "app" >
        <
        Sidebar isSidebar = { isSidebar }
        /> <
        main className = "content" >
        <
        Topbar setIsSidebar = { setIsSidebar }
        isAuthenticated = { isAuthenticated }
        /> <
        Routes >
        <
        Route path = "/"
        element = { < Dashboard / > }
        /> <
        Route path = "/team"
        element = { < Team / > }
        /> <
        Route path = "/environment"
        element = { < Environment / > }
        /> <
        Route path = "/gateways"
        element = { < Gateways / > }
        /> <
        Route path = "/environmentDetail/:id"
        element = { < EnvironmentDetail / > }
        /> <
        Route path = "/beacon"
        element = { < Beacons / > }
        /> <
        Route path = "/Middleware"
        element = { < Middleware / > }
        /> <
        Route path = "/position"
        element = { < Position / > }
        /> <
        Route path = "/positionall"
        element = { < PositionA / > }
        /> <
        Route path = "/temperature"
        element = { < Temperature / > }
        /> <
        Route path = "/contacts"
        element = { < Contacts / > }
        /> <
        Route path = "/form"
        element = { < Form / > }
        /> <
        Route path = "/bar"
        element = { < Bar / > }
        /> <
        Route path = "/pie"
        element = { < Pie / > }
        /> <
        Route path = "/line"
        element = { < Line / > }
        /> <
        Route path = "/faq"
        element = { < FAQ / > }
        /> <
        Route path = "/scanner"
        element = { < Scanner / > }
        /> <
        Route path = "/map"
        element = { < MapPage / > }
        /> < /
        Routes > <
        /main> < /
        div > <
        /ThemeProvider> < /
        ColorModeContext.Provider >
    );
}

export default App;