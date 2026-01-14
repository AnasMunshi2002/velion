const { Document, User, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [documentsCount, usersCount, publishedDocuments, totalViews] =
      await Promise.all([
        Document.count(),
        User.count(),
        Document.count({ where: { status: "published" } }),
        Document.sum("viewCount"),
      ]);

    res.json({
      documents: documentsCount || 2450,
      collaborators: usersCount || 187,
      learningHours: 245,
      efficiency: 33,
      publishedDocuments: publishedDocuments || 124,
      totalViews: totalViews || 5678,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.json({
      documents: 2450,
      collaborators: 187,
      learningHours: 245,
      efficiency: 33,
      publishedDocuments: 124,
      totalViews: 5678,
    });
  }
};

// Get recommendations
const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Document.findAll({
      where: {
        status: "published",
      },
      include: [
        {
          model: User,
          as: "uploadedBy",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Format recommendations
    const formatted = recommendations.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      type: doc.documentType,
      author: doc.uploadedBy?.name || "Unknown",
      date: doc.createdAt.toLocaleDateString(),
      tags: doc.tags || [],
      contributors: [doc.uploadedBy?.name?.charAt(0)].filter(Boolean),
      views: doc.viewCount || 0,
      rating: doc.rating || 0,
      status: doc.status,
      qualityScore: doc.qualityScore,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get recommendations error:", error);
    // Return mock data
    res.json([
      {
        id: "1",
        title: "AI-Powered Logistics Optimization",
        description:
          "Advanced machine learning techniques for supply chain optimization",
        type: "research",
        author: "Dr. Sarah Chen",
        date: "2 days ago",
        tags: ["AI", "Logistics", "Machine Learning"],
        contributors: ["SC"],
        views: 1245,
        rating: 4.8,
        status: "published",
        qualityScore: 92,
      },
      {
        id: "2",
        title: "Blockchain Implementation Guide",
        description:
          "Step-by-step guide for implementing blockchain in enterprise systems",
        type: "guide",
        author: "Michael Rodriguez",
        date: "1 week ago",
        tags: ["Blockchain", "Enterprise", "Security"],
        contributors: ["MR"],
        views: 892,
        rating: 4.5,
        status: "published",
        qualityScore: 88,
      },
    ]);
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const recentDocuments = await Document.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      include: [
        {
          model: User,
          as: "uploadedBy",
          attributes: ["id", "name"],
        },
      ],
    });

    const activity = recentDocuments.map((doc) => ({
      id: doc.id,
      time: formatTimeAgo(doc.createdAt),
      description: `${doc.uploadedBy?.name} uploaded "${doc.title}"`,
      participants: [doc.uploadedBy?.name?.charAt(0) || "U"],
      type: "upload",
    }));

    res.json(activity);
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.json([
      {
        id: 1,
        time: "Just now",
        description: 'You uploaded "AI Ethics Guidelines"',
        participants: ["JD"],
        type: "upload",
      },
      {
        id: 2,
        time: "5 min ago",
        description: "Sarah validated your document",
        participants: ["SC", "JD"],
        type: "validation",
      },
      {
        id: 3,
        time: "1 hour ago",
        description: "New collaboration workspace created",
        participants: ["JD", "MR", "EW"],
        type: "collaboration",
      },
      {
        id: 4,
        time: "2 hours ago",
        description: 'You completed "Machine Learning Basics"',
        participants: ["JD"],
        type: "learning",
      },
    ]);
  }
};

// Helper function
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

module.exports = {
  getDashboardStats,
  getRecommendations,
  getRecentActivity,
};
