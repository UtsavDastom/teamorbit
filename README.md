# 🛸 TeamOrbit — Project Management Platform

> A modern, dark-themed full-stack project management app built with React + Node.js + MongoDB.

---

## 📁 Project Structure

```
teamorbit/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── common/
    │   │   ├── layout/
    │   │   ├── projects/
    │   │   └── tasks/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   └── App.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a free account → New Project → Create Cluster (Free M0 tier)
3. Under **Database Access** → Add New User:
   - Username: `teamorbit`
   - Password: (auto-generate, save it)
   - Role: `Atlas Admin`
4. Under **Network Access** → Add IP Address → `0.0.0.0/0` (allow all)
5. Under **Databases** → Connect → Drivers → Copy connection string
6. Replace `<password>` with your user password in the URI

---

## 🔧 Local Development Setup

### 1. Clone the repo and install dependencies

```bash
# Root
git clone https://github.com/YOUR_USERNAME/teamorbit.git
cd teamorbit

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://teamorbit:<password>@cluster0.xxxxx.mongodb.net/teamorbit?retryWrites=true&w=majority
JWT_SECRET=teamorbit_super_secret_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run backend

```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

### 4. Run frontend

```bash
cd frontend
npm run dev
# App starts at http://localhost:5173
```

---

## 🧪 API Endpoints

| Method | Endpoint              | Auth     | Description             |
|--------|-----------------------|----------|-------------------------|
| POST   | /api/auth/register    | Public   | Register user           |
| POST   | /api/auth/login       | Public   | Login user              |
| GET    | /api/auth/me          | Bearer   | Get current user        |
| GET    | /api/users            | Bearer   | List all users          |
| PUT    | /api/users/:id        | Bearer   | Update user             |
| DELETE | /api/users/:id        | Admin    | Delete user             |
| GET    | /api/projects         | Bearer   | List projects           |
| POST   | /api/projects         | Admin    | Create project          |
| PUT    | /api/projects/:id     | Admin    | Update project          |
| DELETE | /api/projects/:id     | Admin    | Delete project          |
| GET    | /api/tasks            | Bearer   | List tasks              |
| GET    | /api/tasks/stats      | Bearer   | Dashboard stats         |
| POST   | /api/tasks            | Admin    | Create task             |
| PUT    | /api/tasks/:id        | Bearer   | Update task/status      |
| DELETE | /api/tasks/:id        | Admin    | Delete task             |

---

## 🚀 Railway Deployment

### Deploy Backend

1. Go to https://railway.app → New Project → Deploy from GitHub Repo
2. Select your repo → **Root Directory**: `backend`
3. Add environment variables in Railway dashboard:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = a strong secret key
   - `NODE_ENV` = production
   - `CLIENT_URL` = your frontend Railway URL (add after deploying frontend)
4. Railway auto-detects `package.json` and starts `node server.js`
5. Copy the backend URL (e.g. `https://teamorbit-backend.railway.app`)

### Deploy Frontend

1. New Project → Deploy from GitHub Repo
2. Select same repo → **Root Directory**: `frontend`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.railway.app/api`
4. Build command: `npm run build`
5. Start command: `npx serve dist -p $PORT`

---

## 📤 GitHub Push Commands

```bash
cd teamorbit
git init
git add .
git commit -m "🚀 Initial commit: TeamOrbit v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/teamorbit.git
git push -u origin main
```

---

## 🏗️ Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React 18, Vite, Tailwind CSS |
| Backend    | Node.js, Express 4       |
| Database   | MongoDB + Mongoose       |
| Auth       | JWT + bcryptjs           |
| HTTP       | Axios                    |
| Routing    | React Router v6          |
| State      | Context API              |
| Toasts     | React Hot Toast          |
| Deploy     | Railway                  |

---

## 👤 Default Roles

- **Admin**: Full CRUD on projects, tasks, users. Can assign members.
- **Member**: View assigned projects/tasks only. Can update task status.

Register with `role: "admin"` to get admin privileges.
