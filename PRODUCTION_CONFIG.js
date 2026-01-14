/**
 * PRODUCTION API CONFIGURATION
 * Update these URLs after deployment
 */

// ============================================
// PRODUCTION ENDPOINTS
// ============================================

// After Vercel Deployment
const FRONTEND_URL = "https://your-frontend-name.vercel.app";

// After Render Deployment (Express)
const EXPRESS_API_BASE = "https://velion-backend.onrender.com/api";

// After Render Deployment (Django)
const DJANGO_API_BASE = "https://velion-django.onrender.com/api";

// ============================================
// SERVICES TO UPDATE
// ============================================

/*
1. Frontend API Configuration
   File: velion-app/src/services/api.js
   
   Update line:
   const API_BASE_URL = process.env.REACT_APP_API_URL || "https://velion-backend.onrender.com/api";

2. Express Backend CORS
   File: velion-backend/express-api/src/app.js
   
   Update CORS origin:
   cors({
     origin: 'https://your-frontend-name.vercel.app',
     credentials: true
   })

3. Django CORS
   File: velion-backend/django/dkn/settings.py
   
   Update:
   CORS_ALLOWED_ORIGINS = [
       'https://your-frontend-name.vercel.app'
   ]

4. Express Django Service
   File: velion-backend/express-api/src/services/djangoService.js
   
   Update:
   const DJANGO_API_URL = 'https://velion-django.onrender.com';
*/

// ============================================
// DEPLOYMENT ENVIRONMENT VARIABLES
// ============================================

// VERCEL Environment Variables
{
  "REACT_APP_API_URL": "https://velion-backend.onrender.com/api",
  "REACT_APP_ENV": "production"
}

// RENDER (Express Backend) Environment Variables
{
  "NODE_ENV": "production",
  "PORT": "3000",
  "MONGODB_URI": "mongodb+srv://...",  // Update with your MongoDB
  "NEO4J_URI": "bolt+s://...",         // Update with your Neo4j
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "...",
  "DJANGO_API_URL": "https://velion-django.onrender.com",
  "CORS_ORIGIN": "https://your-frontend-name.vercel.app",
  "JWT_SECRET": "your-secret-key",
  "JWT_REFRESH_SECRET": "your-refresh-secret",
  "AWS_REGION": "us-east-1",
  "AWS_ACCESS_KEY_ID": "...",
  "AWS_SECRET_ACCESS_KEY": "..."
}

// RENDER (Django) Environment Variables
{
  "DEBUG": "False",
  "DJANGO_SECRET_KEY": "your-secret-key",
  "ALLOWED_HOSTS": "velion-django.onrender.com",
  "DATABASE_URL": "postgresql://user:pass@host:5432/db",
  "SECURE_SSL_REDIRECT": "True",
  "SESSION_COOKIE_SECURE": "True",
  "CSRF_COOKIE_SECURE": "True",
  "CORS_ALLOWED_ORIGINS": "https://your-frontend-name.vercel.app",
  "NEO4J_BOLT_URL": "bolt+s://...",
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "..."
}

// ============================================
// API ENDPOINTS AFTER DEPLOYMENT
// ============================================

// Frontend
GET  https://your-frontend-name.vercel.app/

// Express API Endpoints
GET  https://velion-backend.onrender.com/api/health
POST https://velion-backend.onrender.com/api/auth/login
POST https://velion-backend.onrender.com/api/auth/register
GET  https://velion-backend.onrender.com/api/documents
POST https://velion-backend.onrender.com/api/documents/upload
GET  https://velion-backend.onrender.com/api/search
GET  https://velion-backend.onrender.com/api/graph
GET  https://velion-backend.onrender.com/api/analytics

// Django API Endpoints
GET  https://velion-django.onrender.com/api/health
POST https://velion-django.onrender.com/api/auth/login
GET  https://velion-django.onrender.com/api/knowledge/documents
GET  https://velion-django.onrender.com/api/knowledge/entities

// ============================================
// VERIFICATION AFTER DEPLOYMENT
// ============================================

# Test Express Backend
curl https://velion-backend.onrender.com/api/health

# Test Django Backend
curl https://velion-django.onrender.com/api/health

# Test Frontend (open in browser)
https://your-frontend-name.vercel.app

# Check CORS configuration
curl -H "Origin: https://your-frontend-name.vercel.app" \
     https://velion-backend.onrender.com/api/health
