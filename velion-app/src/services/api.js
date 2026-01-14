import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  verifyToken: () => api.get("/auth/verify"),
  refreshToken: () => api.post("/auth/refresh"),
};

export const documentAPI = {
  upload: (documentData) => api.post("/documents/upload", documentData),
  search: (params) => api.get("/documents/search", { params }),
  getById: (id) => api.get(`/documents/${id}`),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  getByUser: (userId) => api.get(`/documents/user/${userId}`),
  getRecent: (limit = 10) =>
    api.get("/documents/recent", { params: { limit } }),
  validate: (id, validationData) =>
    api.post(`/documents/${id}/validate`, validationData),
  getPendingValidations: (params) =>
    api.get("/documents/pending-validations", { params }),
  download: (id) =>
    api.get(`/documents/${id}/download`, { responseType: "blob" }),
};

export const searchAPI = {
  search: (params) => api.get("/search", { params }),
  advancedSearch: (params) => api.post("/search/advanced", params),
  suggest: (query) => api.get("/search/suggest", { params: { q: query } }),
  getFilters: () => api.get("/search/filters"),
};

export const graphAPI = {
  getGraph: (params) => api.get("/graph", { params }),
  findConnections: (params) => api.get("/graph/connections", { params }),
  getNodeDetails: (id, type) =>
    api.get(`/graph/nodes/${id}`, { params: { type } }),
  exportGraph: (format) =>
    api.get(`/graph/export`, { params: { format }, responseType: "blob" }),
};

export const workspaceAPI = {
  create: (workspaceData) => api.post("/workspaces", workspaceData),
  getAll: (params) => api.get("/workspaces", { params }),
  getById: (id) => api.get(`/workspaces/${id}`),
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  delete: (id) => api.delete(`/workspaces/${id}`),
  addMember: (workspaceId, memberData) =>
    api.post(`/workspaces/${workspaceId}/members`, memberData),
  removeMember: (workspaceId, userId) =>
    api.delete(`/workspaces/${workspaceId}/members/${userId}`),
  addDocument: (workspaceId, documentId) =>
    api.post(`/workspaces/${workspaceId}/documents/${documentId}`),
  removeDocument: (workspaceId, documentId) =>
    api.delete(`/workspaces/${workspaceId}/documents/${documentId}`),
  getActivity: (workspaceId) => api.get(`/workspaces/${workspaceId}/activity`),
};

export const analyticsAPI = {
  getDashboardData: (params) => api.get("/analytics/dashboard", { params }),
  getSkillGapAnalysis: (params) => api.get("/analytics/skill-gap", { params }),
  getUserEngagement: (params) =>
    api.get("/analytics/user-engagement", { params }),
  getDocumentAnalytics: (params) => api.get("/analytics/documents", { params }),
  getSystemHealth: () => api.get("/analytics/system-health"),
  generateReport: (reportType, params) =>
    api.post("/analytics/reports", { reportType, ...params }),
  exportReport: (reportId, format) =>
    api.get(`/analytics/reports/${reportId}/export`, {
      params: { format },
      responseType: "blob",
    }),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  updateAvatar: (avatarData) => api.post("/users/avatar", avatarData),
  changePassword: (passwordData) =>
    api.post("/users/change-password", passwordData),
  getNotifications: () => api.get("/users/notifications"),
  markNotificationRead: (notificationId) =>
    api.put(`/users/notifications/${notificationId}/read`),
  getActivityLog: (params) => api.get("/users/activity", { params }),
  searchUsers: (params) => api.get("/users/search", { params }),
};

export const settingsAPI = {
  getUserSettings: () => api.get("/settings/user"),
  updateUserSettings: (settings) => api.put("/settings/user", settings),
  getSystemSettings: () => api.get("/settings/system"),
  updateSystemSettings: (settings) => api.put("/settings/system", settings),
};

export default api;
