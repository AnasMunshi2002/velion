const axios = require("axios");

class DjangoService {
  constructor() {
    this.baseUrl = process.env.DJANGO_API_URL || "http://localhost:8000/api";
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // User operations
  async getUserByEmail(email) {
    try {
      const response = await this.client.get("/users/", { params: { email } });
      return response.data.results?.[0] || null;
    } catch (error) {
      console.error("Error fetching user by email:", error.message);
      return null;
    }
  }

  async getUserById(id) {
    try {
      const response = await this.client.get(`/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
      return null;
    }
  }

  async createUser(userData) {
    try {
      const response = await this.client.post("/users/", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  }

  // Document operations
  async createDocument(documentData) {
    try {
      const response = await this.client.post("/documents/", documentData);
      return response.data;
    } catch (error) {
      console.error("Error creating document:", error.message);
      throw error;
    }
  }

  async getDocumentById(id) {
    try {
      const response = await this.client.get(`/documents/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching document:", error.message);
      return null;
    }
  }

  async updateDocument(id, updates) {
    try {
      const response = await this.client.patch(`/documents/${id}/`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating document:", error.message);
      throw error;
    }
  }

  async searchDocuments(params) {
    try {
      const response = await this.client.get("/documents/search/", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching documents:", error.message);
      return { results: [], count: 0 };
    }
  }

  // Knowledge component operations
  async createKnowledgeComponent(componentData) {
    try {
      const response = await this.client.post(
        "/knowledge-components/",
        componentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating knowledge component:", error.message);
      throw error;
    }
  }

  async updateKnowledgeComponent(documentId, updates) {
    try {
      const response = await this.client.patch(
        `/knowledge-components/${documentId}/`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error("Error updating knowledge component:", error.message);
      throw error;
    }
  }

  // Workspace operations
  async createWorkspace(workspaceData) {
    try {
      const response = await this.client.post("/workspaces/", workspaceData);
      return response.data;
    } catch (error) {
      console.error("Error creating workspace:", error.message);
      throw error;
    }
  }

  async getWorkspaceById(id) {
    try {
      const response = await this.client.get(`/workspaces/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workspace:", error.message);
      return null;
    }
  }

  async addWorkspaceMember(membershipData) {
    try {
      const response = await this.client.post(
        "/workspace-memberships/",
        membershipData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding workspace member:", error.message);
      throw error;
    }
  }

  // Analytics operations
  async getDashboardStats(params) {
    try {
      const response = await this.client.get("/analytics/dashboard-stats/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error.message);
      return {};
    }
  }

  async getRecentDocuments(limit = 10) {
    try {
      const response = await this.client.get("/documents/recent/", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recent documents:", error.message);
      return [];
    }
  }

  // Validation operations
  async getPendingValidations(page = 1, limit = 20) {
    try {
      const response = await this.client.get(
        "/documents/pending-validations/",
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending validations:", error.message);
      return [];
    }
  }

  async recordValidationActivity(activityData) {
    try {
      const response = await this.client.post(
        "/validation-activities/",
        activityData
      );
      return response.data;
    } catch (error) {
      console.error("Error recording validation activity:", error.message);
      throw error;
    }
  }

  // Helper methods
  async authenticateUser(email, password) {
    try {
      // Temporary mock for testing
      if (email === "admin@example.com" && password === "password") {
        return {
          id: 1,
          email: "admin@example.com",
          first_name: "Admin",
          last_name: "User",
          role: "ADMIN",
          employee_id: "EMP001",
          profile_completion: 100,
        };
      }

      // Get JWT token from Django
      const tokenResponse = await this.client.post("/auth/token/", {
        email,
        password,
      });

      const { access } = tokenResponse.data;

      // Get user data using the token
      const userResponse = await this.client.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      return userResponse.data;
    } catch (error) {
      console.error("Authentication error:", error.message);
      return null;
    }
  }
}

module.exports = new DjangoService();
