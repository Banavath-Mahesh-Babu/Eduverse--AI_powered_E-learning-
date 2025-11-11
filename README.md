
# Eduverse — Full‑Stack AI E‑Learning with Auth (JWT)

- Auth: Login & Signup (JWT, bcrypt), protected AI/Exams/Practice
- Backend: Node/Express, MongoDB (Mongoose), OpenAI
- Frontend: React + Vite + Tailwind, AuthContext, ProtectedRoute
- Seed: 15 courses + exams + practice sets

## Run

### Backend
```bash
cd backend
cp .env.example .env
# Set your keys in .env:
# MONGO_URI=mongodb+srv://Mahesh_dbuser:Mahesh2005@eduverse.nsv8afd.mongodb.net/?appName=Eduverse
# OPENAI_API_KEY=sk-...
# JWT_SECRET=supersecretkey123
npm install
npm run dev   # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm install
npm run dev            # http://localhost:5173
```
