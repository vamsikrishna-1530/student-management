import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// React 19 compatibility helpers for Ant Design v5
import '@ant-design/v5-patch-for-react-19';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
