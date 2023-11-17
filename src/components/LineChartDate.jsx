import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInDays } from "date-fns";
import { timeFormat } from 'd3-time-format';
import TextField from '@mui/material/TextField';

const API_ENDPOINT_BEACONS = "http://localhost:3002/api/beacon/getAllBeacons";
const API_ENDPOINT_TEMPERATURE = "http://localhost:3002/api/temperature/getTemperaturesBetweenDates";

const LineChart = () => {
  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 20);
  const initialEndDate = new Date();

  const [chartData, setChartData] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [selectedBeaconMac, setSelectedBeaconMac] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isLoadingBeacons, setIsLoadingBeacons] = useState(true);
  const [medianTemperature, setMedianTemperature] = useState(null);

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
    setIsLoadingBeacons(true);
    fetch(API_ENDPOINT_BEACONS)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setBeacons(data.data);
          if (data.data.length > 0) {
            setSelectedBeaconMac(data.data[0].beaconMac); // Set the first beacon by default
          }
        } else {
          throw new Error('Failed to load beacons');
        }
      })
      .catch(error => {
        console.error("Error fetching beacons:", error);
      })
      .finally(() => {
        setIsLoadingBeacons(false);
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

          // Calculate median temperature
          const temperatures = formattedData.map(d => d.y);
          setMedianTemperature(calculateMedian(temperatures));
        }
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, [selectedBeaconMac, startDate, endDate]);

  const calculateMedian = (values) => {
    if (values.length === 0) return null;
    const sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 !== 0
      ? sortedValues[mid]
      : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  };

  const handleBeaconChange = (event) => {
    setSelectedBeaconMac(event.target.value);
    setChartData([]);
    setMedianTemperature(null);
  };

  const rangeInDays = differenceInDays(endDate, startDate);

  // Dynamic tick formatting based on the range in days
  let tickValues;
  let tickFormat;
  if (rangeInDays <= 1) {
    tickValues = "every 2 hours";
    tickFormat = timeFormat("%H:%M");
  } else if (rangeInDays <= 7) {
    tickValues = "every day";
    tickFormat = timeFormat("%a %d");
  } else if (rangeInDays <= 30) {
    tickValues = "every 3 days";
    tickFormat = timeFormat("%b %d");
  } else {
    tickValues = "every week";
    tickFormat = timeFormat("%b %d");
  }


  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="beacon-select-label">Beacon</InputLabel>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isLoadingBeacons ? (
            <CircularProgress size={24} style={{ margin: '0 auto' }} />
          ) : (
            <Select
              labelId="beacon-select-label"
              value={selectedBeaconMac}
              onChange={handleBeaconChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              fullWidth
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
          )}
        </div>
      </FormControl>


      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>


      {/* Display median temperature value */}
      {medianTemperature !== null && (
        <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <strong>Median Temperature:</strong> {medianTemperature.toFixed(2)}°C
        </div>
      )}




      <div style={{ height: "500px" }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "time", format: "%Y-%m-%d %H:%M:%S", precision: "minute" }}
          xFormat="time:%Y-%m-%d %H:%M:%S"
          yScale={{ type: "linear", min: -20, max: 80, stacked: false, reverse: false }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: tickFormat,
            tickValues: tickValues,
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: rangeInDays <= 30 ? 45 : 0,
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
          lineWidth={1}
          pointSize={0}
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
