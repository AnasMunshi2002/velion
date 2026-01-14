# Build and deployment guides for Velion

## Frontend Deployment (React)

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import the velion-app repository
5. Configure environment variables:
   - REACT_APP_API_URL=https://velion-backend.onrender.com/api
6. Click Deploy

### Deploy to Netlify (Alternative)

1. npm run build
2. Drag and drop 'build' folder to https://app.netlify.com

---

## Backend Deployment (Express.js)

### Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Click "New +" -> "Web Service"
4. Connect GitHub repository (velion-backend/express-api)
5. Configure:
   - Name: velion-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
6. Add environment variables from .env.production
7. Click "Create Web Service"

---

## Django Backend Deployment

### Deploy to Render

1. Go to https://render.com
2. Click "New +" -> "Web Service"
3. Connect GitHub repository (velion-backend/django)
4. Configure:
   - Name: velion-django
   - Environment: Python
   - Build Command: pip install -r requirements.txt && python manage.py migrate
   - Start Command: gunicorn dkn.wsgi:application
5. Add PostgreSQL database from Render
6. Set environment variables
7. Click "Create Web Service"

### Database Setup (Render)

1. Create a PostgreSQL database on Render (free tier)
2. Get connection string (DATABASE_URL)
3. Update Django environment variables

---

## Quick Deployment Steps

### Step 1: Frontend

```bash
cd velion-app
npm install
npm run build
# Deploy to Vercel
```

### Step 2: Backend

```bash
cd velion-backend/express-api
npm install
# Deploy to Render
```

### Step 3: Django

```bash
cd velion-backend/django
pip install -r requirements.txt
python manage.py migrate
# Deploy to Render
```
