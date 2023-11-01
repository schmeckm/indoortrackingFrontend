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
//import FormControl from "@mui/material/FormControl";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
const API_URL = "http://104.197.254.149:3002/api/beacon";

const Beacon = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [beaconData, setBeaconData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedBeacon, setSelectedBeacon] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [newBeaconData, setNewBeaconData] = useState({
    beaconMac: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllBeacons`);
      setBeaconData(response.data.data.map((row) => ({ ...row, id: row._id })));
      setColumns(generateColumns(response.data.data[0]));
    } catch (error) {
      console.error("Error fetching beacon data:", error);
    }
  };

  const generateColumns = (data) => {
    if (!data) return [];

    const defaultFields = ["beaconMac", "description"];
    return defaultFields.map((field) => ({
      field,
      headerName: field,
      flex: 1,
    }));
  };

  const handleDeleteConfirmation = (beacon) => {
    setSelectedBeacon(beacon);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deleteBeacon/${selectedBeacon?.id}`);
      setDeleteConfirmationOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting beacon:", error);
    }
  };

  const handleDetailConfirmation = (beacon) => {
    setSelectedBeacon(beacon);
    setDetailDialogOpen(true);
  };

  const handleCancelDetail = () => {
    setSelectedBeacon(null);
    setDetailDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setSelectedBeacon(null);
    setDeleteConfirmationOpen(false);
  };

  const handleCreateConfirmation = () => {
    setCreateDialogOpen(true);
  };

  const handleCancelCreate = () => {
    setCreateDialogOpen(false);
    setNewBeaconData({
      beaconMac: "",
      description: "",
    });
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/addBeacon`, newBeaconData);
      setCreateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating beacon:", error);
    }
  };

  const handleUpdateConfirmation = (beacon) => {
    setSelectedBeacon(beacon);
    setNewBeaconData({
      beaconMac: beacon.beaconMac,
      description: beacon.description || "",
    });
    setUpdateDialogOpen(true);
  };

  const handleCancelUpdate = () => {
    setSelectedBeacon(null);
    setUpdateDialogOpen(false);
    setNewBeaconData({
      beaconMac: "",
      description: "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/updateBeacon/${selectedBeacon?.id}`,
        newBeaconData,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(newBeaconData);
      setUpdateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating gateway:", error);
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBeaconData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Verify data Entries

  const validateBeaconMac = (value) => {
    // Example: Gateway Mac should be 12 characters long
    return value.length === 12;
  };

  const validateDecription = (value) => {
    // Example: Gateway Mac should be 12 characters long
    return value.length === 12;
  };

  return (
    <Box m="20px">
      <Header
        title="Beacons"
        subtitle="Managing the used Beacons in this scenario"
      />
      <Button
        variant="contained"
        color="success"
        onClick={handleCreateConfirmation}
      >
        Create Beacon
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
          rows={beaconData}
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
        <DialogTitle>Delete Beacon</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this beacon?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createDialogOpen} onClose={handleCancelCreate}>
        <DialogTitle>Create Beacon</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="beaconMac"
            label="Beacon Mac"
            type="text"
            fullWidth
            value={newBeaconData.beaconMac}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateBeaconMac(newBeaconData.beaconMac)}
            helperText={
              !validateBeaconMac(newBeaconData.beaconMac)
                ? "Beacon Mac should be 12 characters long."
                : ""
            }
          />
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newBeaconData.description}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateDecription(newBeaconData.description)}
            helperText={
              !validateDecription(newBeaconData.description)
                ? "Gateway Description should be 10 characters long."
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate}>Cancel</Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateDialogOpen} onClose={handleCancelUpdate}>
        <DialogTitle>Update Beacon</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Beacon Mac"
            type="text"
            fullWidth
            name="beaconMac"
            value={newBeaconData.beaconMac}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateBeaconMac(newBeaconData.beaconMac)}
            helperText={
              !validateBeaconMac(newBeaconData.beaconMac)
                ? "Beacon Mac should be 12 characters long."
                : ""
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={newBeaconData.description}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateBeaconMac(newBeaconData.beaconMac)}
            helperText={
              !validateBeaconMac(newBeaconData.beaconMac)
                ? "Beacon Mac should be 12 characters long."
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="error">
            Cancel{" "}
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="warning">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailDialogOpen} onClose={handleCancelDetail}>
        <DialogTitle>Beacon Details</DialogTitle>
        <DialogContent>
        <Box>
      <strong>Beacon Mac:</strong> {selectedBeacon && selectedBeacon.beaconMac}
    </Box>
    <Box>
      <strong>Beschreibung:</strong> {selectedBeacon && selectedBeacon.description}
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
export default Beacon;