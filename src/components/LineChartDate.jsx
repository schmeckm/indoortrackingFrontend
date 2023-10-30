import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInDays } from "date-fns";
import { timeFormat } from 'd3-time-format';

const API_ENDPOINT_BEACONS = "http://34.27.176.104:3002/api/beacon/getAllBeacons";
const API_ENDPOINT_TEMPERATURE = "http://34.27.176.104:3002/api/temperature/getTemperaturesBetweenDates";

const LineChart = () => {
    const [chartData, setChartData] = useState([]);
    const [beacons, setBeacons] = useState([]);
    const [selectedBeaconMac, setSelectedBeaconMac] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        fetch(API_ENDPOINT_BEACONS)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBeacons(data.data);
                    if (data.data.length) {
                        setSelectedBeaconMac(data.data[0].beaconMac);
                    }
                }
            });
    }, []);

    useEffect(() => {
        if (!selectedBeaconMac) return;
        const start = startDate.toISOString();
        const end = endDate.toISOString();

        fetch(`${API_ENDPOINT_TEMPERATURE}?startDate=${start}&endDate=${end}&beacon=${selectedBeaconMac}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const formattedData = data.data.map(item => ({
                        x: new Date(item._id.year, item._id.month - 1, item._id.day, item._id.hour),
                        y: item.medianTemperature
                    }));
                    setChartData([{ id: "Temperature", data: formattedData }]);
                }
            });
    }, [selectedBeaconMac, startDate, endDate]);

    const rangeInDays = differenceInDays(endDate, startDate);
    const timeFormatter = timeFormat("%H:%M");
    const dateFormatter = timeFormat("%m/%d");
    
    let tickValues = "every hour";
    let tickFormat = timeFormatter;

    if (rangeInDays > 1) {
        tickValues = "every day";
        tickFormat = dateFormatter;
    }

    const CustomLayer = ({ yScale, innerWidth }) => {
        const blueY1 = yScale(-10);
        const blueY2 = yScale(21);
        const redY1 = yScale(20);
        const redY2 = yScale(50);
    
        return (
            <>
                <rect
                    x={0}
                    y={blueY2}
                    width={innerWidth}
                    height={blueY1 - blueY2}
                    fill="blue"
                    opacity={0.2}
                />
                <rect
                    x={0}
                    y={redY2}
                    width={innerWidth}
                    height={redY1 - redY2}
                    fill="red"
                    opacity={0.2}
                />
            </>
        );
    }

    return (
        <div>
            <FormControl>
                <InputLabel>Beacon</InputLabel>
                <Select value={selectedBeaconMac} onChange={(e) => setSelectedBeaconMac(e.target.value)}>
                    {beacons.map((beacon) => (
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
                    onChange={(newStartDate) => setStartDate(newStartDate)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newEndDate) => setEndDate(newEndDate)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <div style={{ height: 400, width: "100%" }}>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{
                        type: 'time',
                        format: "%Y-%m-%d %H:%M:%S",
                        precision: 'second',
                    }}
                    xFormat={tickFormat}
                    yScale={{ type: 'linear', min: '-18', max: '70', stacked: true, reverse: false }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        format: tickFormat,
                        tickValues: tickValues,
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Zeit',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 10,
                        tickPadding: 10,
                        tickRotation: 0,
                        legend: 'Temperatur',
                        legendOffset: -60,
                        legendPosition: 'middle'
                    }}
                    colors={['green']}
                    lineWidth={3}
                    yRules={[
                        {
                            value: -18,
                            lineStyle: { stroke: 'red', strokeWidth: 1, strokeDasharray: '4 4' },
                        },
                        {
                            value: 5,
                            lineStyle: { stroke: 'blue', strokeWidth: 1, strokeDasharray: '4 4' },
                        }
                    ]}
                    enableGridX
                    enableGridY
                    layers={['grid', 'axes', CustomLayer, 'lines', 'points', 'slices', 'crosshair']}
                />
            </div>
        </div>
    );
};

export default LineChart;

