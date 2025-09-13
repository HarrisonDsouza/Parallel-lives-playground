import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Playground from './pages/Playground';
import TimelineEditor from './pages/TimelineEditor';
import Visit from './pages/Visit';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="playground" element={<Playground />} />
          <Route path="editor" element={<TimelineEditor />} />
          <Route path="visit/:id" element={<Visit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
