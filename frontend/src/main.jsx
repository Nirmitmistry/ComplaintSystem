
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppProvider>
  </BrowserRouter>
);