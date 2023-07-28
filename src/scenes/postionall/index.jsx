import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const API_URL = "http://35.193.167.197:3001";

const PositionALL = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [positionData, setPositionData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/context`);
      const devicesData = response.data.devices;
      const formattedData = Object.keys(devicesData).map((deviceId) => {
        const device = devicesData[deviceId];
  
        const nearestDevice = device.nearest?.[0];
        const rssi = nearestDevice?.rssi || "";
        const temperature = device.dynamb?.temperature || "";
        const batteryPercentage = device.dynamb?.batteryPercentage || "";
        const statidName = device.statid?.name || ""; // Added statid.name field
  
        const formattedDevice = deviceId.split("/")[0]; // Remove value after slash
        const formattedNearestDevice = (nearestDevice?.device || "").split("/")[0]; // Remove value after slash
  
        // Format the timestamp field if it is filled
        const formattedTimestamp = device.dynamb?.timestamp ? formatTimestamp(device.dynamb.timestamp) : "";
  
        return {
          id: deviceId,
          device: formattedDevice,
          nearestDevice: formattedNearestDevice,
          rssi,
          uri: device.statid?.uri || "",
          timestamp: formattedTimestamp,
          temperature,
          batteryPercentage,
          statidName, // Added statid.name field
        };
      });
  
      setPositionData(formattedData);
      setColumns(generateColumns());
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };
  
  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the format according to your needs
  };

  
  const generateColumns = () => {
    return [
      {
        field: "device",
        headerName: "Device",
        flex: 1,
      },
      {
        field: "nearestDevice",
        headerName: "Nearest Gateway",
        flex: 1,
      },
      {
        field: "rssi",
        headerName: "RSSI",
        flex: 1,
      },
      {
        field: "uri",
        headerName: "URI",
        flex: 1,
        renderCell: (params) => {
          const uri = params.value;
          return uri ? (
            <Link to={uri} target="_blank" rel="noopener noreferrer">
              {uri}
            </Link>
          ) : null;
        },
      },
      {
        field: "timestamp",
        headerName: "Timestamp",
        flex: 1,
      },
      {
        field: "temperature",
        headerName: "Temperature",
        valueFormatter: ({ value }) => (value ? `${value} °C` : ""),
        flex: 1,
      },
      {
        field: "batteryPercentage",
        headerName: "Battery Percentage",
        valueFormatter: ({ value }) => (value ? `${value}%` : ""),
        flex:1,
      },
      {
        field: "statidName", // Added statid.name field
        headerName: "Stat ID Name", // Column header label
        flex: 1,
      },
    ];
  };
  
  return (
    <Box m="20px">
      <Header
        title="Beacons"
        subtitle="Managing the used Beacons in this scenario"
      />
      <Button variant="contained" color="success" onClick={fetchData}>
        Refresh Position
      </Button>
      <Box
        m="40px 0 0 0"
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={positionData}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default PositionALL;
