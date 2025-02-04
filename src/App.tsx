import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightBoard from './components/FlightBoard';
import FlightDetailsPage from './components/FlightDetailsPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FlightBoard />} />
          <Route path="/flight/:id" element={<FlightDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
