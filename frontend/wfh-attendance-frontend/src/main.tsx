import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { getToken } from './utils/auth';
import { setAuthToken } from './services/api';

const token = getToken();
if (token) {
  setAuthToken(token);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);