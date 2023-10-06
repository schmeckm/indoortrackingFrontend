import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import MapPage from "./MapPage";
const API_URL = "http://34.27.176.104:3002/api";
const Position = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [positionData, setPositionData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/position/getPosition`);
      const beaconData = response.data.data.beacons;

      const formattedData = beaconData.map((beacon, index) => {
        const beaconKey = Object.keys(beacon)[0]; // Get the key (beaconMac) from the object
        const {
          nearestGatewayData,
          dynamb,
          statid,
          location: {
            GatewayDescription,
            Gatewaytext1,
            Gatewaytext2,
            latitude,
            longitude,
            sapLocation,
          },
        } = beacon[beaconKey];

        const {
          timestamp,
          batteryPercentage,
          temperature,
          uptime,
          batteryVoltage,
          txCount,
          accelerationx,
          accelerationy,
          accelerationz,
        } = dynamb || {};

        const { URI, uuids, name, deviceID } = statid || {};
        const { device } = nearestGatewayData || {};

        return {
          id: index,
          beaconMac: beaconKey,
          Gateway: GatewayDescription || Gatewaytext1 || Gatewaytext2 || "N/A",
          device,
          timestamp: formatTimestamp(timestamp),
          batteryPercentage,
          temperature,
          uptime: formatUptime(uptime),
          batteryVoltage,
          txCount,
          accelerationx,
          accelerationy,
          accelerationz,
          latitude,
          longitude,
          sapLocation,
          URI,
          uuids: uuids ? uuids.join(", ") : "N/A",
          name,
          deviceID: deviceID ? deviceID.join(", ") : "N/A",
        };
      }).filter(Boolean);

      setPositionData(formattedData);
      setColumns(generateColumns(formattedData[0]));
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatUptime = (uptime) => {
    if (uptime) {
      const seconds = Math.floor((uptime / 1000) % 60);
      const minutes = Math.floor((uptime / (1000 * 60)) % 60);
      const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "";
    }
  };

  const generateColumns = (data) => {
    if (!data) return [];

    const defaultFields = [
      "beaconMac",
      {
        field: "sapLocation",
        headerName: "SAP Location",
        flex: 2,
      },
      "Gateway",
      "device",
      {
        field: "latitude",
        headerName: "Latitude",
        flex: 1,
      },
      {
        field: "longitude",
        headerName: "Longitude",
        flex: 1,
      },
      "timestamp",
      {
        field: "batteryPercentage",
        headerName: "Battery Percentage",
        flex: 1,
        valueFormatter: ({ value }) => (value ? `${value}%` : ""),
      },
      {
        field: "temperature",
        headerName: "Temperature",
        valueFormatter: ({ value }) => (value ? `${value} °C` : ""),
        flex: 1,
      },
      "uptime",
      {
        field: "batteryVoltage",
        headerName: "Battery Voltage",
        flex: 1,
        valueFormatter: ({ value }) => (value ? `${value} V` : ""),
      },
      {
        field: "txCount",
        headerName: "TX Count",
        flex: 1,
      },
      {
        field: "accelerationx",
        headerName: "Acceleration X",
        flex: 1,
        valueFormatter: ({ value }) => (value ? `${value}` : ""),
      },
      {
        field: "accelerationy",
        headerName: "Acceleration Y",
        flex: 1,
        valueFormatter: ({ value }) => (value ? `${value}` : ""),
      },
      {
        field: "accelerationz",
        headerName: "Acceleration Z",
        flex: 1,
        valueFormatter: ({ value }) => (value ? `${value}` : ""),
      },
      {
        field: "URI",
        headerName: "URI",
        flex: 1,
        renderCell: (params) => formatURI(params.value),
      },
    ];

    return defaultFields.map((field) => {
      if (typeof field === "string") {
        return {
          field,
          headerName: field,
          flex: 1,
        };
      } else {
        return field;
      }
    });
  };

  const formatURI = (uri) => {
    if (uri) {
      return (
        <Link to={uri} target="_blank" rel="noopener noreferrer">
          {uri}
        </Link>
      );
    } else {
      return "";
    }
  };

  const handleRowClick = (params) => {
    const { latitude, longitude } = params.row;
    window.open(`/map?lat=${latitude}&lon=${longitude}`, "_blank");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Beacons"
        subtitle="Managing the used Beacons in this scenario"
      />
      <Button variant="contained" color="success" onClick={fetchData}>
        Refresh Position
      </Button>
      {positionData.length > 0 && (
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
            // ...
          }}
        >
          <DataGrid
            autoHeight
            rows={positionData}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick} // Added: onClick handler for row click
          />
        </Box>
      )}
      {selectedPosition && <MapPage location={selectedPosition} />}
    </Box>
  );
};

export default Position;
