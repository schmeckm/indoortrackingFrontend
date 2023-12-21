import React, { useEffect } from 'react';

const Middleware = () => {
  useEffect(() => {
    // Öffnet www.bild.de in einem neuen Fenster
    window.open('http://35.232.238.172:1880', '_blank');
  }, []);

  return (
    <div>Middleware Layer -Node-Red</div>
  );
};

export default Middleware;

