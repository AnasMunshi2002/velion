import {
  DOCUMENT_STATUS_DISPLAY,
  DOCUMENT_TYPE_DISPLAY,
  PROJECT_STATUS_DISPLAY,
  MICROLEARNING_FORMAT_DISPLAY,
  DIFFICULTY_DISPLAY,
  ROLE_DISPLAY_NAMES,
  REGIONS,
  DEPARTMENTS,
  DATE_FORMATS,
  KNOWLEDGE_POINTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
} from "./constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Format date for display
export const formatDate = (date, format = DATE_FORMATS.DISPLAY_DATE) => {
  if (!date) return "N/A";

  if (format === DATE_FORMATS.RELATIVE_TIME) {
    return dayjs(date).fromNow();
  }

  return dayjs(date).format(format);
};

// Format date time
export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATETIME);
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Get status display text
export const getStatusDisplay = (status, type = "document") => {
  switch (type) {
    case "document":
      return DOCUMENT_STATUS_DISPLAY[status] || status;
    case "project":
      return PROJECT_STATUS_DISPLAY[status] || status;
    default:
      return status;
  }
};

// Get type display text
export const getTypeDisplay = (type, category = "document") => {
  switch (category) {
    case "document":
      return DOCUMENT_TYPE_DISPLAY[type] || type;
    case "microlearning":
      return MICROLEARNING_FORMAT_DISPLAY[type] || type;
    case "difficulty":
      return DIFFICULTY_DISPLAY[type] || type;
    default:
      return type;
  }
};

// Get role display text
export const getRoleDisplay = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

// Generate excerpt from content
export const generateExcerpt = (content, wordCount = 20) => {
  if (!content) return "";

  const words = content.split(" ");
  if (words.length <= wordCount) return content;

  return words.slice(0, wordCount).join(" ") + "...";
};

// Calculate reading time
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 0;

  const wordCount = content.split(" ").length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate email
export const isValidEmail = (email) => {
  return VALIDATION_RULES.EMAIL.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    };
  }

  return { valid: true, message: "" };
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Safe parse JSON
export const safeParseJSON = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate knowledge points for action
export const calculateKnowledgePoints = (actionType, metadata = {}) => {
  const basePoints = KNOWLEDGE_POINTS[actionType] || 0;

  // Add bonus points based on metadata
  let bonus = 0;

  switch (actionType) {
    case "document_upload":
      if (metadata.qualityScore > 80) bonus += 20;
      if (metadata.wordCount > 1000) bonus += 10;
      break;
    case "microlearning_completed":
      if (metadata.difficulty === "advanced") bonus += 5;
      break;
    case "validation_completed":
      if (metadata.feedbackScore > 4) bonus += 10;
      break;
  }

  return basePoints + bonus;
};

// Get region options
export const getRegionOptions = () => {
  return Object.values(REGIONS).map((region) => ({
    value: region,
    label: region,
  }));
};

// Get department options
export const getDepartmentOptions = () => {
  return Object.values(DEPARTMENTS).map((dept) => ({
    value: dept,
    label: dept,
  }));
};

// Get skill options
export const getSkillOptions = (skills = []) => {
  return skills.map((skill) => ({
    value: skill,
    label: skill,
  }));
};

// Filter array by search term
export const filterBySearch = (
  items,
  searchTerm,
  fields = ["name", "title", "description"]
) => {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => item[field]?.toLowerCase().includes(term))
  );
};

// Sort array by field
export const sortByField = (items, field, direction = "asc") => {
  return [...items].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle dates
    if (field.includes("Date") || field.includes("At")) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Handle strings
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Paginate array
export const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: items.slice(startIndex, endIndex),
    page,
    limit,
    total: items.length,
    totalPages: Math.ceil(items.length / limit),
    hasNext: endIndex < items.length,
    hasPrevious: page > 1,
  };
};

// Create query string from object
export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  return searchParams.toString();
};

// Parse query string to object
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};

// Get error message from error object
export const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;

  return ERROR_MESSAGES.SERVER_ERROR;
};

// Delay function
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate random color
export const getRandomColor = () => {
  const colors = [
    "#1976d2",
    "#9c27b0",
    "#4caf50",
    "#ff9800",
    "#f44336",
    "#00bcd4",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#009688",
    "#ff5722",
    "#795548",
    "#607d8b",
    "#e91e63",
    "#8bc34a",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Get avatar URL
export const getAvatarUrl = (name, size = 150) => {
  const initials = getUserInitials(name);
  const color = getRandomColor().replace("#", "");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=${color}&color=fff&size=${size}`;
};
