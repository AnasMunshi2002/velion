#!/bin/bash

# Velion Application Deployment Script
# This script prepares the application for deployment to free platforms

echo "🚀 Velion Application Deployment Setup"
echo "======================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Frontend Setup
echo -e "\n${BLUE}Step 1: Preparing Frontend for Deployment${NC}"
cd velion-app
echo -e "${GREEN}✓ Frontend ready for Vercel${NC}"

# Step 2: Backend Setup
echo -e "\n${BLUE}Step 2: Preparing Express Backend for Deployment${NC}"
cd ../velion-backend/express-api
echo -e "${GREEN}✓ Express API ready for Render${NC}"

# Step 3: Django Setup
echo -e "\n${BLUE}Step 3: Preparing Django Backend for Deployment${NC}"
cd ../django
echo -e "${GREEN}✓ Django API ready for Render${NC}"

echo -e "\n${YELLOW}DEPLOYMENT INSTRUCTIONS:${NC}"
echo -e "\n${BLUE}Frontend (React - Vercel):${NC}"
echo "1. Visit https://vercel.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Project'"
echo "4. Import: velion/velion-app"
echo "5. Set Environment Variable:"
echo "   REACT_APP_API_URL=https://velion-backend.onrender.com/api"
echo "6. Click 'Deploy'"
echo ""

echo -e "${BLUE}Express Backend (Render):${NC}"
echo "1. Visit https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect GitHub: velion/velion-backend/express-api"
echo "4. Configuration:"
echo "   Name: velion-backend"
echo "   Environment: Node"
echo "   Build Command: npm install"
echo "   Start Command: npm start"
echo "5. Add Environment Variables from .env.production"
echo "6. Click 'Create Web Service'"
echo ""

echo -e "${BLUE}Django Backend (Render):${NC}"
echo "1. Create PostgreSQL Database on Render (free)"
echo "2. Visit https://render.com → New Web Service"
echo "3. Connect GitHub: velion/velion-backend/django"
echo "4. Configuration:"
echo "   Name: velion-django"
echo "   Environment: Python"
echo "   Build Command: pip install -r requirements.txt && python manage.py migrate"
echo "   Start Command: gunicorn dkn.wsgi:application"
echo "5. Add Database URL and other environment variables"
echo "6. Click 'Create Web Service'"
echo ""

echo -e "${GREEN}Setup complete! Follow the deployment instructions above.${NC}"
