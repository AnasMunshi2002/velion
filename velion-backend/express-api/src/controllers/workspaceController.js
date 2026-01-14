const DjangoService = require("../services/djangoService");

class WorkspaceController {
  async createWorkspace(req, res) {
    try {
      const {
        name,
        description,
        workspaceType,
        projectId,
        members,
        tags,
        isPrivate,
      } = req.body;
      const createdBy = req.user.userId;

      // Validate project if provided
      if (projectId) {
        const project = await DjangoService.getProjectById(projectId);
        if (!project) {
          return res.status(404).json({
            success: false,
            error: "Project not found",
          });
        }
      }

      // Create workspace
      const workspaceData = {
        name,
        description,
        workspace_type: workspaceType,
        project: projectId,
        created_by: createdBy,
        is_private: isPrivate || false,
        tags: tags || [],
      };

      const workspace = await DjangoService.createWorkspace(workspaceData);

      // Add creator as owner
      await DjangoService.addWorkspaceMember({
        workspace: workspace.id,
        person: createdBy,
        role: "OWNER",
      });

      // Add other members
      if (members && members.length > 0) {
        await Promise.all(
          members.map((memberId) =>
            DjangoService.addWorkspaceMember({
              workspace: workspace.id,
              person: memberId,
              role: "MEMBER",
            })
          )
        );
      }

      // Get populated workspace
      const populatedWorkspace = await DjangoService.getWorkspaceById(
        workspace.id
      );

      res.status(201).json({
        success: true,
        data: populatedWorkspace,
        message: "Workspace created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getWorkspace(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const workspace = await DjangoService.getWorkspaceById(id);

      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: "Workspace not found",
        });
      }

      // Check access for private workspaces
      if (workspace.is_private) {
        const membership = await DjangoService.getWorkspaceMembership(
          id,
          userId
        );
        if (!membership) {
          return res.status(403).json({
            success: false,
            error: "Access denied to private workspace",
          });
        }
      }

      // Get workspace activity
      const activity = await this.getWorkspaceActivity(id);
      const documents = await DjangoService.getWorkspaceDocuments(id);
      const members = await DjangoService.getWorkspaceMembers(id);

      res.status(200).json({
        success: true,
        data: {
          ...workspace,
          activity,
          documents,
          members,
          statistics: await this.getWorkspaceStatistics(id),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getWorkspaceActivity(workspaceId, limit = 20) {
    const activities = [];

    // Get recent document uploads
    const recentDocuments = await DjangoService.getRecentWorkspaceDocuments(
      workspaceId,
      limit
    );
    recentDocuments.forEach((doc) => {
      activities.push({
        type: "DOCUMENT_UPLOAD",
        timestamp: doc.created_at,
        user: doc.uploader,
        document: doc,
        message: `${doc.uploader.first_name} uploaded "${doc.title}"`,
      });
    });

    // Get recent comments
    const recentComments = await DjangoService.getRecentWorkspaceComments(
      workspaceId,
      limit
    );
    recentComments.forEach((comment) => {
      activities.push({
        type: "COMMENT",
        timestamp: comment.created_at,
        user: comment.author,
        comment: comment,
        message: `${comment.author.first_name} commented on a document`,
      });
    });

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  async getWorkspaceStatistics(workspaceId) {
    const documents = await DjangoService.getWorkspaceDocuments(workspaceId);
    const members = await DjangoService.getWorkspaceMembers(workspaceId);

    return {
      totalDocuments: documents.length,
      totalMembers: members.length,
      activeMembers: members.filter(
        (m) => m.last_activity > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      storageUsed: documents.reduce(
        (sum, doc) => sum + (doc.file_size || 0),
        0
      ),
      documentTypes: this.calculateDocumentTypes(documents),
      activityTrend: await this.getActivityTrend(workspaceId),
    };
  }

  calculateDocumentTypes(documents) {
    const types = {};
    documents.forEach((doc) => {
      const type = doc.document_type || "OTHER";
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  async getActivityTrend(workspaceId, days = 30) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const activityCount = await DjangoService.getActivityCount(
        workspaceId,
        startOfDay,
        endOfDay
      );

      trends.push({
        date: startOfDay.toISOString().split("T")[0],
        count: activityCount,
      });
    }

    return trends;
  }

  async addDocumentToWorkspace(req, res) {
    try {
      const { workspaceId, documentId } = req.params;
      const userId = req.user.userId;

      // Check workspace access
      const membership = await DjangoService.getWorkspaceMembership(
        workspaceId,
        userId
      );
      if (
        !membership ||
        !["OWNER", "ADMIN", "MEMBER"].includes(membership.role)
      ) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
        });
      }

      // Check document exists
      const document = await DjangoService.getDocumentById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          error: "Document not found",
        });
      }

      // Add document to workspace
      await DjangoService.addDocumentToWorkspace(workspaceId, documentId);

      // Record activity
      await DjangoService.recordWorkspaceActivity({
        workspace: workspaceId,
        user: userId,
        activity_type: "DOCUMENT_ADDED",
        details: {
          documentId,
          documentTitle: document.title,
        },
      });

      res.status(200).json({
        success: true,
        message: "Document added to workspace",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async inviteToWorkspace(req, res) {
    try {
      const { workspaceId } = req.params;
      const { userIds, role = "MEMBER" } = req.body;
      const inviterId = req.user.userId;

      // Check inviter permissions
      const inviterMembership = await DjangoService.getWorkspaceMembership(
        workspaceId,
        inviterId
      );
      if (
        !inviterMembership ||
        !["OWNER", "ADMIN"].includes(inviterMembership.role)
      ) {
        return res.status(403).json({
          success: false,
          error: "Only owners and admins can invite members",
        });
      }

      const results = await Promise.allSettled(
        userIds.map(async (userId) => {
          // Check if already a member
          const existing = await DjangoService.getWorkspaceMembership(
            workspaceId,
            userId
          );
          if (existing) {
            return { userId, status: "already_member" };
          }

          // Add member
          await DjangoService.addWorkspaceMember({
            workspace: workspaceId,
            person: userId,
            role: role,
          });

          // Send notification
          await this.sendInvitationNotification(workspaceId, userId, inviterId);

          return { userId, status: "invited" };
        })
      );

      const summary = {
        total: results.length,
        invited: results.filter((r) => r.value?.status === "invited").length,
        already_member: results.filter(
          (r) => r.value?.status === "already_member"
        ).length,
        failed: results.filter((r) => r.status === "rejected").length,
      };

      res.status(200).json({
        success: true,
        data: summary,
        message: `Invited ${summary.invited} new members to workspace`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async sendInvitationNotification(workspaceId, userId, inviterId) {
    // Implementation for sending notification
    // Could be email, in-app notification, etc.
    const workspace = await DjangoService.getWorkspaceById(workspaceId);
    const inviter = await DjangoService.getUserById(inviterId);

    console.log(
      `Notification: ${inviter.first_name} invited you to join workspace "${workspace.name}"`
    );
  }
}

module.exports = new WorkspaceController();
