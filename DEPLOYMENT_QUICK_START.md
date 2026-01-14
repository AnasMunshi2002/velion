# 🚀 VELION DEPLOYMENT - QUICK REFERENCE

## What You Get (After Following Steps Below):

```
✅ Frontend:  https://your-app.vercel.app
✅ API:       https://velion-backend.onrender.com
✅ Django:    https://velion-django.onrender.com
✅ Database:  PostgreSQL on Render (included)
```

---

## 3 SIMPLE STEPS TO DEPLOY

### STEP 1️⃣: VERCEL (Frontend) - 5 minutes

```
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Root Directory: velion-app
4. Env Variable: REACT_APP_API_URL = https://velion-backend.onrender.com/api
5. Click "Deploy"
✅ Frontend URL: https://your-project.vercel.app
```

### STEP 2️⃣: RENDER (Express Backend) - 5 minutes

```
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Name: velion-backend
   - Root: velion-backend/express-api
   - Start: npm start
4. Copy from .env.production (all variables)
5. Click "Deploy"
✅ Backend URL: https://velion-backend.onrender.com
```

### STEP 3️⃣: RENDER (Django + Database) - 10 minutes

```
1. Go to https://render.com → New PostgreSQL
   - Name: velion-db
   - (Copy the DATABASE_URL)

2. Go to https://render.com → New Web Service
3. Settings:
   - Name: velion-django
   - Root: velion-backend/django
   - Build: pip install -r requirements.txt && python manage.py migrate
   - Start: gunicorn dkn.wsgi:application --bind 0.0.0.0:$PORT
4. Add Environment Variables:
   - DATABASE_URL: (from step 1)
   - DJANGO_SECRET_KEY: (generate any random string)
   - DEBUG: False
   - ALLOWED_HOSTS: velion-django.onrender.com
5. Click "Deploy"
✅ Django URL: https://velion-django.onrender.com
```

---

## 📍 EXPECTED FINAL URLS

| Service         | URL                                 |
| --------------- | ----------------------------------- |
| **Website**     | https://your-project.vercel.app     |
| **Express API** | https://velion-backend.onrender.com |
| **Django API**  | https://velion-django.onrender.com  |
| **Database**    | PostgreSQL on Render                |

---

## ⚡ QUICK GENERATE SECRETS (Run in terminal)

```bash
# Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online: https://generate-random.org/
```

---

## ✨ After Deployment - What to Do

1. Open frontend URL in browser
2. Register/Login
3. Test uploading documents
4. Check dashboard loads data
5. Verify analytics show data

---

## 🆘 If Something Breaks

### Frontend shows blank page

- Check browser DevTools → Network tab
- Look for failed API requests
- Verify `REACT_APP_API_URL` matches backend URL

### Backend not responding

- Open Render dashboard
- Click service → Logs
- Look for error messages
- Check all environment variables are set

### Database connection errors

- Verify DATABASE_URL format is correct
- Check PostgreSQL service is running
- Ensure Django build command ran (migrations)

---

## 📁 Configuration Files Location

✅ Created for you:

- `velion-app/.env.production` - Frontend production config
- `velion-backend/express-api/.env.production` - Backend config
- `velion-backend/django/requirements.txt` - Django dependencies
- `velion-backend/django/render.yaml` - Django Render config
- `velion-backend/express-api/render.yaml` - Express Render config
- `velion-app/vercel.json` - Vercel config

---

## 🎯 Summary

All configuration files are **READY TO DEPLOY**. Just follow the 3 steps above and get your live website!

**Total deployment time**: ~20 minutes
**Cost**: FREE (using free tiers)
**Your website**: Live in minutes!

---

**Questions?** See COMPLETE_DEPLOYMENT_GUIDE.md for detailed instructions
