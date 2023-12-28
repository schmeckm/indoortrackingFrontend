import React, { useEffect, useState } from "react";
import { db } from '../../config/firebase'; // Stellen Sie sicher, dass der richtige Pfad zur Firebase-Konfiguration angegeben ist
import { getDocs, collection } from 'firebase/firestore'; // Firebase Firestore-Module importieren

import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contacts, setContacts] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1.5 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "address1", headerName: "Address 1", flex: 1 },
    { field: "address2", headerName: "Address 2", flex: 1 },
    { field: "contact", headerName: "Contact", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "zipCode", headerName: "zipCode", flex: 0.5 },
  ];
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const UserData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(UserData);
        console.log("Daten:", UserData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
      }
    };
  
    fetchContacts();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contacts} // Verwenden Sie die abgerufenen Kontakte aus Firestore
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
