
# Leaderboard App

## Backend Setup (Node.js + MongoDB)
1. Go to backend directory:
   ```
   cd backend
   npm install express mongoose cors
   node server.js
   ```

2. MongoDB must be running at mongodb://localhost:27017

## Frontend Setup (React)
1. Go to frontend directory:
   ```
   cd frontend
   npx create-react-app .  # (only first time)
   npm install
   npm start
   ```

## Features
- Select or Add user
- Claim random points (1–10)
- Live leaderboard with top ranks styled
- History saved in DB
