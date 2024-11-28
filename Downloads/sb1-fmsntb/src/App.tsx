import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DesktopLayout from './components/DesktopLayout';
import MobileLayout from './components/MobileLayout';

const App: React.FC = () => {
  // Detect if the device is mobile (you can adjust the width as needed)
  const isMobile = window.innerWidth <= 768;

  return (
    <Router>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Router>
  );
};

export default App;