// =============================================================
//  Client API Modules — All in one file for conciseness
//  Split into: auth | properties | tenants | rentPayments
// =============================================================

import api from './axiosClient.js';

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
    profile: (data) => api.patch('/auth/profile', data),
};

// ── Properties ───────────────────────────────────────────────
export const propertiesApi = {
    list: () => api.get('/properties'),
    get: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.patch(`/properties/${id}`, data),
    remove: (id) => api.delete(`/properties/${id}`),
    // Units
    listUnits: (pid) => api.get(`/properties/${pid}/units`),
    createUnit: (pid, data) => api.post(`/properties/${pid}/units`, data),
    updateUnit: (pid, uid, data) => api.patch(`/properties/${pid}/units/${uid}`, data),
    deleteUnit: (pid, uid) => api.delete(`/properties/${pid}/units/${uid}`),
};

// ── Tenants ──────────────────────────────────────────────────
export const tenantsApi = {
    list: (params) => api.get('/tenants', { params }),
    get: (id) => api.get(`/tenants/${id}`),
    create: (data) => api.post('/tenants', data),
    update: (id, data) => api.patch(`/tenants/${id}`, data),
    vacate: (id) => api.delete(`/tenants/${id}`),
};

// ── Rent Payments ─────────────────────────────────────────────
export const rentPaymentsApi = {
    list: (params) => api.get('/rent-payments', { params }),
    generate: (data) => api.post('/rent-payments/generate', data),
    markPaid: (id, data) => api.patch(`/rent-payments/${id}/pay`, data),
    partialPay: (id, data) => api.patch(`/rent-payments/${id}/partial`, data), // New
    waive: (id, data) => api.patch(`/rent-payments/${id}/waive`, data),
    summary: () => api.get('/rent-payments/summary'),
};

// ── Expenses ────────────────────────────────────────────────
export const expensesApi = {
    list: (params) => api.get('/expenses', { params }),
    create: (data) => api.post('/expenses', data),
    summary: (params) => api.get('/expenses/summary', { params }),
    remove: (id) => api.delete(`/expenses/${id}`),
};

// ── Dashboard ────────────────────────────────────────────────
export const dashboardApi = {
    stats: () => api.get('/dashboard'),
};

// ── WhatsApp ─────────────────────────────────────────────────
export const whatsappApi = {
    status: () => api.get(`/whatsapp/status`),
    qr: () => api.get(`/whatsapp/qr`),
    sendReminder: (id) => api.post(`/whatsapp/send-reminder/${id}`),
};
