// Application Constants
export const APP_NAME = 'Velion DKN';
export const APP_VERSION = '2.4.1';
export const COMPANY_NAME = 'Velion Dynamics';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 10000;

// User Roles
export const USER_ROLES = {
  CONSULTANT: 'consultant',
  KNOWLEDGE_CHAMPION: 'knowledge_champion',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

export const ROLE_DISPLAY_NAMES = {
  consultant: 'Consultant',
  knowledge_champion: 'Knowledge Champion',
  manager: 'Manager',
  admin: 'Administrator',
};

// Document Status
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  REJECTED: 'rejected',
};

export const DOCUMENT_STATUS_COLORS = {
  draft: 'default',
  pending: 'warning',
  published: 'success',
  archived: 'default',
  rejected: 'error',
};

export const DOCUMENT_STATUS_DISPLAY = {
  draft: 'Draft',
  pending: 'Pending Review',
  published: 'Published',
  archived: 'Archived',
  rejected: 'Rejected',
};

// Document Types
export const DOCUMENT_TYPES = {
  RESEARCH: 'research',
  GUIDE: 'guide',
  CASE_STUDY: 'case_study',
  FRAMEWORK: 'framework',
  TEMPLATE: 'template',
  REPORT: 'report',
};

export const DOCUMENT_TYPE_DISPLAY = {
  research: 'Research Paper',
  guide: 'Guide',
  case_study: 'Case Study',
  framework: 'Framework',
  template: 'Template',
  report: 'Report',
};

// Knowledge Metric Types
export const METRIC_TYPES = {
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_VIEW: 'document_view',
  DOCUMENT_DOWNLOAD: 'document_download',
  COMMENT_ADDED: 'comment_added',
  WORKSPACE_CREATED: 'workspace_created',
  MICROLEARNING_COMPLETED: 'microlearning_completed',
  KNOWLEDGE_SHARED: 'knowledge_shared',
  VALIDATION_COMPLETED: 'validation_completed',
};

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const PROJECT_STATUS_DISPLAY = {
  planning: 'Planning',
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

// Region Codes
export const REGIONS = {
  EUROPE: 'Europe',
  NORTH_AMERICA: 'North America',
  ASIA: 'Asia',
  SOUTH_AMERICA: 'South America',
  AFRICA: 'Africa',
  AUSTRALIA: 'Australia',
  GLOBAL: 'Global',
};

// Departments
export const DEPARTMENTS = {
  TECHNOLOGY: 'Technology Consulting',
  AI_RESEARCH: 'AI Research',
  BLOCKCHAIN: 'Blockchain Solutions',
  LOGISTICS: 'Logistics',
  MANUFACTURING: 'Smart Manufacturing',
  RENEWABLE_ENERGY: 'Renewable Energy',
  IT: 'Information Technology',
};

// Skill Categories
export const SKILL_CATEGORIES = {
  TECHNICAL: 'Technical',
  BUSINESS: 'Business',
  SOFT_SKILLS: 'Soft Skills',
  DOMAIN: 'Domain Specific',
};

// Popular Skills
export const POPULAR_SKILLS = [
  'Machine Learning',
  'Artificial Intelligence',
  'Blockchain',
  'IoT',
  'Cloud Computing',
  'Data Analysis',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'DevOps',
  'Cybersecurity',
  'Project Management',
  'Agile Methodologies',
  'Business Analysis',
  'Logistics',
  'Supply Chain',
  'Manufacturing',
  'Renewable Energy',
  'Compliance',
  'GDPR',
  'Data Privacy',
];

// Microlearning Formats
export const MICROLEARNING_FORMATS = {
  VIDEO: 'video',
  ARTICLE: 'article',
  QUIZ: 'quiz',
  INTERACTIVE: 'interactive',
};

export const MICROLEARNING_FORMAT_DISPLAY = {
  video: 'Video',
  article: 'Article',
  quiz: 'Quiz',
  interactive: 'Interactive',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const DIFFICULTY_DISPLAY = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  VALIDATION: 'validation',
  COLLABORATION: 'collaboration',
  LEARNING: 'learning',
  ACHIEVEMENT: 'achievement',
};

// Knowledge Points
export const KNOWLEDGE_POINTS = {
  DOCUMENT_UPLOAD: 50,
  DOCUMENT_VALIDATION: 30,
  DOCUMENT_VIEW: 1,
  DOCUMENT_DOWNLOAD: 2,
  COMMENT_ADDED: 5,
  WORKSPACE_CREATED: 25,
  MICROLEARNING_COMPLETED: 10,
  KNOWLEDGE_SHARED: 15,
};

// Time Constants
export const TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 25, 50, 100],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  ALLOWED_EXTENSIONS: [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
    '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif'
  ],
};

// Colors for Charts
export const CHART_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#9c27b0',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#00bcd4',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'dkn_token',
  USER_DATA: 'dkn_user',
  AUTH_STATUS: 'dkn_auth',
  THEME_MODE: 'dkn_theme',
  RECENT_SEARCHES: 'dkn_recent_searches',
  USER_PREFERENCES: 'dkn_preferences',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_REGEX: /^[a-zA-Z0-9_.-]*$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  FILE_TOO_LARGE: 'File size exceeds the limit of 50MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTER_SUCCESS: 'Registration successful!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully.',
  DOCUMENT_UPDATED: 'Document updated successfully.',
  DOCUMENT_DELETED: 'Document deleted successfully.',
  DOCUMENT_VALIDATED: 'Document validated successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'DD MMM YYYY',
  DISPLAY_DATETIME: 'DD MMM YYYY, HH:mm',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
  RELATIVE_TIME: 'relative',
};