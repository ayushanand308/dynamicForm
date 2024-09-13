// src/index.js
import { createRoot } from 'react-dom/client';
import App from './App'; // Ensure the extension is not required if the file is .jsx
import './index.css';

createRoot(document.getElementById('root')).render(
  <App />
);
