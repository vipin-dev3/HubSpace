import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LinksProvider } from './context/LinksContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LinksProvider>
          <App />
        </LinksProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
