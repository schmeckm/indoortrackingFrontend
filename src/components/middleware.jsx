import React, { useEffect } from 'react';

const Middleware = () => {
  useEffect(() => {

    window.open('http://136.244.90.128:1880', '_blank');
  }, []);
  return (
    <div>Middleware Layer -Node-Red</div>
  );
};

export default Middleware;

