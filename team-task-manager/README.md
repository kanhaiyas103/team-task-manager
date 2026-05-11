# Team Task Manager

Full-stack Team Task Manager application with role-based access control for `Admin` and `Member`.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Axios
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT
- Deployment: Railway (backend), Vercel (frontend)

## Features

- Signup/Login with JWT authentication
- Role-based access control
- Project CRUD and member assignment
- Task CRUD, assignment, and status updates
- Dashboard statistics (total, pending, completed, overdue)
- Responsive dashboard UI

## Project Structure

- `backend/`: Express API (MVC architecture)
- `frontend/`: Next.js web app

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `NODE_ENV`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL`

## Deployment

- Railway config: `backend/railway.toml`
- Vercel config: `frontend/vercel.json`

## Live Demo

Frontend:
https://team-task-manager-i6ie-id4jilkkm.vercel.app/

Backend:
https://team-task-manager-production-d5fb.up.railway.app
