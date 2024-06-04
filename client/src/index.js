import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot
import App from './App';
import 'react-toastify/dist/ReactToastify.css'; // Import ToastContainer CSS
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);
