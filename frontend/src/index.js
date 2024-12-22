import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'
import App from './App';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/authContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <App />
        <ToastContainer />
    </AuthProvider>
);