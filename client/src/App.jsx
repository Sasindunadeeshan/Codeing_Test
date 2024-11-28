import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookDetails from './pages/BookDetails'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
