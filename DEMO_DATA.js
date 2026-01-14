// DEMO DATA FOR VELION
// Copy this into your database after deployment for instant sample data

const DEMO_USERS = [
  {
    id: "user-1",
    email: "demo@velion.app",
    name: "Demo User",
    password: "hashed-password-123",
    createdAt: "2026-01-14"
  }
];

const DEMO_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Artificial Intelligence Fundamentals",
    content: "Introduction to AI concepts, machine learning, and neural networks",
    userId: "user-1",
    uploadDate: "2026-01-14",
    fileSize: "2.5MB"
  },
  {
    id: "doc-2",
    title: "Web Development Best Practices",
    content: "Modern web development techniques using React, Node.js, and PostgreSQL",
    userId: "user-1",
    uploadDate: "2026-01-13",
    fileSize: "1.8MB"
  },
  {
    id: "doc-3",
    title: "Knowledge Graph Construction",
    content: "Building and querying knowledge graphs with Neo4j and semantic relationships",
    userId: "user-1",
    uploadDate: "2026-01-12",
    fileSize: "3.2MB"
  }
];

const DEMO_KNOWLEDGE_ENTITIES = [
  {
    id: "entity-1",
    name: "Artificial Intelligence",
    type: "Concept",
    description: "Machine intelligence that mimics human cognition",
    relatedDocuments: ["doc-1"]
  },
  {
    id: "entity-2",
    name: "Machine Learning",
    type: "Concept",
    description: "Subset of AI focused on learning from data",
    relatedDocuments: ["doc-1"]
  },
  {
    id: "entity-3",
    name: "Neural Networks",
    type: "Technology",
    description: "Computing systems inspired by biological neurons",
    relatedDocuments: ["doc-1"]
  },
  {
    id: "entity-4",
    name: "React",
    type: "Framework",
    description: "JavaScript library for building user interfaces",
    relatedDocuments: ["doc-2"]
  },
  {
    id: "entity-5",
    name: "PostgreSQL",
    type: "Database",
    description: "Relational database management system",
    relatedDocuments: ["doc-2", "doc-3"]
  }
];

const DEMO_RELATIONSHIPS = [
  {
    source: "entity-1",
    target: "entity-2",
    type: "includes",
    weight: 0.9
  },
  {
    source: "entity-2",
    target: "entity-3",
    type: "uses",
    weight: 0.85
  },
  {
    source: "entity-4",
    target: "entity-5",
    type: "stores-data-in",
    weight: 0.8
  }
];

const DEMO_ANALYTICS = {
  totalDocuments: 3,
  totalEntities: 5,
  totalRelationships: 3,
  searchesPerformed: 127,
  activeUsers: 1,
  dataIngestionRate: "2.5MB/day",
  knowledgeGraphDensity: 0.45,
  lastUpdated: "2026-01-14T10:30:00Z"
};

// SQL Commands to insert demo data:
/*

INSERT INTO users (id, email, name, password, created_at) VALUES
  ('user-1', 'demo@velion.app', 'Demo User', 'hashed_password_123', '2026-01-14');

INSERT INTO documents (id, title, content, user_id, upload_date, file_size) VALUES
  ('doc-1', 'Artificial Intelligence Fundamentals', 'Introduction to AI...', 'user-1', '2026-01-14', '2.5MB'),
  ('doc-2', 'Web Development Best Practices', 'Modern web development...', 'user-1', '2026-01-13', '1.8MB'),
  ('doc-3', 'Knowledge Graph Construction', 'Building and querying...', 'user-1', '2026-01-12', '3.2MB');

INSERT INTO entities (id, name, type, description) VALUES
  ('entity-1', 'Artificial Intelligence', 'Concept', 'Machine intelligence...'),
  ('entity-2', 'Machine Learning', 'Concept', 'Subset of AI...'),
  ('entity-3', 'Neural Networks', 'Technology', 'Computing systems...'),
  ('entity-4', 'React', 'Framework', 'JavaScript library...'),
  ('entity-5', 'PostgreSQL', 'Database', 'Relational database...');

*/

// Test Accounts:
const TEST_ACCOUNTS = [
  {
    email: "demo@velion.app",
    password: "Demo@123456"
  },
  {
    email: "test@velion.app",
    password: "Test@123456"
  }
];

// After deployment, you can:
// 1. Create these accounts manually via the signup page
// 2. Or use this data to seed your database
// 3. Then test all features with demo data

module.exports = {
  DEMO_USERS,
  DEMO_DOCUMENTS,
  DEMO_KNOWLEDGE_ENTITIES,
  DEMO_RELATIONSHIPS,
  DEMO_ANALYTICS,
  TEST_ACCOUNTS
};
