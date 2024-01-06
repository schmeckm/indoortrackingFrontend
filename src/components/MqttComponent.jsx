import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

//const dotenv = require("dotenv");
//const path = require("path");


// Load environment configurations
//dotenv.config({ path: path.resolve(__dirname, "../process.env") });

const MQTTComponent = ({ setMqttDataSentCount }) => {
  const [messages, setMessages] = useState([]);
  const [beaconIds, setBeaconIds] = useState(new Set());
  const [selectedBeaconId, setSelectedBeaconId] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [receivedMessagesCount, setReceivedMessagesCount] = useState(0);


  // Konfigurationsparameter aus Umgebungsvariablen
  const protocol = process.env.REACT_APP_MQTT_PROTOCOL || "wss";
  const suffix = process.env.REACT_APP_MQTT_PROTOCOL || "mqtt";
  const host = process.env.REACT_APP_MQTT_HOST || "broker.hivemq.com";
  const port = process.env.REACT_APP_MQTT_PORT || "8884";
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const connectUrl = `${protocol}://${host}:${port}/${suffix}`;

  useEffect(() => {
    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: process.env.REACT_APP_MQTT_USERNAME || "station",
      password: process.env.REACT_APP_MQTT_PASSWORD || "station",
      reconnectPeriod: 1000,
    });

    client.on("error", (error) => {
      console.error("MQTT Connection Error:", error);
      setConnectionStatus("Connection Error");
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setConnectionStatus("Connected");
      client.subscribe("beacon/#");
    });

    client.on("message", (topic, message) => {
      const newMessage = { topic, message: message.toString() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      try {
        const payload = JSON.parse(newMessage.message);
        setBeaconIds((prevIds) => new Set(prevIds).add(payload.beacon));
        // Erhöhe die Anzahl der empfangenen Nachrichten
        setReceivedMessagesCount((prevCount) => prevCount + 1);
    
        // Erhöhe die Anzahl der MQTT Data Sent
        setMqttDataSentCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error("Error parsing message", error);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    const filtered = messages.filter((msg) => {
      try {
        const payload = JSON.parse(msg.message);
        const messageHour = new Date(payload.currentDateTime).getHours();
        const isBeaconMatch =
          selectedBeaconId === "" || payload.beacon === selectedBeaconId;
        const isHourMatch =
          selectedHour === "" || messageHour === parseInt(selectedHour);
        return isBeaconMatch && isHourMatch;
      } catch {
        return false;
      }
    });
    setFilteredMessages(filtered);
  }, [messages, selectedBeaconId, selectedHour]);

  return (
    <div style={{ marginLeft: "80px" }}>
      <h2>MQTT Messages</h2>
      <p>
        Connection Status:
        <span
          style={{
            fontWeight: connectionStatus === "Connected" ? "bold" : "normal",
          }}
        >
          {connectionStatus}
        </span>
      </p>

      {/* Dropdown-Menü für Beacon-Auswahl */}
      <label htmlFor="beacon-select">Wählen Sie einen Beacon:</label>
      <select
        id="beacon-select"
        value={selectedBeaconId}
        onChange={(e) => setSelectedBeaconId(e.target.value)}
      >
        <option value="">Filter Beacons</option>
        {[...beaconIds].map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* Dropdown-Menü für die Stunden-Auswahl */}
      <label htmlFor="hour-select">Select a time:</label>
      <select
        id="hour-select"
        value={selectedHour}
        onChange={(e) => setSelectedHour(e.target.value)}
      >
        <option value="">Filter Time</option>
        {[...Array(24).keys()].map((hour) => (
          <option key={hour} value={hour}>
            {hour}:00
          </option>
        ))}
      </select>

      <div
        style={{
          height: "245px",
          width: "1450px", // Hier wird die Breite auf "200px" gesetzt
          overflowY: "auto",
          border: "0.5px solid #ccc",
          marginTop: "30px",
          fontSize: "12px", // Hier wird die Schriftgröße auf "16px" gesetzt
        }}
      >
        <ul>
          {filteredMessages.map((msg, index) => (
            <li key={index}>
              <strong>Topic:</strong> {msg.topic}, <strong>Message:</strong>{" "}
              {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MQTTComponent;
