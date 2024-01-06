import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Header from "../../components/Header";
import MqttComponent from "../../components/MqttComponent";
import StatBox from "../../components/StatBox";
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [beaconCount, setBeaconCount] = useState(0);
  const [mqttDataSentCount, setMqttDataSentCount] = useState(0);
  const initialMqttDataSentCount = 0;

  useEffect(() => {
    axios.get('http://192.168.1.128:3002/api/beacon/getAllBeacons')
      .then(response => {
        if (response.data.success && Array.isArray(response.data.data)) {
          setBeaconCount(response.data.data.length);
        }
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Beacon-Daten', error);
      });
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Status Overview" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="200px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Link to="/beacon">
            <StatBox
              title="Number of Beacons"
              subtitle={beaconCount}
              icon={
                <SettingsRemoteIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}/>
              }
            />
          </Link>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= "MQTT Data Received"
            subtitle={`${mqttDataSentCount}`}
            //increase={`+${mqttDataSentCount - initialMqttDataSentCount}%`}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            height="00px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "16px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="50px" m="-20px 0 0 0">
            <MqttComponent setMqttDataSentCount={setMqttDataSentCount} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
