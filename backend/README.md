# Admin Support System Backend

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
3. `npm run dev` to start the server (nodemon)

## API Endpoints
- `POST /api/auth/register` – Register user (only one Developer allowed)
- `POST /api/auth/login` – Login step 1, sends confirmation code to email
- `POST /api/auth/verify-code` – Login step 2, verify code and get JWT
- `GET /api/admin/users` – List users (filter by role/status)
- `PUT /api/admin/users/:id/role` – Update user role (Developer-only for Developer role)
- `PUT /api/admin/users/:id/status` – Activate/deactivate user
- `GET /api/admin/users/:id/activity` – Get user activity logs
- `GET /api/admin/activity` – Get all activity logs (filterable)
- `POST /api/activity-log` – Log an activity

## User Roles
- Developer, Admin, Teacher, Student

## Notes
- All admin routes require JWT and proper role
- Only Developer can promote to Developer 

## .env Variables
- MONGODB_URI
- JWT_SECRET
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASS

## Login with Email Confirmation
1. Call `POST /api/auth/login` with email and password. If correct, a confirmation code is sent to your email.
2. Call `POST /api/auth/verify-code` with email and code to receive your JWT and complete login. 