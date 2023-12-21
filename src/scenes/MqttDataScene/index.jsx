import React from 'react';
import MqttDataScene from '../../components/MqttDataComponent'; // Annahme, dass MqttDataComponent in einem übergeordneten Verzeichnis liegt

const MqttDataScene = () => {
  return (
    <div>
      <h1>MQTT-Daten-Szene</h1>
      <p>Dies ist die Szene zum Anzeigen von MQTT-Daten.</p>
      <MqttDataComponent /> {/* Verwenden Sie Ihre MqttDataComponent-Komponente hier */}
    </div>
  );
};

export default MqttDataScene;
