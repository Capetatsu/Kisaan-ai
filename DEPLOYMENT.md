# Kisaan AI — Docker & Deployment Guide

This guide covers two things:
1. **Running the entire project with Docker** (anyone can run it with a single command)
2. **Deploying the backend** to a cloud platform

---

## Part 1: Run with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (with Docker Compose)
- [Git](https://git-scm.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:Capetatsu/Kisaan-ai.git
cd Kisaan-ai

# 2. Create environment files
cp backend/.env.example backend/.env
cp .env.example .env

# 3. Edit backend/.env and set your secrets
#    - DATABASE_URL: leave as postgresql://postgres:postgres@db:5432/kisaan for local Docker
#    - SECRET_KEY: generate one with: python -c "import secrets; print(secrets.token_urlsafe(64))"
#    - GEMINI_API_KEY: optional (app has fallback)
#    - OPENWEATHER_API_KEY: optional (app has fallback)

# 4. Build and start all services
docker-compose up --build

# 5. Open the app
#    Frontend: http://localhost
#    Backend API: http://localhost:8000
#    Health check: http://localhost:8000/health
```

### What Gets Started

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| **frontend** | `kisaan-frontend` | `80` | React + Vite production build served by Nginx |
| **backend** | `kisaan-backend` | `8000` | FastAPI app with auto-migrations |
| **db** | `kisaan-db` | `5432` | PostgreSQL 16 database |

### Useful Commands

```bash
# Start in background
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (wipes database data)
docker-compose down -v

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild a single service
docker-compose up --build backend

# Run backend tests inside container
docker-compose exec backend pytest

# Run migrations manually
docker-compose exec backend alembic upgrade head

# Check service health
curl http://localhost:8000/health
```

### Using an External Database (e.g., Neon)

If you want to use a cloud PostgreSQL (like Neon), edit `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
```

Then restart the backend:

```bash
docker-compose up -d --build backend
```

You can also remove the `db` service from `docker-compose.yml` if you don't need the local PostgreSQL.

---

## Part 2: Deploy the Backend

### Option A: Deploy to Render (Recommended — Free Tier)

1. **Push your code to GitHub** (if not already there).

2. **Create a PostgreSQL database** (optional — you can use Neon or Render's built-in Postgres):
   - Go to [neon.tech](https://neon.tech) and create a free database
   - Copy the connection string (starts with `postgresql://`)

3. **Create a new Web Service on Render**:
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub repo
   - Select the `backend` directory as the root directory
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set environment variables** in Render dashboard:
   ```
   DATABASE_URL=postgresql://your-neon-db-url
   SECRET_KEY=your-random-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=["*"]
   GEMINI_API_KEY=your-gemini-key
   OPENWEATHER_API_KEY=your-openweather-key
   ```

5. **Deploy** — Render will build and start your backend automatically.

6. **Your backend URL** will be something like: `https://kisaan-backend.onrender.com`

### Option B: Deploy to Railway

1. Push code to GitHub.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Select your repo, then set the **Root Directory** to `backend`.
4. Railway will auto-detect the Python app.
5. Add a PostgreSQL plugin (or use Neon).
6. Set the same environment variables as above.
7. Railway auto-deploys on every push to the main branch.

### Option C: Deploy to a VPS (DigitalOcean, AWS EC2, etc.)

```bash
# On your server
git clone git@github.com:Capetatsu/Kisaan-ai.git
cd Kisaan-ai

# Create env file
cp backend/.env.example backend/.env
nano backend/.env   # Set your secrets

# Build and run with Docker
docker-compose up -d --build

# The app is now live on your server's IP
# Frontend: http://your-server-ip
# Backend: http://your-server-ip:8000
```

### Option D: Deploy Backend Only (without Docker)

```bash
# On your server
git clone git@github.com:Capetatsu/Kisaan-ai.git
cd Kisaan-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@host/db"
export SECRET_KEY="your-secret-key"
export GEMINI_API_KEY="your-gemini-key"
export OPENWEATHER_API_KEY="your-openweather-key"

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Part 3: Deploy the Frontend

### Option A: Deploy to Vercel

1. Push code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
7. Deploy.

### Option B: Deploy to Netlify

1. Push code to GitHub.
2. Go to [netlify.com](https://netlify.com) → New Site from Git.
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
6. Deploy.

### Option C: Deploy with Docker (anywhere)

```bash
# Build the frontend image
docker build -t kisaan-frontend .

# Run it (nginx serves on port 80)
docker run -p 80:80 kisaan-frontend
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SECRET_KEY` | ✅ | JWT signing key (generate a random one) |
| `ALGORITHM` | ❌ | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | Token expiry (default: `30`) |
| `CORS_ORIGINS` | ❌ | Allowed origins (default: `["*"]`) |
| `GEMINI_API_KEY` | ❌ | Google Gemini key (app has fallback) |
| `OPENWEATHER_API_KEY` | ❌ | OpenWeatherMap key (app has fallback) |
| `DEFAULT_LATITUDE` | ❌ | Default lat for weather (default: `22.7196`) |
| `DEFAULT_LONGITUDE` | ❌ | Default lon for weather (default: `75.8577`) |

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | ❌ | API base URL (default: `/api`) |

---

## Troubleshooting

### Port 80 already in use
```bash
# Change the frontend port in docker-compose.yml
# Change "80:80" to "8080:80"
docker-compose up -d --build frontend
```

### Database connection issues
```bash
# Check if the database is healthy
docker-compose ps

# Check database logs
docker-compose logs db

# Verify the DATABASE_URL in backend/.env
# For local Docker: postgresql://postgres:postgres@db:5432/kisaan
```

### Backend health check failing
```bash
# Check backend logs
docker-compose logs backend

# Test the health endpoint directly
curl http://localhost:8000/health
```

### Frontend can't reach the backend
The nginx config proxies `/api` to `http://backend:8000`. If you changed the backend container name, update `nginx.conf` accordingly.

### CORS errors (browser blocks API calls)

**What is CORS?** When your frontend is on a different domain than your backend (e.g., frontend on `vercel.app`, backend on `render.com`), the browser blocks API requests unless the backend explicitly allows that domain.

**Fix:** Update `CORS_ORIGINS` in `backend/.env` to include your frontend's exact URL:

```env
CORS_ORIGINS=["https://your-frontend-domain.com"]
```

For example, if your frontend is at `https://kisaan-ai.vercel.app`, set:
```env
CORS_ORIGINS=["https://kisaan-ai.vercel.app"]
```

**When you DON'T need to change it:**
- Local development with Docker (nginx proxy handles everything on `localhost`)
- Frontend and backend on the same domain (e.g., both behind the same nginx)

**When you MUST change it:**
- Frontend deployed to Vercel/Netlify and backend deployed to Render/Railway (different domains)
- Without this, the browser will block all API calls and the app won't work