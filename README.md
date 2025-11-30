# MiniMartCircle

MiniMartCircle is a mini marketplace application with a Node.js/Express + PostgreSQL (Supabase) backend and a modern React (Vite + TailwindCSS) frontend.

## Features
- User authentication (signup, login, logout) with HTTP-only JWT cookies
- Secure product creation linked to authenticated user
- Image upload via Supabase Storage (server-side secure service key route)
- Responsive, modern UI (Tailwind, Inter font, lucide icons)
- Product listing with seller info and product modal
- Protected route for selling items

## Monorepo Structure
```
mini-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/authMiddleware.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── uploadController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   └── productModel.js
│   │   └── server.js
│   ├── package.json
│   └── .env (create this)
├── frontend/
│   ├── src/ (React components, pages, context, utils)
│   ├── index.html
│   ├── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── .env (create this)
└── README.md
```

## Backend Setup
### 1. Environment Variables (`backend/.env`)
Create a `.env` file inside `backend/`:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_here

# Supabase project info
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY   # keep secret; DO NOT expose in frontend
SUPABASE_BUCKET=marketplace-images           # existing public bucket name
```

### 2. Install & Run
```powershell
Set-Location backend
npm install
npm run start  # or npm run dev
```

### 3. Database Schema (PostgreSQL / Supabase SQL Editor)
```sql
CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	price NUMERIC(12,2) NOT NULL,
	image_url TEXT,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 4. API Endpoints (Base: `http://localhost:5000/api`)
- `POST /auth/signup` → body: `{ name, phone, email, password }`
- `POST /auth/login` → body: `{ email, password }`
- `POST /auth/logout`
- `GET /products` → list products with seller info
- `GET /products/:id` → product + seller
- `POST /products` (auth) → body: `{ name, price, image_url }`
- `POST /upload` (auth, multipart/form-data) → field: `file`

### 5. Image Upload Flow
- Frontend sends image file to backend `/api/upload` (multipart).
- Backend uses Supabase service role key to store file in `SUPABASE_BUCKET`.
- Backend returns public URL inserted into product via `/api/products`.

## Frontend Setup
### 1. Environment Variables (`frontend/.env`)
```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY         # optional if you later enable client features
VITE_SUPABASE_BUCKET=marketplace-images      # same bucket
```
Currently image uploads are server-side; these variables are only needed if you plan to enable client-side interactions later.

### 2. Install & Run
```powershell
Set-Location frontend
npm install
npm run dev
```
Visit: `http://localhost:5173`

### 3. Development Proxy
`vite.config.js` proxies `/api` → `http://localhost:5000` so axios uses relative `'/api'` base.

### 4. Auth Behavior
- On login/signup, backend sets HTTP-only `token` cookie.
- Axios instance (`src/utils/api.js`) uses `withCredentials: true`.
- Protected routes use `ProtectedRoute` component.

### 5. UI Tech
- TailwindCSS for layout & styling
- Inter font globally
- lucide-react icons
- Responsive cards, modals, forms

## Common Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized on product create | Missing token cookie | Ensure login succeeded; check browser devtools cookies |
| Database connection error | `DATABASE_URL` invalid | Verify credentials & SSL mode |
| Supabase upload RLS error | Using anon key instead of service key | Confirm `SUPABASE_SERVICE_KEY` set in backend .env |
| CORS blocked | Wrong `CORS_ORIGIN` | Match frontend origin (`http://localhost:5173`) |
| Cookie not set in dev | Missing `withCredentials` or CORS credentials | Confirm axios config + CORS `credentials: true` |


## Quick Start Summary
```powershell
# Backend
Set-Location backend
copy .env.example .env   # (if you create one) then fill values
npm install
npm run start

# Frontend (new terminal)
Set-Location frontend
npm install
npm run dev
```
Open `http://localhost:5173`, sign up, then list a product via Sell page.

