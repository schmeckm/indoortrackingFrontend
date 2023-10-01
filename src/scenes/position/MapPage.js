import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import markerIconUrl from '../position/Beacon_icon.png'; // Pfade zur Bilddatei des benutzerdefinierten Icons

const MapPage = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = parseFloat(params.get('lat')) || 51.505; // Default to London latitude
  const lon = parseFloat(params.get('lon')) || -0.09; // Default to London longitude

  useEffect(() => {
    if (mapRef.current) {
      // If the map is already initialized, remove it before creating a new one
      mapRef.current.remove();
    }

    // Create a new map and marker
    mapRef.current = L.map(containerRef.current).setView([lat, lon], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    const customIcon = L.icon({
      iconUrl: markerIconUrl,
      iconSize: [32, 32], // Adjust the size of the custom icon if needed
    });

    markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapRef.current);
  }, [lat, lon]);

  return <div ref={containerRef} style={{ height: '100vh', width: '100vw' }} />;
};

export default MapPage;
