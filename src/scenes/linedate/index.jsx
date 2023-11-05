import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChartDate";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Display Temperature" subtitle=" Please select the Beacon and the time interval" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
