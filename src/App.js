import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
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
import Scanner from './scenes/scanner';
import Temperature from './scenes/linedate';
import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
import Geography from './scenes/geography';
import MapPage from './scenes/position/MapPage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

function App() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    return ( <
        ColorModeContext.Provider value = { colorMode } >
        <
        ThemeProvider theme = { theme } >
        <
        CssBaseline / >
        <
        Auth >
        <
        div className = "app" >
        <
        Sidebar isSidebar = { isSidebar }
        /> <
        main className = "content" >
        <
        Topbar setIsSidebar = { setIsSidebar }
        /> <
        Routes >
        <
        Route path = "/"
        element = { < LandingPage / > }
        /> <
        Route path = "/dashboard"
        element = { < Dashboard / > }
        /> <
        Route path = "/team"
        element = { < Team / > }
        /> <
        Route path = "/contacts"
        element = { < Contacts / > }
        /> <
        Route path = "/environment"
        element = { < Environment / > }
        /> <
        Route path = "/environmentDetail/:id"
        element = { < EnvironmentDetail / > }
        /> <
        Route path = "/gateways"
        element = { < Gateways / > }
        /> <
        Route path = "/beacon"
        element = { < Beacons / > }
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
        Route path = "/scanner"
        element = { < Scanner / > }
        /> <
        Route path = "/bar"
        element = { < Bar / > }
        /> <
        Route path = "/form"
        element = { < Form / > }
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
        Route path = "/geography"
        element = { < Geography / > }
        /> <
        Route path = "/map"
        element = { < MapPage / > }
        /> < /
        Routes > <
        /main> < /
        div > <
        /Auth> < /
        ThemeProvider > <
        /ColorModeContext.Provider>
    );
}

export default App;