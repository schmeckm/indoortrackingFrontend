import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  TextField, Select, MenuItem, FormControl, FormLabel, FormControlLabel, Switch,
  Slider, Typography, AppBar, Tabs, Tab, Grid, Button, FormGroup, Snackbar,
} from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/material';


const API_URL = 'http://192.168.1.128:3002/api/environment';

const useStyles = makeStyles((theme) => ({
  searchField: {
    width: '200px',
    marginBottom: '20px',
  },
  gridContainer: {
    marginTop: theme.spacing(2),
  },
  slider: {
    width: '80% !important',
  },
  pageContent: {
    marginLeft: theme.spacing(9),
  },
}));

const Search = ({ onSearch }) => {
  const classes = useStyles();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(event.target.value);
    }
  };

  return (
    <div className={classes.searchField}>
      <TextField label="Search location" onKeyPress={handleKeyPress} />
    </div>
  );
};

function SetViewOnClick({ map, coords }) {
  useEffect(() => {
    if (map) {
      map.setView(coords, map.getZoom());
    }
  }, [map, coords]);

  return null;
}

const EnvironmentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [position, setPosition] = useState([51.505, -0.09]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mapProvider, setMapProvider] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [assetTracking, setAssetTracking] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [imagePosition, setImagePosition] = useState({ lat: 51.505, lng: -0.09 });
  const [isDragging, setIsDragging] = useState(false);
  const classes = useStyles();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${API_URL}/getSingleEnvironment/${id}`);
        setData(result.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleImageFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSaveButtonClick = async () => {
    try {
      if (!selectedFile) {
        console.log('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.put(`${API_URL}/updateEnvironment/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update response:', response);
      setSnackbarMessage('Environment updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating environment:', error);
      setSnackbarMessage('Error updating environment');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const search = async (query) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      console.log(`Searching for ${query}`);
      console.log(response);
      if (response.data && response.data[0]) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setErrorMessage(null);
      } else {
        console.error('No results found for query:', query);
        setErrorMessage(`No results found for "${query}"`);
      }
    } catch (error) {
      console.error('Error in search query:', error);
      setErrorMessage(`Error in search query: ${error.message}`);
    }
  };

  // Function to generate the style for the image overlay
  const getImageOverlayStyle = () => {
    if (!selectedFile) return {};

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 1000, // Ensure it's above the map tiles
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${URL.createObjectURL(selectedFile)})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      opacity: 1,
      cursor: isDragging ? 'grabbing' : 'grab', // Zeigt den Verschiebungszeiger während des Ziehens
    };
  };

  const handleImageMouseMove = (e) => {
    if (isDragging) {
      const { clientX, clientY } = e;
      if (map) {
        const newImagePosition = map.containerPointToLatLng([clientX, clientY]);
        setImagePosition(newImagePosition);
      }
    }
  };

  const handleImageMouseUp = () => {
    if (isDragging) {
      const { lat, lng } = imagePosition;
      console.log(`Final Position - Latitude: ${lat}, Longitude: ${lng}`);
    }
    setIsDragging(false);
  };

  const handleImageMouseDown = (e) => {
    setIsDragging(true);
    const { clientX, clientY } = e;
    if (map) {
      const newImagePosition = map.containerPointToLatLng([clientX, clientY]);
      setImagePosition(newImagePosition);
    }
  };

  return (
    <Box m={2}>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label={data ? data.description : 'Loading...'} />
          <Tab label="Tab 2" />
        </Tabs>
      </AppBar>

      <div className={classes.pageContent}>
        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Map Provider</FormLabel>
                    <Select
                      value={mapProvider}
                      onChange={(e) => setMapProvider(e.target.value)}
                      color="primary"
                    >
                      <MenuItem value="Google Map">Google Map</MenuItem>
                      <MenuItem value="Leaflet Map">Leaflet Map</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={assetTracking}
                        onChange={(e) => setAssetTracking(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Asset tracking"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormLabel>Floor Plan</FormLabel>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageFileChange}
                    />
                    <Button variant="contained" color="primary" component="label">
                      Upload Image
                      <input type="file" style={{ display: 'none' }} onChange={handleImageFileChange} />
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSaveButtonClick}>
                      Save
                    </Button>
                    <Typography id="rotation-slider" gutterBottom>
                      Rotation
                    </Typography>
                    <Slider
                      className={classes.slider}
                      value={rotation}
                      onChange={(e, val) => setRotation(val)}
                      valueLabelDisplay="auto"
                      color="primary"
                      min={0}
                      max={360}
                    />
                    <Typography id="scale-slider" gutterBottom>
                      Scale
                    </Typography>
                    <Slider
                      className={classes.slider}
                      value={scale}
                      onChange={(e, val) => setScale(val)}
                      valueLabelDisplay="auto"
                      color="primary"
                      min={0.1}
                      max={2}
                      step={0.1}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }} whenCreated={setMap}>
                <SetViewOnClick map={map} coords={position} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>A marker.</Popup>
                </Marker>
                {/* Hier ist die Verwendung von useMap innerhalb des MapContainer */}
                {selectedFile && (
                  <div
                    className="image-overlay"
                    style={getImageOverlayStyle()}
                    onMouseDown={handleImageMouseDown}
                    onMouseMove={handleImageMouseMove}
                    onMouseUp={handleImageMouseUp}
                  />
                )}
              </MapContainer>
              <Search onSearch={search} />
              {errorMessage && <div>Error: {errorMessage}</div>}
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && (
          <div>
            {/* Content for Tab 2 */}
            <h2>Tab 2 Content</h2>
            <p>Content for Tab 2</p>
          </div>
        )}
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <div>{snackbarMessage}</div>
      </Snackbar>
    </Box>
  );
};

export default EnvironmentDetail;
