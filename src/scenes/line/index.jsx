import { Box } from "@mui/material";
import Header from "../../components/Header";
import MqttComponent from "../../components/MqttComponent";

const MQTT = () => {
  return (
    <Box m="20px">
      <Header title="MQTT_Component" />
      <Box height="75vh">
        <MqttComponent />
      </Box>
    </Box>
  );
};

export default MQTT;
