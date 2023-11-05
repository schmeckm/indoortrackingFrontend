import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInDays } from "date-fns"; // Importieren Sie 'differenceInDays' aus date-fns
import { timeFormat } from 'd3-time-format'; // Importieren Sie 'timeFormat' aus d3-time-format

const API_ENDPOINT_BEACONS = "http://localhost:3002/api/beacon/getAllBeacons";
const API_ENDPOINT_TEMPERATURE = "http://localhost:3002/api/temperature/getTemperaturesBetweenDates";

const LineChart = () => {
  const initialStartDate = new Date(); // Initialer Startdatum ist heute
  initialStartDate.setDate(initialStartDate.getDate() - 20); // 20 Tage zurücksetzen
  const initialEndDate = new Date(); // Initialer Enddatum ist heute

  const [chartData, setChartData] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [selectedBeaconMac, setSelectedBeaconMac] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Custom Layer für farbige Temperaturbereiche
  const CustomLayer = ({ yScale, innerWidth }) => {
    const coldArea = yScale(0);
    const warmArea = yScale(20);

    return (
      <>
    <rect x={0} y={0} width={innerWidth} height={coldArea} fill="red" opacity={0.1} />
      <rect x={0} y={warmArea} width={innerWidth} height={innerWidth - warmArea} fill="blue" opacity={0.1} />
      </>
    );
  };

  useEffect(() => {
    fetch(API_ENDPOINT_BEACONS)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setBeacons(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedBeaconMac) return;

    const fetchData = async () => {
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      try {
        const response = await fetch(
          `${API_ENDPOINT_TEMPERATURE}?startDate=${start}&endDate=${end}&beacon=${selectedBeaconMac}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        if (jsonData.success) {
          const formattedData = jsonData.data.map(item => ({
            x: new Date(item._id.year, item._id.month - 1, item._id.day, item._id.hour),
            y: item.medianTemperature
          }));
          setChartData([{ id: "Temperature", data: formattedData }]);
        }
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, [selectedBeaconMac, startDate, endDate]);

  const handleBeaconChange = (event) => {
    setSelectedBeaconMac(event.target.value);
    setChartData([]); // Daten zurücksetzen
  };

  // Datumsformat und Tick-Berechnungen
  const rangeInDays = differenceInDays(endDate, startDate);
  const timeFormatter = timeFormat("%H:%M");
  const dateFormatter = timeFormat("%Y-%m-%d");

  let tickValues = "every day";
  let tickFormat = dateFormatter;

  if (rangeInDays <= 1) {
    tickValues = "every hour";
    tickFormat = timeFormatter;
  }

  return (
    <div>
      <FormControl>
        <InputLabel>Beacon</InputLabel>
        <Select
          value={selectedBeaconMac}
          onChange={handleBeaconChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" disabled>
            Select a beacon
          </MenuItem>
          {beacons.map(beacon => (
            <MenuItem key={beacon._id} value={beacon.beaconMac}>
              {beacon.beaconMac} - {beacon.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          renderInput={params => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          renderInput={params => <TextField {...params} />}
        />
      </LocalizationProvider>

      <div style={{ height: "500px" }}>
        <ResponsiveLine
    data={chartData}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "time", format: "%Y-%m-%d %H:%M:%S", precision: "minute" }}
    xFormat="time:%Y-%m-%d %H:%M:%S"
    yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
            format: tickFormat,
            tickValues: tickValues,
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Time',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Temperature',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'category10' }}
    lineWidth={1} // Einstellen der Linienstärke
    pointSize={0} // Entfernen der Punkte
    useMesh={true}
    layers={['grid', 'axes', CustomLayer, 'lines', 'markers', 'legends', 'crosshair']}
    enableSlices="x"
    enableGridX={true}
    enableGridY={true}
        />
      </div>
    </div>
  );
};

export default LineChart;
