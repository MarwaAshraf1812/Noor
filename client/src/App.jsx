import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes';

function App() {
  console.log("App component executing");
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
