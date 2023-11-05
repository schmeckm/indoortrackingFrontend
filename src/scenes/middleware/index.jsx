import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const middleware = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigiert innerhalb der Anwendung
    navigate('/your-internal-route');
  }, [navigate]);

  return (
    <div>Umleitung...</div>
  );
};

export default middleware;