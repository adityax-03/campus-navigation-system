# College Campus Navigation System (CCNS) — LPU Edition

This is a web application designed for the campus map of **Lovely Professional University (LPU)**. It implements classic Data Structures & Algorithms (DSA) to calculate the most efficient path between academic blocks, student hostels, and recreational venues.

---

## 🏛️ System Features

1. **Graph Algorithms Solver**:
   - **Dijkstra's Algorithm**: Solves the absolute shortest distance between two walkway points.
   - **Breadth-First Search (BFS)**: Computes the path with the fewest intersection hops/turns.
   - **Depth-First Search (DFS)**: Calculates a distinct alternative route to bypass crowd zones.
2. **Accessible Routing**:
   - Bypasses walkways flagged as containing stairs (e.g. Fine Arts/Block 8 entrance) and routes users via wheelchair-accessible ramped walkways.
3. **High-Performance C++ Pathfinder**:
   - Core path calculations run on a compiled native C++ binary executable in the backend.
   - Integrates a robust JavaScript fallback in case the server goes offline or the binary fails.
4. **Interactive SVG Map**:
   - A custom pre-rendered vector map of LPU supporting direct canvas panning, zooming, POI markers, and smooth marching ants path animations.
5. **Offline Mode**:
   - Frontend seamlessly transitions to local offline storage if the backend is down, allowing testing of all map features using simulated local sessions.

---

## 🚀 Quick Start Guide

### 1. Prerequisite Environments
Create a `.env` file under `/backend` with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_token
PORT=5001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

### 2. Seeding LPU Map Data
Seed LPU's nodes and walkway edges into the MongoDB collections:
```bash
cd backend
npm install
node config/seed.js
```

### 3. Running the Backend Server
Start the Express server. It will automatically compile the C++ source code into a native binary on startup:
```bash
cd backend
npm run dev
```

### 4. Running the Frontend React App
Start the React development server in a separate terminal:
```bash
cd frontend
npm install
npm start
```
Open `http://localhost:3000` to interact with the application.

---

## 📂 Project Directory Structure

```
├── backend/
│   ├── config/              # MongoDB connection & Seed script
│   ├── cpp/                 # C++ Pathfinder source code & executable
│   ├── middleware/          # Rate limiter, sanitization, auth validation
│   ├── models/              # User, Node, and Edge mongoose schemas
│   ├── utils/               # JavaScript pathfinder fallbacks
│   └── server.js            # Main server file & C++ compiler coordination
└── frontend/
    ├── public/              # Index and static assets
    ├── src/
    │   ├── components/      # MapView, RoutePlanner, Sidebar, Header
    │   ├── context/         # AuthContext (Offline fallback) & ThemeContext
    │   ├── pages/           # Landing, Login, Register, Dashboard
    │   ├── services/        # Coordinate mappings & directions parser
    │   └── styles/          # Premium dark/light themes & glassmorphism CSS
    └── package.json
```
# campus-navigation-system
