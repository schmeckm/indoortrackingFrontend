import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import './QRCodeScanner.css';

const checkValueInDatabase = async (value) => {
  try {
    const response = await fetch(`http://192.168.1.128:3002/api/beacon/getBeaconByMac/${value}`);
    const result = await response.json();
    return result.success && result.data !== null;
  } catch (error) {
    console.error("API error", error);
    return false;
  }
};

function QRCodeScanner() {
  const [scanValue, setScanValue] = useState('');
  const [inputColorScanValue, setInputColorScanValue] = useState('');
  const [huID, setHuID] = useState('');
  const [beaconID, setBeaconID] = useState('');
  const [scanning, setScanning] = useState(false);

  const qrRef = useRef(null);

  const handleScan = async (data) => {
    if (data) {
      const existsInDatabase = await checkValueInDatabase(data.text);
      if (existsInDatabase) {
        if (!beaconID) {
          setBeaconID(data.text);
        }
        setInputColorScanValue('green');
        setTimeout(() => {
          setScanValue('');
          setInputColorScanValue('white');
        }, 1000);
      } else {
        setInputColorScanValue('red');
      }
      stopScanning();
    }
  };

  const handleError = (err) => {
    console.error(err);
    setInputColorScanValue('red');
  };

  const startScanning = () => {
    setScanValue('');
    setInputColorScanValue('white');
    if (!beaconID) {
      setBeaconID('');
    }
    setHuID('');
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
    if (qrRef.current) {
      qrRef.current.pause();
      qrRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <div className="qr-reader">
        <QrReader
          ref={qrRef}
          delay={scanning ? 300 : false}
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
        />
        <button
          className="start-button"
          onClick={() => {
            if (!scanning) {
              startScanning();
            } else {
              stopScanning();
            }
          }}
        >
          {scanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
        {scanning && <div className="scanning-line"></div>}
      </div>
      <div className="table-container">
        <table>
          <tbody>
            <tr>
              <td>HU_ID:</td>
              <td>
                <input
                  type="text"
                  placeholder="HU_ID"
                  value={huID}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>Beacon_ID:</td>
              <td>
                <input
                  type="text"
                  placeholder="Beacon_ID"
                  value={beaconID}
                  style={{ backgroundColor: inputColorScanValue }}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>Scanvalue:</td>
              <td>
                <input
                  type="text"
                  placeholder="Scanvalue"
                  value={scanValue}
                  style={{ backgroundColor: inputColorScanValue }}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QRCodeScanner;

