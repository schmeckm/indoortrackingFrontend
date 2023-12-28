import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MapIcon from "@mui/icons-material/Map";
import RouterIcon from "@mui/icons-material/Router";
import BeaconIcon from "@mui/icons-material/Bluetooth";
import RadarIcon from "@mui/icons-material/Radar";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import FilterListIcon from "@mui/icons-material/FilterList";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import WebhookIcon from '@mui/icons-material/Webhook';
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import defaultUserImage from './unknown.jpg';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Firebase-Konfiguration


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userName, setUserName] = useState('Unbekannter Benutzer');
  const [userPhoto, setUserPhoto] = useState('./unknown.jpg'); // Default-Bild

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Benutzer ist angemeldet
        setUserName(user.displayName || 'Unbekannter Benutzer');
        setUserPhoto(user.photoURL || defaultUserImage);

        // Benutzerdaten aus Firestore abrufen
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Benutzerdaten aus Firestore abrufen
              const userData = docSnap.data();
              const firstName = userData.firstName || '';
              const lastName = userData.lastName || '';
              const fullName = `${firstName} ${lastName}`;
              setUserName(fullName);
              console.log(fullName);
            }
          })
          .catch((error) => {
            console.error("Error getting user data from Firestore:", error);
          });
      } else {
        // Benutzer ist nicht angemeldet
        setUserName('Unbekannter Benutzer');
        setUserPhoto(defaultUserImage);
      }
    });

    return () => unsubscribe();
  }, [])

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-sidebar.collapsed": {
          width: "72px !important",
        },
        "& .pro-sidebar.collapsed .pro-inner-item": {
          justifyContent: "center !important",
        },
        "& .pro-sidebar.collapsed .pro-menu-item": {
          justifyContent: "center !important",
        },
        "& .pro-sidebar.collapsed .pro-icon-wrapper": {
          marginLeft: "0 !important",
          marginRight: "0 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userPhoto}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userName}
                </Typography>
                <Typography
                  variant="h3"
                  color={colors.greenAccent[500]}
                ></Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data Area
            </Typography>
            <Item
              title="Manage Environment"
              to="/environment"
              icon={<MapIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Gateways"
              to="/gateways"
              icon={<RouterIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Manage Beacons"
              to="/beacon"
              icon={<BeaconIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Display filtered Position"
              to="/position"
              icon={<FilterListIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Display Beacon "
              to="/positionALL"
              icon={<RadarIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Display Temperature "
              to="/temperature"
              icon={<DeviceThermostatIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Temperature by location"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Scanner"
              to="/scanner"
              icon={<QrCodeScannerIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Admin Area
            </Typography>
            <Item
              title="Middleware"
              to="/middleware"
              icon={<WebhookIcon  />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="User Profile"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
