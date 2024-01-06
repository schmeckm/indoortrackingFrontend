import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const TemperatureChart = ({ temperatureData }) => {
  // Konfiguration des Liniendiagramms
  const chartData = {
    labels: temperatureData.map((data, index) => index.toString()),
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Temperature Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default TemperatureChart;
