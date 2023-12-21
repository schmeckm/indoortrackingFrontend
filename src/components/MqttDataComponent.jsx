import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MqttDataComponent = () => {
  const [mqttData, setMqttData] = useState('');
  const client = mqtt.connect('mqtt://broker-url'); // Ersetzen Sie 'broker-url' durch die URL Ihres MQTT-Brokers

  useEffect(() => {
    // MQTT-Themen abonnieren
    client.subscribe('topic-name'); // Ersetzen Sie 'topic-name' durch den Namen des gewünschten MQTT-Themas

    // Nachrichten verarbeiten
    client.on('message', (topic, message) => {
      setMqttData(message.toString());
    });

    // Trennen Sie die MQTT-Verbindung, wenn die Komponente unmontiert wird
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT-Daten:</h1>
      <p>{mqttData}</p>
    </div>
  );
};

export default MqttDataComponent;
