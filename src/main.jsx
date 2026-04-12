import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n.js';
import App from './App.jsx';
import LanguageRoute from './components/LanguageRoute.jsx';

const SUPPORTED_LANGS = ['en', 'pl', 'de'];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* /:lang — supported language prefix */}
        <Route path="/:lang" element={<LanguageRoute supportedLangs={SUPPORTED_LANGS} />}>
          <Route index element={<App />} />
        </Route>
        {/* / — default to English */}
        <Route path="/" element={<App />} />
        {/* anything else — redirect to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
