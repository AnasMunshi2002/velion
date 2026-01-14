// Mock data for development and testing
import {
  DOCUMENT_STATUS,
  DOCUMENT_TYPES,
  PROJECT_STATUS,
  MICROLEARNING_FORMATS,
  DIFFICULTY_LEVELS,
  REGIONS,
  DEPARTMENTS,
} from "../utils/constants";

// Mock Users
export const mockUsers = [
  {
    id: "1",
    name: "Anas Munshi",
    email: "anas.munshi@velion.com",
    role: "consultant",
    department: DEPARTMENTS.TECHNOLOGY,
    region: REGIONS.EUROPE,
    avatar: "https://i.pravatar.cc/150?img=1",
    isKnowledgeChampion: true,
    knowledgePoints: 2450,
    joinDate: "2022-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@velion.com",
    role: "knowledge_champion",
    department: DEPARTMENTS.AI_RESEARCH,
    region: REGIONS.ASIA,
    avatar: "https://i.pravatar.cc/150?img=2",
    isKnowledgeChampion: true,
    knowledgePoints: 3450,
    joinDate: "2021-08-20",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael.r@velion.com",
    role: "consultant",
    department: DEPARTMENTS.BLOCKCHAIN,
    region: REGIONS.NORTH_AMERICA,
    avatar: "https://i.pravatar.cc/150?img=3",
    isKnowledgeChampion: false,
    knowledgePoints: 2980,
    joinDate: "2022-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@velion.com",
    role: "manager",
    department: DEPARTMENTS.MANUFACTURING,
    region: REGIONS.EUROPE,
    avatar: "https://i.pravatar.cc/150?img=4",
    isKnowledgeChampion: true,
    knowledgePoints: 2670,
    joinDate: "2021-11-05",
    status: "active",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@velion.com",
    role: "consultant",
    department: DEPARTMENTS.LOGISTICS,
    region: REGIONS.ASIA,
    avatar: "https://i.pravatar.cc/150?img=5",
    isKnowledgeChampion: false,
    knowledgePoints: 2310,
    joinDate: "2022-06-15",
    status: "active",
  },
];

// Mock Documents
export const mockDocuments = [
  {
    id: "1",
    title: "AI-Powered Logistics Optimization",
    description:
      "Advanced machine learning techniques for supply chain optimization",
    content:
      "This research paper explores the application of machine learning algorithms in logistics optimization...",
    documentType: DOCUMENT_TYPES.RESEARCH,
    status: DOCUMENT_STATUS.PUBLISHED,
    qualityScore: 92,
    uploadedById: "1",
    validatedById: "2",
    projectId: "1",
    tags: [
      "AI",
      "Machine Learning",
      "Logistics",
      "Supply Chain",
      "Optimization",
    ],
    language: "en",
    downloadCount: 124,
    viewCount: 567,
    rating: 4.8,
    blockchainHash: "0x1234567890abcdef",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "2",
    title: "Blockchain Implementation Guide",
    description:
      "Step-by-step guide for implementing blockchain in enterprise systems",
    content:
      "This guide provides comprehensive instructions for implementing blockchain technology...",
    documentType: DOCUMENT_TYPES.GUIDE,
    status: DOCUMENT_STATUS.PUBLISHED,
    qualityScore: 88,
    uploadedById: "3",
    validatedById: "1",
    projectId: "2",
    tags: ["Blockchain", "Enterprise", "Guide", "Security", "Implementation"],
    language: "en",
    downloadCount: 89,
    viewCount: 321,
    rating: 4.6,
    blockchainHash: "0xfedcba0987654321",
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-05T11:20:00Z",
  },
  {
    id: "3",
    title: "Smart Manufacturing Case Study",
    description: "Case study of IoT implementation in automotive manufacturing",
    content:
      "This case study examines the implementation of IoT technology in a leading automotive manufacturing plant...",
    documentType: DOCUMENT_TYPES.CASE_STUDY,
    status: DOCUMENT_STATUS.PUBLISHED,
    qualityScore: 85,
    uploadedById: "4",
    validatedById: "2",
    projectId: "2",
    tags: ["IoT", "Manufacturing", "Case Study", "Automotive", "Industry 4.0"],
    language: "en",
    downloadCount: 67,
    viewCount: 245,
    rating: 4.7,
    createdAt: "2024-02-10T14:30:00Z",
    updatedAt: "2024-02-15T16:45:00Z",
  },
  {
    id: "4",
    title: "GDPR Compliance Framework 2024",
    description:
      "Updated framework for GDPR compliance in multinational organizations",
    content:
      "This framework provides guidelines for ensuring GDPR compliance across multiple jurisdictions...",
    documentType: DOCUMENT_TYPES.FRAMEWORK,
    status: DOCUMENT_STATUS.PENDING,
    qualityScore: 75,
    uploadedById: "2",
    validatedById: null,
    projectId: "1",
    tags: ["GDPR", "Compliance", "Legal", "Framework", "Data Privacy"],
    language: "en",
    downloadCount: 45,
    viewCount: 123,
    rating: 4.5,
    createdAt: "2024-02-18T11:00:00Z",
    updatedAt: "2024-02-18T11:00:00Z",
  },
  {
    id: "5",
    title: "Project Management Template Suite",
    description: "Comprehensive templates for project management processes",
    content:
      "This template suite includes documents for project initiation, planning, execution, and closure...",
    documentType: DOCUMENT_TYPES.TEMPLATE,
    status: DOCUMENT_STATUS.DRAFT,
    qualityScore: 65,
    uploadedById: "1",
    validatedById: null,
    projectId: null,
    tags: ["Project Management", "Templates", "Process", "Documentation"],
    language: "en",
    downloadCount: 23,
    viewCount: 89,
    rating: 4.3,
    createdAt: "2024-02-20T16:45:00Z",
    updatedAt: "2024-02-20T16:45:00Z",
  },
];

// Mock Projects
export const mockProjects = [
  {
    id: "1",
    name: "AI-Powered Logistics Optimization",
    description:
      "Advanced machine learning techniques for supply chain optimization",
    client: "Global Logistics Inc.",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: PROJECT_STATUS.ACTIVE,
    budget: 250000,
    region: REGIONS.GLOBAL,
    skillsRequired: [
      "Machine Learning",
      "Python",
      "Logistics",
      "Data Analysis",
      "Cloud Computing",
    ],
    memberIds: ["1", "2", "3"],
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Smart Manufacturing Implementation",
    description: "IoT and AI implementation in automotive manufacturing",
    client: "AutoTech Motors",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    status: PROJECT_STATUS.ACTIVE,
    budget: 180000,
    region: REGIONS.EUROPE,
    skillsRequired: [
      "IoT",
      "AI",
      "Manufacturing",
      "Automation",
      "Data Analytics",
    ],
    memberIds: ["1", "4", "5"],
    createdAt: "2024-01-25T11:30:00Z",
    updatedAt: "2024-02-20T10:15:00Z",
  },
  {
    id: "3",
    name: "Renewable Energy Grid Integration",
    description:
      "Integration of renewable energy sources into existing power grids",
    client: "Energy Solutions Corp.",
    startDate: "2023-11-01",
    endDate: "2024-04-30",
    status: PROJECT_STATUS.COMPLETED,
    budget: 320000,
    region: REGIONS.NORTH_AMERICA,
    skillsRequired: [
      "Renewable Energy",
      "Grid Management",
      "Power Systems",
      "Data Analysis",
    ],
    memberIds: ["2", "3", "5"],
    createdAt: "2023-10-15T08:45:00Z",
    updatedAt: "2024-02-28T16:20:00Z",
  },
];

// Mock Workspaces
export const mockWorkspaces = [
  {
    id: "1",
    name: "Logistics AI Research",
    description: "Collaboration space for logistics optimization project",
    projectId: "1",
    projectContext: "AI-Powered Logistics Optimization",
    isActive: true,
    isPrivate: false,
    memberIds: ["1", "2", "3"],
    aiSuggestedMembers: ["4"],
    settings: {
      allowGuestAccess: false,
      notificationFrequency: "daily",
      documentReviewRequired: true,
    },
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-02-25T15:30:00Z",
  },
  {
    id: "2",
    name: "Smart Manufacturing Team",
    description: "Workspace for manufacturing project collaboration",
    projectId: "2",
    projectContext: "Smart Manufacturing Implementation",
    isActive: true,
    isPrivate: false,
    memberIds: ["1", "4", "5"],
    aiSuggestedMembers: ["2"],
    settings: {
      allowGuestAccess: true,
      notificationFrequency: "realtime",
      documentReviewRequired: false,
    },
    createdAt: "2024-02-05T14:20:00Z",
    updatedAt: "2024-02-22T11:45:00Z",
  },
];

// Mock Comments
export const mockComments = [
  {
    id: "1",
    content: "Great research! The machine learning approach is well-explained.",
    userId: "2",
    documentId: "1",
    sentimentScore: 0.9,
    mentions: ["1"],
    isEdited: false,
    createdAt: "2024-01-16T11:30:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "2",
    content: "Could you add more details about the data preprocessing steps?",
    userId: "3",
    documentId: "1",
    sentimentScore: 0.7,
    mentions: ["1"],
    isEdited: false,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "3",
    content:
      "The blockchain security section needs updating with latest threats.",
    userId: "1",
    documentId: "2",
    sentimentScore: 0.6,
    mentions: ["3"],
    isEdited: true,
    createdAt: "2024-02-02T16:45:00Z",
    updatedAt: "2024-02-03T10:20:00Z",
  },
];

// Mock Microlearning Modules
export const mockMicrolearningModules = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description:
      "Learn the fundamentals of machine learning concepts and algorithms",
    content:
      "This module covers basic ML concepts including supervised and unsupervised learning...",
    duration: 15,
    format: MICROLEARNING_FORMATS.VIDEO,
    topic: "Machine Learning",
    relatedSkills: ["Machine Learning", "AI", "Data Science"],
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    completionCount: 245,
    averageRating: 4.7,
    isPublished: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Blockchain Fundamentals",
    description: "Understanding blockchain technology and its applications",
    content:
      "Learn about blockchain architecture, consensus mechanisms, and smart contracts...",
    duration: 20,
    format: MICROLEARNING_FORMATS.ARTICLE,
    topic: "Blockchain",
    relatedSkills: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    completionCount: 189,
    averageRating: 4.5,
    isPublished: true,
    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-02-18T10:15:00Z",
  },
  {
    id: "3",
    title: "GDPR Compliance Quiz",
    description:
      "Test your knowledge of GDPR regulations and compliance requirements",
    content:
      "Interactive quiz covering key GDPR principles, data subject rights, and compliance obligations...",
    duration: 10,
    format: MICROLEARNING_FORMATS.QUIZ,
    topic: "Compliance",
    relatedSkills: ["GDPR", "Compliance", "Data Privacy"],
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    completionCount: 156,
    averageRating: 4.3,
    isPublished: true,
    createdAt: "2024-01-20T14:45:00Z",
    updatedAt: "2024-02-15T16:20:00Z",
  },
  {
    id: "4",
    title: "Advanced IoT Security",
    description: "Advanced security practices for IoT device implementation",
    content:
      "Learn about IoT security threats, vulnerabilities, and best practices for securing IoT networks...",
    duration: 25,
    format: MICROLEARNING_FORMATS.INTERACTIVE,
    topic: "IoT Security",
    relatedSkills: ["IoT", "Cybersecurity", "Network Security"],
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    completionCount: 89,
    averageRating: 4.6,
    isPublished: true,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-25T11:45:00Z",
  },
];

// Mock Knowledge Metrics
export const mockKnowledgeMetrics = [
  {
    id: "1",
    metricType: "document_upload",
    value: 50,
    userId: "1",
    entityId: "1",
    entityType: "document",
    metadata: { qualityScore: 92, wordCount: 1500 },
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    metricType: "document_view",
    value: 1,
    userId: "2",
    entityId: "1",
    entityType: "document",
    metadata: { duration: 300 },
    createdAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "3",
    metricType: "microlearning_completed",
    value: 10,
    userId: "1",
    entityId: "1",
    entityType: "microlearning",
    metadata: { difficulty: "beginner", score: 95 },
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "4",
    metricType: "knowledge_shared",
    value: 15,
    userId: "2",
    entityId: "1",
    entityType: "document",
    metadata: { shares: 5, comments: 3 },
    createdAt: "2024-01-20T09:45:00Z",
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: "1",
    type: "validation",
    title: "Document Requires Validation",
    message:
      'New document "GDPR Compliance Framework 2024" requires your validation',
    userId: "2",
    read: false,
    metadata: { documentId: "4" },
    createdAt: "2024-02-18T11:00:00Z",
  },
  {
    id: "2",
    type: "collaboration",
    title: "New Collaboration Request",
    message: 'Sarah Chen invited you to join "Logistics AI Research" workspace',
    userId: "1",
    read: false,
    metadata: { workspaceId: "1" },
    createdAt: "2024-02-25T15:30:00Z",
  },
  {
    id: "3",
    type: "learning",
    title: "Learning Recommendation",
    message:
      'Based on your interests, we recommend "Advanced IoT Security" module',
    userId: "1",
    read: true,
    metadata: { moduleId: "4" },
    createdAt: "2024-02-26T10:15:00Z",
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked!",
    message:
      'You earned the "Knowledge Pioneer" badge for uploading 10 documents',
    userId: "1",
    read: true,
    metadata: { badge: "knowledge_pioneer" },
    createdAt: "2024-02-27T14:45:00Z",
  },
];

// Mock Analytics Data
export const mockAnalyticsData = {
  monthlyUploads: [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 22 },
    { month: "May", count: 25 },
    { month: "Jun", count: 30 },
  ],
  userActivity: [
    { day: "Mon", active: 120 },
    { day: "Tue", active: 145 },
    { day: "Wed", active: 130 },
    { day: "Thu", active: 160 },
    { day: "Fri", active: 140 },
    { day: "Sat", active: 80 },
    { day: "Sun", active: 60 },
  ],
  documentTypes: [
    { type: "Research", count: 45 },
    { type: "Guide", count: 32 },
    { type: "Case Study", count: 28 },
    { type: "Framework", count: 19 },
    { type: "Template", count: 15 },
    { type: "Report", count: 22 },
  ],
  regionalDistribution: [
    { region: "Europe", count: 85 },
    { region: "North America", count: 72 },
    { region: "Asia", count: 68 },
    { region: "South America", count: 34 },
    { region: "Australia", count: 21 },
    { region: "Africa", count: 15 },
  ],
  skillGaps: [
    { skill: "Machine Learning", required: 45, available: 32, gap: 13 },
    { skill: "Blockchain", required: 38, available: 25, gap: 13 },
    { skill: "IoT Security", required: 42, available: 30, gap: 12 },
    { skill: "GDPR Compliance", required: 35, available: 28, gap: 7 },
    { skill: "Cloud Architecture", required: 40, available: 35, gap: 5 },
  ],
  leaderboard: [
    { rank: 1, name: "Sarah Chen", points: 3450, change: "+2" },
    { rank: 2, name: "Michael Rodriguez", points: 2980, change: "+1" },
    { rank: 3, name: "Emma Wilson", points: 2670, change: "+3" },
    { rank: 4, name: "Anas Munshi", points: 2450, change: "0" },
    { rank: 5, name: "David Kim", points: 2310, change: "-2" },
  ],
};

// Mock Knowledge Graph Data
export const mockKnowledgeGraphData = {
  nodes: [
    { id: "1", type: "document", label: "AI Logistics", group: "document" },
    { id: "2", type: "document", label: "Blockchain Guide", group: "document" },
    { id: "3", type: "person", label: "Anas Munshi", group: "person" },
    { id: "4", type: "person", label: "Sarah Chen", group: "person" },
    { id: "5", type: "project", label: "Logistics AI", group: "project" },
    {
      id: "6",
      type: "project",
      label: "Smart Manufacturing",
      group: "project",
    },
    { id: "7", type: "skill", label: "Machine Learning", group: "skill" },
    { id: "8", type: "skill", label: "Blockchain", group: "skill" },
    { id: "9", type: "topic", label: "AI", group: "topic" },
    { id: "10", type: "topic", label: "Security", group: "topic" },
  ],
  links: [
    { source: "1", target: "3", type: "created" },
    { source: "1", target: "4", type: "validated" },
    { source: "1", target: "5", type: "belongs_to" },
    { source: "1", target: "7", type: "requires" },
    { source: "1", target: "9", type: "related_to" },
    { source: "2", target: "3", type: "validated" },
    { source: "2", target: "6", type: "belongs_to" },
    { source: "2", target: "8", type: "requires" },
    { source: "2", target: "10", type: "related_to" },
    { source: "3", target: "4", type: "collaborates" },
    { source: "3", target: "7", type: "has_skill" },
    { source: "4", target: "7", type: "has_skill" },
    { source: "4", target: "8", type: "has_skill" },
    { source: "5", target: "6", type: "related" },
    { source: "7", target: "9", type: "subcategory" },
    { source: "8", target: "10", type: "related_to" },
  ],
};

// Helper functions to get enriched data
export const getEnrichedDocuments = () => {
  return mockDocuments.map((doc) => ({
    ...doc,
    uploadedBy: mockUsers.find((u) => u.id === doc.uploadedById),
    validatedBy: doc.validatedById
      ? mockUsers.find((u) => u.id === doc.validatedById)
      : null,
    project: doc.projectId
      ? mockProjects.find((p) => p.id === doc.projectId)
      : null,
  }));
};

export const getEnrichedProjects = () => {
  return mockProjects.map((project) => ({
    ...project,
    members: mockUsers.filter((u) => project.memberIds.includes(u.id)),
    documents: mockDocuments.filter((d) => d.projectId === project.id),
  }));
};

export const getEnrichedWorkspaces = () => {
  return mockWorkspaces.map((workspace) => ({
    ...workspace,
    project: mockProjects.find((p) => p.id === workspace.projectId),
    members: mockUsers.filter((u) => workspace.memberIds.includes(u.id)),
  }));
};

export const getEnrichedComments = () => {
  return mockComments.map((comment) => ({
    ...comment,
    user: mockUsers.find((u) => u.id === comment.userId),
    document: mockDocuments.find((d) => d.id === comment.documentId),
  }));
};

export const getUserProgress = (userId) => {
  const userMetrics = mockKnowledgeMetrics.filter((m) => m.userId === userId);
  const completedModules = userMetrics
    .filter((m) => m.metricType === "microlearning_completed")
    .map((m) => m.entityId);

  return {
    totalPoints: userMetrics.reduce((sum, m) => sum + m.value, 0),
    completedModules: completedModules.length,
    uploadedDocuments: mockDocuments.filter((d) => d.uploadedById === userId)
      .length,
    validatedDocuments: mockDocuments.filter((d) => d.validatedById === userId)
      .length,
    moduleProgress: mockMicrolearningModules.map((module) => ({
      ...module,
      completed: completedModules.includes(module.id),
      progress: completedModules.includes(module.id) ? 100 : 0,
    })),
  };
};

// Data export
export default {
  users: mockUsers,
  documents: mockDocuments,
  projects: mockProjects,
  workspaces: mockWorkspaces,
  comments: mockComments,
  microlearning: mockMicrolearningModules,
  metrics: mockKnowledgeMetrics,
  notifications: mockNotifications,
  analytics: mockAnalyticsData,
  knowledgeGraph: mockKnowledgeGraphData,

  // Helper methods
  getEnrichedDocuments,
  getEnrichedProjects,
  getEnrichedWorkspaces,
  getEnrichedComments,
  getUserProgress,
};
