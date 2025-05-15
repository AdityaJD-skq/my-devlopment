# JEE-NEET Prep Admin Support System

This project now includes a robust **Admin Support System** for user management, activity tracking, and role-based access control.

## Features
- **User Management**: List, filter, and manage users by role. Change roles, view profiles, and activate/deactivate accounts.
- **Activity Tracking**: Logs user actions (login, tests, questions, notes, role changes) with filters by user, date, and type.
- **Role-Based Access**: Four roles (Developer, Admin, Teacher, Student) with granular permissions and protected routes.
- **Frontend**: Built with React + Tailwind CSS, Zustand for state management, and responsive UI with role badges.
- **Backend**: Node.js + Express.js API, MongoDB for users and logs, JWT authentication, and secure role middleware.

## User Roles
- 🛠️ **Developer**: Superuser, full access (only one)
- 🧑‍💼 **Admin**: Manage users, questions, analytics
- 🧑‍🏫 **Teacher**: View student progress, assign tests
- 👨‍🎓 **Student**: Take tests, track own progress

## Setup Instructions

### 1. Backend
- Will be located in `/backend` (to be created)
- Node.js, Express, Mongoose, JWT
- Run: `npm install` then `npm run dev` in `/backend`

### 2. Frontend
- Located in `/jee-neet-prep`
- React + Tailwind + Zustand
- Run: `npm install` then `npm run dev` in `/jee-neet-prep`

### 3. Environment Variables
- See `/backend/.env.example` for required variables (MongoDB URI, JWT secret, etc.)

### 4. API Endpoints
- `GET /api/admin/users` – list users
- `PUT /api/admin/users/:id/role` – update user role
- `GET /api/admin/users/:id/activity` – get activity logs
- `GET /api/admin/activity` – get all logs (filterable)
- `POST /api/activity-log` – log an activity

---

**Next Steps:**
- Backend scaffolding and API implementation
- Frontend pages for User Management and Activity Logs
- Role-based route protection and UI badges 