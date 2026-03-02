import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: { primary: '#f97316', secondary: '#fff' },
                        style: { border: '1px solid #fed7aa' },
                    },
                    error: {
                        style: { border: '1px solid #fecaca' },
                    },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>
);
