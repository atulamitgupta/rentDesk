// =============================================================
//  Axios API Client — Centralized HTTP layer
//  File : client/src/api/axiosClient.js
//  
//  All API calls go through this instance. It handles:
//    - Base URL configuration (env-aware)
//    - Automatic JWT injection on every request
//    - Global 401 handling (redirect to login on token expiry)
// =============================================================

import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rentdesk-production.up.railway.app/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15 seconds — accommodates slow free-tier servers
});

// ── REQUEST INTERCEPTOR: inject JWT ──────────────────────────
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('rentdesk_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR: handle auth errors ─────────────────
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if it's NOT a login attempt
        const isLoginAttempt = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginAttempt) {
            // Token expired or invalid — clear storage and force login
            localStorage.removeItem('rentdesk_token');
            localStorage.removeItem('rentdesk_user');
            window.location.href = '/login';
        }
        // Pass the error down so individual callers can handle it
        return Promise.reject(error);
    }
);

export default axiosClient;
