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
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const API_URL = "http://34.27.176.104:3002/api/environment";

const Environment = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [EnvironmentData, setEnvironmentData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // New state variable
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null); // add this line to your existing states

  const [NewEnvironmentData, setNewEnvironmentData] = useState({
    name: "",
    description: "",
    text1: "",
    text2: "",
    width: "",
    height: "",
  });

  useEffect(() => {
    fetchData();
    if (selectedRowId) {
      navigate(`/environmentDetail/${selectedRowId}`);
    }
  }, [selectedRowId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllEnvironments`);
      setEnvironmentData(
        response.data.data.map((row) => ({ ...row, id: row._id }))
      );
      setColumns(generateColumns(response.data.data[0]));
    } catch (error) {
      console.error("Error fetching Environment data:", error);
    }
  };
  const handleCellClick = (params, event) => {
    const isButtonClick = event.target.tagName === "BUTTON"; // Check if a button was clicked
    if (!isButtonClick) {
      navigate(`/environmentDetail/${params.id}`);
    }
  };

  // Define the function to close the new dialog
  const handleNewDialogClose = () => {
    setNewDialogOpen(false);
  };

  const generateColumns = (data) => {
    if (!data) return [];

    const defaultFields = [
      "name",
      "description",
      "text1",
      "text2",
      "width",
      "height",
    ];
    return defaultFields.map((field) => ({
      field,
      headerName: field.charAt(0).toUpperCase() + field.slice(1), // convert field name to title case
      flex: 1,
    }));
  };

  const handleDeleteConfirmation = (Environment, event) => {
    event && event.stopPropagation(); // Stop the click event propagation if the event object exists
    setSelectedEnvironment(Environment);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/deleteEnvironment/${selectedEnvironment.id}`
      );
      setDeleteConfirmationOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting Environment:", error);
    }
  };

  const handleDetailConfirmation = (Environment, event) => {
    event && event.stopPropagation(); // Stop the click event propagation if the event object exists
    setSelectedEnvironment(Environment);
    setDetailDialogOpen(true);
  };

  const handleCancelDetail = () => {
    setSelectedEnvironment(null);
    setDetailDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setSelectedEnvironment(null);
    setDeleteConfirmationOpen(false);
  };

  const handleCreateConfirmation = () => {
    setCreateDialogOpen(true);
  };

  const handleCancelCreate = () => {
    setCreateDialogOpen(false);
    setNewEnvironmentData({
      name: "",
      description: "",
      text1: "",
      text2: "",
      width: "",
      height: "",
    });
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/addEnvironment`, NewEnvironmentData);
      setCreateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating Environment:", error);
    }
  };
  const handleUpdateConfirmation = (Environment, event) => {
    event && event.stopPropagation(); // Stop the click event propagation if the event object exists
    setSelectedEnvironment(Environment);
    setNewEnvironmentData({
      name: Environment.name,
      description: Environment.description || "",
      text1: Environment.text1 || "",
      text2: Environment.text2 || "",
      width: Environment.width || "",
      height: Environment.height || "",
    });
    setUpdateDialogOpen(true);
  };

  const handleCancelUpdate = () => {
    setSelectedEnvironment(null);
    setUpdateDialogOpen(false);
  };

  const handleUpdate = async () => {
    try {
      const { id } = selectedEnvironment;
      await axios
        .put(`${API_URL}/updateEnvironment/${id}`, NewEnvironmentData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          fetchData();
        });
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating Environment:", error);
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEnvironmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Verify data Entries

  const validateEnvironmentText = (value = "") => {
    // Example: Environment Text should be 12 characters long
    return value.length === 12;
  };

  return (
    <Box m="20px">
      <Header
        title="Environment"
        subtitle="Managing the used Environment in this scenario"
      />
      <Button
        variant="contained"
        color="success"
        onClick={handleCreateConfirmation}
      >
        Create Environment
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
          container
          onCellClick={handleCellClick}
          checkboxSelection
          rows={EnvironmentData}
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
          Are you sure you want to delete the selected Environment?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={newDialogOpen}
        onClose={handleNewDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add New Environment"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleNewDialogClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleNewDialogClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleCancelCreate}>
        <DialogTitle>Create Environment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Environment Name"
            type="text"
            fullWidth
            value={NewEnvironmentData.name}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateEnvironmentText(NewEnvironmentData.name)}
            helperText={
              !validateEnvironmentText(NewEnvironmentData.name)
                ? "Environment Name should be 12 characters long."
                : ""
            }
          />
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Environment Description"
            type="text"
            fullWidth
            value={NewEnvironmentData.description}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateEnvironmentText(NewEnvironmentData.description)}
            helperText={
              !validateEnvironmentText(NewEnvironmentData.description)
                ? "Environment Name should be 12 characters long."
                : ""
            }
          />
          <TextField
            margin="dense"
            name="text1"
            label="Text1"
            type="text"
            fullWidth
            value={NewEnvironmentData.text1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="text2"
            label="Text2"
            type="text"
            fullWidth
            value={NewEnvironmentData.text2}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="width"
            label="Width"
            type="text"
            fullWidth
            value={NewEnvironmentData.width}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="height"
            label="Height"
            type="text"
            fullWidth
            value={NewEnvironmentData.height}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleCancelUpdate}>
        <DialogTitle>Update Environment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Environment Name"
            type="text"
            fullWidth
            value={NewEnvironmentData.name}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateEnvironmentText(NewEnvironmentData.name)}
            helperText={
              !validateEnvironmentText(NewEnvironmentData.name)
                ? "Environment Name should be 12 characters long."
                : ""
            }
          />
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Environment Description"
            type="text"
            fullWidth
            value={NewEnvironmentData.description}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 12, // Maximum character length
            }}
            error={!validateEnvironmentText(NewEnvironmentData.description)}
            helperText={
              !validateEnvironmentText(NewEnvironmentData.description)
                ? "Description should be 10 characters long."
                : ""
            }
          />
          <TextField
            margin="dense"
            name="text1"
            label="Text1"
            type="text"
            fullWidth
            value={NewEnvironmentData.text1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="text2"
            label="Text2"
            type="text"
            fullWidth
            value={NewEnvironmentData.text2}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="height"
            label="height"
            type="text"
            fullWidth
            value={NewEnvironmentData.height}
            onChange={handleInputChange}
          />

          <TextField
            margin="dense"
            name="width"
            label="width"
            type="text"
            fullWidth
            value={NewEnvironmentData.width}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="warning">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailDialogOpen} onClose={handleCancelDetail}>
        <DialogTitle>Environment Detail</DialogTitle>
        <DialogContent>
          <Box>
            <strong>Name:</strong>{" "}
            {selectedEnvironment && selectedEnvironment.name}
          </Box>
          <Box>
            <strong>Environment:</strong>{" "}
            {selectedEnvironment && selectedEnvironment.description}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Environment;
