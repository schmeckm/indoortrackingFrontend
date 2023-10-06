import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data);
      console.log('Scanned code is: ', data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
        delay={300}
        onResult={handleScan}
        onError={handleError}
        constraints={{ facingMode: 'environment' }}
      />
      {scannedCode && (
        <div>
          <h2>Scanned Code</h2>
          <p>{scannedCode}</p>
        </div>
      )}
    </div>
  );
}

export default QRCodeScanner;
