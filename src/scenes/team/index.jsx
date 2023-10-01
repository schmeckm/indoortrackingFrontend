import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from 'axios';
//import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
//import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
//import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gatewayData, setGatewayData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.128:3002/api/gateway/getAllGateways');
        setGatewayData(response.data.data.map((row, index) => ({ ...row, id: index })));
        setColumns(generateColumns(response.data.data[0]));
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching gateway data:', error);
      }
    };

    fetchData();
  }, []);

  const generateColumns = (data) => {
    if (!data) return [];

    return Object.keys(data).map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
    }));
  };

  return (
    <Box m="20px">
      <Header title="GATEWAYS" subtitle="Managing the used Gateways in this sceneario" />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
        <DataGrid checkboxSelection rows={gatewayData} columns={columns} getRowId={(row) => row.id} />
      </Box>
    </Box>
  );
};

export default Team;