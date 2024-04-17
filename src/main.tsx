import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from "react-ga4";
import App from './App.tsx';
import 'normalize.css';
import './index.css';

ReactGA.initialize("G-6PCS51B41G");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

