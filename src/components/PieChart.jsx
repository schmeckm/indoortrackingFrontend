import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2023-10-01T23:30:00.000Z"));
  const [endDate, setEndDate] = useState(new Date("2023-10-26T23:30:00.000Z"));
  const [beacon, setBeacon] = useState("AC233FABE1BA");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/temperature/getBeaconDurationInSAPLocation?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&beacon=${beacon}`);
        const result = await response.json();
        if (result.success) {
          setRawData(result.data);
          const totalDuration = result.data.reduce((acc, item) => acc + item.totalTimeSpent, 0);
          const formattedData = result.data.map((item) => ({
            id: item._id.sapLocation[0],
            value: ((item.totalTimeSpent / totalDuration) * 100).toFixed(2),
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [startDate, endDate, beacon]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ marginRight: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newStartDate) => setStartDate(newStartDate)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newEndDate) => setEndDate(newEndDate)}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            label="Beacon"
            value={beacon}
            onChange={(e) => setBeacon(e.target.value)}
          />
        </LocalizationProvider>
      </div>

      <div style={{ height: "600px", width: "800px" }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          sliceLabel={(e) => `${Number(e.value).toFixed(2)}%`}
          enableRadialLabels={false}
          enableSlicesLabels={true}
          theme={{
            labels: {
              text: {
                fontSize: '14px', // Angepasste Schriftgröße
              },
            },
          }}
          tooltip={({ datum }) => {
            const relevantData = rawData.find((d) => d._id.sapLocation[0] === datum.id);
            return (
              <strong>
                {datum.id}:{" "}
                {datum.value}% (
                {relevantData.totalTimeSpentDays}d 
                {relevantData.totalTimeSpentHours}h 
                {relevantData.totalTimeSpentMinutes}m)
              </strong>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;

