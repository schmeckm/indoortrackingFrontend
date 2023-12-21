import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import markerIconUrl from '../position/Beacon_icon.png';

const MapPage = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const containerRef = useRef(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lat = parseFloat(params.get('lat')) || 51.505; // Standardwert für Breitengrad
    const lon = parseFloat(params.get('lon')) || -0.09; // Standardwert für Längengrad
    const view = params.get('view') || 'default'; // Standardansicht

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.remove();
        }

        mapRef.current = L.map(containerRef.current).setView([lat, lon], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        const customIcon = L.icon({
            iconUrl: markerIconUrl,
            iconSize: [32, 32],
        });

        markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapRef.current);

        // Laden und Hinzufügen der GeoJSON-Daten zur Karte
        fetch('react-admin-dashboard\public\assets\building.geojson')
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                L.geoJSON(data).addTo(mapRef.current);
            })
            .catch(error => {
                console.error('Error loading GeoJSON: ', error);
            });

    }, [lat, lon, view]);

    return <div ref = { containerRef }
    style = {
        { height: '100vh', width: '100vw' }
    }
    />;
};

export default MapPage;