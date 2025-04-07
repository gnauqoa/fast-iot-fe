import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import 'leaflet/dist/leaflet.css';
import '@xyflow/react/dist/style.css';

const container = document.getElementById('root');
// eslint-disable-next-line
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
