import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicroad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const issueAPI = {
  create: (formData) => api.post('/issues', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  previewAI: (formData) => api.post('/issues/analyze-preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/issues', { params }),
  getMapIssues: () => api.get('/issues/map'),
  getById: (id) => api.get(`/issues/${id}`),
  getByRef: (refCode) => api.get(`/issues/ref/${refCode}`),
};

export const citizenAPI = {
  getDashboard: () => api.get('/citizen/dashboard'),
  getMyReports: () => api.get('/citizen/my-reports'),
  submitFeedback: (id, data) => api.post(`/citizen/issues/${id}/feedback`, data),
};

export const authorityAPI = {
  getDashboard: () => api.get('/authority/dashboard'),
  getAssigned: () => api.get('/authority/issues'),
  assignOfficer: (id, data) => api.post(`/authority/issues/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/authority/issues/${id}/status`, data),
  submitRepair: (id, formData) => api.post(`/authority/issues/${id}/repair`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  overrideAI: (id, data) => api.post(`/authority/issues/${id}/override`, data),
  mergeDuplicates: (primaryId, duplicateId) => api.post('/authority/issues/merge', null, {
    params: { primaryIssueId: primaryId, duplicateIssueId: duplicateId }
  }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  getOfficers: () => api.get('/admin/officers'),
  getAreas: () => api.get('/admin/areas'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export const notifAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
