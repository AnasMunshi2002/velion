import { authAPI } from "./api";
import { STORAGE_KEYS, USER_ROLES } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";

class AuthService {
  constructor() {
    this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    this.user = this.getStoredUser();
  }

  // Get stored user from localStorage
  getStoredUser() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  }

  // Store authentication data
  storeAuthData(token, user) {
    this.token = token;
    this.user = user;

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "true");
  }

  // Clear authentication data
  clearAuthData() {
    this.token = null;
    this.user = null;

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Check user role
  hasRole(role) {
    return this.user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    return roles.includes(this.user?.role);
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole(USER_ROLES.ADMIN);
  }

  // Check if user is knowledge champion
  isKnowledgeChampion() {
    return (
      this.user?.isKnowledgeChampion ||
      this.hasRole(USER_ROLES.KNOWLEDGE_CHAMPION)
    );
  }

  // Login with credentials
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      this.storeAuthData(response.token, response);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Demo login (for development)
  async demoLogin() {
    try {
      const response = await authAPI.demoLogin();
      this.storeAuthData(response.token, response);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      this.storeAuthData(response.token, response);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Logout
  async logout() {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user from server
  async getCurrentUserFromServer() {
    try {
      const response = await authAPI.getMe();
      this.user = response;
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await authAPI.refreshToken();
      this.token = response.token;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      return { success: true, token: response.token };
    } catch (error) {
      this.clearAuthData();
      return {
        success: false,
        error: "Session expired. Please login again.",
        details: error,
      };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Reset password
  async resetPassword(token, passwords) {
    try {
      await authAPI.resetPassword(token, passwords);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await authAPI.updateProfile(this.user.id, profileData);
      this.user = { ...this.user, ...response };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await authAPI.changePassword(this.user.id, {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await authAPI.uploadAvatar(this.user.id, formData);
      this.user = { ...this.user, avatar: response.avatarUrl };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        details: error,
      };
    }
  }

  // Get user permissions
  getPermissions() {
    const user = this.getCurrentUser();
    if (!user) return [];

    const permissions = [];

    // Base permissions for all authenticated users
    permissions.push("view_dashboard");
    permissions.push("view_documents");
    permissions.push("view_projects");
    permissions.push("view_profile");

    // Role-based permissions
    switch (user.role) {
      case USER_ROLES.ADMIN:
        permissions.push("manage_users");
        permissions.push("manage_system");
        permissions.push("view_analytics");
        permissions.push("manage_settings");
        break;
      case USER_ROLES.KNOWLEDGE_CHAMPION:
        permissions.push("validate_documents");
        permissions.push("manage_content");
        permissions.push("view_analytics");
        break;
      case USER_ROLES.MANAGER:
        permissions.push("manage_projects");
        permissions.push("view_team_analytics");
        break;
    }

    // Knowledge champion flag permissions
    if (user.isKnowledgeChampion) {
      permissions.push("validate_documents");
      permissions.push("curate_content");
    }

    return permissions;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getPermissions();
    return permissions.includes(permission);
  }

  // Validate token (check if still valid)
  async validateToken() {
    if (!this.token) {
      return { valid: false, reason: "No token" };
    }

    try {
      // Try to get current user - if it fails, token is invalid
      await this.getCurrentUserFromServer();
      return { valid: true };
    } catch (error) {
      return { valid: false, reason: getErrorMessage(error) };
    }
  }

  // Initialize authentication from storage
  initialize() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = this.getStoredUser();

    if (token && user) {
      this.token = token;
      this.user = user;
      return { authenticated: true, user };
    }

    return { authenticated: false, user: null };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
