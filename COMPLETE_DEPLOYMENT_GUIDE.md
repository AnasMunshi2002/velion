# 🚀 Velion Application - Complete Deployment Guide

## Overview

Velion is a Digital Knowledge Network application with:

- **Frontend**: React.js Application
- **Backend**: Express.js API + Django REST API
- **Databases**: PostgreSQL, MongoDB, Neo4j

## Free Platform Deployment Strategy

### Selected Platforms:

1. **Frontend**: [Vercel](https://vercel.com) - Free tier
2. **Express Backend**: [Render](https://render.com) - Free tier
3. **Django Backend**: [Render](https://render.com) - Free tier
4. **Database**: [Render PostgreSQL](https://render.com) - Free tier

---

## 📋 Prerequisites

- GitHub account (required for all platforms)
- Git installed locally
- Node.js 18+ (for local testing)
- Python 3.8+ (for Django)

---

## 🔧 Pre-Deployment Configuration

All necessary configuration files have been created:

### Frontend (.env files)

```
velion-app/
├── .env.development (local development)
└── .env.production  (production - uses Render backend URL)
```

### Express Backend (.env files)

```
velion-backend/express-api/
├── .env.development
├── .env.production
└── render.yaml
```

### Django Backend

```
velion-backend/django/
├── .env
├── requirements.txt (updated with all dependencies)
└── render.yaml
```

---

## 🚀 Deployment Steps

### Step 1: Frontend Deployment (Vercel)

#### Option A: Using Vercel GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to https://vercel.com
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your repository
   - Select the "velion-app" folder as root directory

3. **Configure Environment**

   - In Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://velion-backend.onrender.com/api`
   - Click "Deploy"

4. **Your Frontend URL**: `https://your-project-name.vercel.app`

#### Option B: Using Netlify (Alternative)

1. `npm run build` in velion-app folder
2. Drag & drop the `build` folder to https://app.netlify.com

---

### Step 2: Express Backend Deployment (Render)

1. **Create Web Service on Render**

   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Select "Deploy from a Git repository"
   - Connect your GitHub account
   - Choose the repository containing velion-backend/express-api

2. **Configure Service**

   - **Name**: `velion-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   Copy from `.env.production`:

   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/velion
   NEO4J_URI=bolt://localhost:7687
   JWT_SECRET=your-secret-key-change-in-production
   DJANGO_API_URL=https://velion-django.onrender.com
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```

4. **Deploy**

   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)

5. **Your Backend URL**: `https://velion-backend.onrender.com`

---

### Step 3: Django Backend Deployment (Render)

#### 3A: Create PostgreSQL Database (Render)

1. Go to https://render.com
2. Click "New +" → "PostgreSQL"
3. **Name**: `velion-db`
4. **Plan**: Free
5. Click "Create"
6. Copy the database connection string (DATABASE_URL)

#### 3B: Deploy Django Web Service

1. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose velion-backend/django folder

2. **Configure Service**

   - **Name**: `velion-django`
   - **Environment**: `Python`
   - **Build Command**:
     ```
     pip install -r requirements.txt && python manage.py migrate
     ```
   - **Start Command**:
     ```
     gunicorn dkn.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - **Plan**: Free

3. **Add Environment Variables**

   ```
   DEBUG=False
   DJANGO_SECRET_KEY=your-secret-key-generate-new
   ALLOWED_HOSTS=velion-django.onrender.com
   DATABASE_URL=postgresql://...  (from PostgreSQL service above)
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   ```

4. **Deploy**

   - Click "Create Web Service"
   - Wait for deployment

5. **Your Django URL**: `https://velion-django.onrender.com`

---

## 📝 Environment Variables Summary

### Frontend (Vercel)

```
REACT_APP_API_URL=https://velion-backend.onrender.com/api
REACT_APP_ENV=production
```

### Express Backend (Render)

```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-url>
NEO4J_URI=<your-neo4j-url>
DJANGO_API_URL=https://velion-django.onrender.com
CORS_ORIGIN=https://your-vercel-url.vercel.app
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<if-using-aws>
AWS_SECRET_ACCESS_KEY=<if-using-aws>
```

### Django Backend (Render)

```
DEBUG=False
DJANGO_SECRET_KEY=<generate-strong-secret>
ALLOWED_HOSTS=velion-django.onrender.com,localhost
DATABASE_URL=postgresql://...
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
CORS_ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository created and all code pushed
- [ ] Frontend environment variables configured
- [ ] Express backend environment variables configured
- [ ] Django database created on Render
- [ ] Django environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Express backend deployed to Render
- [ ] Django backend deployed to Render
- [ ] Cross-service connections verified
- [ ] Test application from frontend URL

---

## 🔗 Final Deployment URLs

After successful deployment, you'll have:

1. **Frontend**: `https://your-frontend.vercel.app`
2. **Express API**: `https://velion-backend.onrender.com`
3. **Django API**: `https://velion-django.onrender.com`
4. **Database**: Render PostgreSQL service

---

## 🧪 Testing Deployment

1. **Frontend Test**

   - Open frontend URL in browser
   - Check Network tab in DevTools
   - Verify API calls go to Render backend

2. **Backend Test**

   ```bash
   curl https://velion-backend.onrender.com/health
   curl https://velion-django.onrender.com/api/
   ```

3. **Database Test**
   - Check Render database logs
   - Verify migrations ran successfully

---

## 🔧 Troubleshooting

### Frontend shows blank page

- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` environment variable is set
- Clear cache and rebuild on Vercel

### Backend returns 500 errors

- Check Render build logs
- Verify environment variables are set correctly
- Check service dependencies (databases, APIs)

### Database connection fails

- Verify DATABASE_URL is correctly formatted
- Check PostgreSQL service is active
- Review Render database logs

### CORS errors

- Update `CORS_ORIGIN` in Express backend to match frontend URL
- Update `CORS_ALLOWED_ORIGINS` in Django settings
- Restart services after updating

---

## 📚 Useful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [React Deployment Guide](https://create-react-app.dev/deployment/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Django Deployment](https://docs.djangoproject.com/en/4.2/howto/deployment/)

---

## 🎯 Next Steps

1. Review and customize environment variables
2. Set up GitHub repositories with proper access
3. Follow the deployment steps above
4. Test each component after deployment
5. Monitor service logs on Render and Vercel
6. Update documentation with final URLs

---

## 📧 Support

For deployment issues:

1. Check the platform-specific documentation
2. Review service logs
3. Verify environment variables
4. Ensure all services have proper access to each other

---

**Deployment Date**: January 14, 2026
**Application**: Velion - Digital Knowledge Network
**Stack**: React + Express.js + Django + PostgreSQL
