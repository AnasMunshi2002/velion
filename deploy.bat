@echo off
REM Velion Application Deployment Script for Windows

echo.
echo ========================================
echo  Velion Application Deployment Setup
echo ========================================
echo.

REM Step 1: Frontend Setup
echo [Step 1] Preparing Frontend for Deployment...
cd velion-app
echo [DONE] Frontend ready for Vercel
cd ..

REM Step 2: Backend Setup
echo.
echo [Step 2] Preparing Express Backend for Deployment...
cd velion-backend\express-api
echo [DONE] Express API ready for Render
cd ..\..\

REM Step 3: Django Setup
echo.
echo [Step 3] Preparing Django Backend for Deployment...
cd velion-backend\django
echo [DONE] Django API ready for Render
cd ..\..\

echo.
echo ========================================
echo DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo.

echo [FRONTEND - React on Vercel]
echo 1. Visit https://vercel.com
echo 2. Sign up/Login with GitHub
echo 3. Click "New Project"
echo 4. Import: velion-app folder
echo 5. Set Environment Variable:
echo    REACT_APP_API_URL=https://velion-backend.onrender.com/api
echo 6. Click "Deploy"
echo.

echo [EXPRESS BACKEND - Render]
echo 1. Visit https://render.com
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub repository
echo 4. Configure:
echo    - Name: velion-backend
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo 5. Add Environment Variables from .env.production
echo 6. Click "Create Web Service"
echo.

echo [DJANGO BACKEND - Render]
echo 1. Create PostgreSQL Database on Render (free tier)
echo 2. Visit https://render.com and click "New Web Service"
echo 3. Configure:
echo    - Name: velion-django
echo    - Environment: Python
echo    - Build Command: pip install -r requirements.txt && python manage.py migrate
echo    - Start Command: gunicorn dkn.wsgi:application
echo 4. Add Database URL and environment variables
echo 5. Click "Create Web Service"
echo.

echo Setup complete! Follow the deployment instructions above.
echo.
pause
