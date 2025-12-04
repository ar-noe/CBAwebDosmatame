import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Bienvenido al sistema</p>
      <Link to="/signup">Volver al registro</Link>
    </div>
  );
};

export default Dashboard;