import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import ResultsView from './Results.jsx';
import PaperView from './PaperView.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/results" element={<ResultsView />} />
        <Route path="/paper/:pdfUrl" element={<PaperView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
