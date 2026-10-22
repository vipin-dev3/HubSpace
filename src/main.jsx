import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { LinksProvider } from './context/LinksContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LinksProvider>
        <App />
      </LinksProvider>
    </ThemeProvider>
  </StrictMode>,
);
