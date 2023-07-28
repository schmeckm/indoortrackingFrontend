import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { SAPLocation } from "../../data/mockData";
const API_URL = "http://35.193.167.197:3002/api/gateway";


const Gateway = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gatewayData, setGatewayData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSAPLocation, setSelectedSAPLocation] = useState("");
  const [newGatewayData, setNewGatewayData] = useState({
    gatewayMac: "",
    type: "",
    gatewayFree: "",
    gatewayLoad: "",
    gatewayX: "",
    gatewayY: "",
    description: "",
    text1: "",
    text2: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllGateways`);
      setGatewayData(response.data.data.map((row) => ({ ...row, id: row._id })));
      setColumns(generateColumns(response.data.data[0]));
    } catch (error) {
      console.error("Error fetching gateway data:", error);
    }
  };


  const generateColumns = (data) => {
    if (!data) return [];
  
    const defaultFields = ["gatewayMac", "description", "type", "sapLocation","text1", "text2", "latitude", "longitude"] // Specify the field names you want to display by default
    return defaultFields.map((field) => ({
      field,
      headerName: field,
      flex: 1,
    }));
  };

  const [selectedField, setSelectedField] = useState("");
  
  const handleDeleteConfirmation = (gateway) => {
    setSelectedGateway(gateway);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deleteGateway/${selectedGateway.id}`);
      setDeleteConfirmationOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting gateway:", error);
    }
  };

  const handleDetailConfirmation = (gateway) => {
    setSelectedGateway(gateway);
    setDetailDialogOpen(true);
  };

  const handleCancelDetail = () => {
    setSelectedGateway(null);
    setDetailDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setSelectedGateway(null);
    setDeleteConfirmationOpen(false);
  };

  const handleCreateConfirmation = () => {
    setCreateDialogOpen(true);
  };

  const handleCancelCreate = () => {
    setCreateDialogOpen(false);
    setNewGatewayData({
      gatewayMac: "",
      type: "",
      gatewayFree: "",
      gatewayLoad: "",
      gatewayX: "",
      gatewayY: "",
      description: "",
      text1: "",
      text2: "",
      latitude: "",
      longitude: "",
    });
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/addGateway`, newGatewayData);
      setCreateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating gateway:", error);
    }
  };

  const handleUpdateConfirmation = (gateway) => {
    setSelectedGateway(gateway);
    setNewGatewayData({
      gatewayMac: gateway.gatewayMac ,
      gatewayFree: gateway.gatewayFree || "",
      gatewayLoad: gateway.gatewayLoad || "",
      type: gateway.type || "",
      gatewayX: gateway.gatewayX || "",
      gatewayY: gateway.gatewayY || "",
      description: gateway.description || "",
      text1: gateway.text1 || "",
      text2: gateway.text2 || "",
      latitude: gateway.latitude || "",
      longitude: gateway.longitude || "",
      sapLocation: gateway.sapLocation, // Setzen Sie den ursprünglichen Wert von sapLocation
    });
    setUpdateDialogOpen(true);
  };

  const handleCancelUpdate = () => {
    setSelectedGateway(null);
    setUpdateDialogOpen(false);
  };

  const handleUpdate = async () => {
    try {
    
      const { id } = selectedGateway;
      await axios.put(`${API_URL}/updateGateway/${id}`, newGatewayData,

        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(newGatewayData);
      setUpdateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating gateway:', error);
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGatewayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  //Verify data Entries 

  const validateGatewayMac = (value) => {
    // Example: Gateway Mac should be 12 characters long
    return value.length === 12;
  };

  const validateGatewayType = (value) => {
    // Example: Gateway Mac should be 12 characters long
    return value.length === 11;
  };

  const validateDecription = (value) => {
    // Example: Gateway Mac should be 12 characters long
    return value.length === 12;
  };


  return (
    <Box m="20px">
      <Header title="GATEWAYS" subtitle="Managing the used Gateways in this scenario" />
      <Button variant="contained" color="success" onClick={handleCreateConfirmation}>
        Create Gateway
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
          checkboxSelection
          rows={gatewayData}
          columns={[
            ...columns,
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              width: 200, // specify the width
              renderCell: ({ row }) => (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteConfirmation(row)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleUpdateConfirmation(row)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleDetailConfirmation(row)}
                  >
                    Detail
                  </Button>
                </>
              ),
            },
          ]}
          getRowId={(row) => row.id}
        />
      </Box>

      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected gateway?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleCancelCreate}>
        <DialogTitle>Create Gateway</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="gatewayMac"
            label="Gateway Mac"
            type="text"
            fullWidth
            value={newGatewayData.gatewayMac}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateGatewayMac(newGatewayData.gatewayMac)}
            helperText={
              !validateGatewayMac(newGatewayData.gatewayMac)
                ? "Gateway Mac should be 12 characters long."
                : ""
            }
          />
          <TextField
            autoFocus
            margin="dense"
            name="type"
            label="Gateway Typ"
            type="text"
            fullWidth
            value={newGatewayData.type}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateGatewayType(newGatewayData.type)}
            helperText={
              !validateGatewayType(newGatewayData.type)
                ? "Gateway Free should be 10 characters long."
                : ""
            }
          />
          <TextField
            margin="dense"
            name="gatewayFree"
            label="Gateway Free"
            type="text"
            fullWidth
            value={newGatewayData.free}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayLoad"
            label="Gateway Load"
            type="text"
            fullWidth
            value={newGatewayData.gatewayLoad}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayX"
            label="Gateway X"
            type="text"
            fullWidth
            value={newGatewayData.gatewayX}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayY"
            label="Gateway Y"
            type="text"
            fullWidth
            value={newGatewayData.gatewayY}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newGatewayData.description}
            onChange={handleInputChange}
                 inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateDecription(newGatewayData.description)}
            helperText={
              !validateDecription(newGatewayData.description)
                ? "Gateway Description should be 10 characters long."
                : ""
            }         
          />
          <TextField
            margin="dense"
            name="text1"
            label="Text 1"
            type="text"
            fullWidth
            value={newGatewayData.text1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="text2"
            label="Text 2"
            type="text"
            fullWidth
            value={newGatewayData.text2}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="latitude"
            label="Latitude"
            type="text"
            fullWidth
            value={newGatewayData.latitude}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="longitude"
            label="Longitude"
            type="text"
            fullWidth
            value={newGatewayData.longitude}
            onChange={handleInputChange}
          />
    <FormControl fullWidth>
      <InputLabel htmlFor="sapLocation">SAP Location</InputLabel>
      <Select
        margin="dense"
        name="SapLocation"
        value={newGatewayData.sapLocation}
        onChange={handleInputChange}
        inputProps={{
          id: "sapLocation",
        }}
      >
        {SAPLocation.map((location) => (
          <MenuItem key={location.id} value={location.name}>
            {location.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleCancelUpdate}>
        <DialogTitle>Update Gateway</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="gatewayMac"
            label="Gateway Mac"
            type="text"
            fullWidth
            value={newGatewayData.gatewayMac}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="type"
            label="Gateway Typ"
            type="text"
            fullWidth
            value={newGatewayData.type}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayFree"
            label="Gateway Free"
            type="text"
            fullWidth
            value={newGatewayData.gatewayFree}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayLoad"
            label="Gateway Load"
            type="text"
            fullWidth
            value={newGatewayData.gatewayLoad}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayX"
            label="Gateway X"
            type="text"
            fullWidth
            value={newGatewayData.gatewayX}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="gatewayY"
            label="Gateway Y"
            type="text"
            fullWidth
            value={newGatewayData.gatewayY}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newGatewayData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="text1"
            label="Text 1"
            type="text"
            fullWidth
            value={newGatewayData.text1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="text2"
            label="Text 2"
            type="text"
            fullWidth
            value={newGatewayData.text2}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="latitude"
            label="Latitude"
            type="text"
            fullWidth
            value={newGatewayData.latitude}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="longitude"
            label="Longitude"
            type="text"
            fullWidth
            value={newGatewayData.longitude}
            onChange={handleInputChange}
          />
           <FormControl fullWidth>
      <InputLabel htmlFor="sapLocation">SAP Location</InputLabel>
      <Select
        margin="dense"
        name="sapLocation"
        value={newGatewayData.sapLocation}
        onChange={handleInputChange}
        inputProps={{
          id: "sapLocation",
        }}
      >
        {SAPLocation.map((location) => (
          <MenuItem key={location.id} value={location.name}>
            {location.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
              
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate}color="error">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="warning">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailDialogOpen} onClose={handleCancelDetail}>
  <DialogTitle>Gateway Detail</DialogTitle>
  <DialogContent>
    <Box>
      <strong>Gateway Mac:</strong> {selectedGateway && selectedGateway.gatewayMac}
    </Box>
    <Box>
      <strong>Type:</strong> {selectedGateway && selectedGateway.type}
    </Box>
    {/* Add more fields as needed */}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDetail}>Close</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Gateway;
