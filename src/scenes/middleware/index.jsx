// scenes/Home.js
import { Box } from "@mui/material";
import Header from "../../components/Header";
import React from 'react';
import Middleware from '../../components/middleware';

const Home = () => {
  return (
    <Box m="20px">
      <Header title="Middleware Layer" subtitle="Node-Red" />
      <Box height="75vh">
      </Box>
    </Box>
  );
};

export default Middleware;