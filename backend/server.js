const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");
const fs = require("fs");

require("dotenv").config();

const connectDB = require("./config/db");
const mongoSanitize = require("./middleware/sanitize");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const User = require("./models/User");
const jsPathfinder = require("./utils/pathfinderFallback");

// ── Startup Validation ──
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
const isProd = process.env.NODE_ENV === "production";

// ── Auto Compile C++ Pathfinder ──
const cppPath = path.join(__dirname, "cpp", "pathfinder.cpp");
const binaryName = process.platform === "win32" ? "pathfinder.exe" : "pathfinder";
const binaryPath = path.join(__dirname, "cpp", binaryName);

console.log("Checking C++ source code at:", cppPath);
if (fs.existsSync(cppPath)) {
  console.log("Compiling C++ pathfinder...");
  const compileCmd = `g++ -O3 -std=c++17 "${cppPath}" -o "${binaryPath}"`;
  exec(compileCmd, (err, stdout, stderr) => {
    if (err) {
      console.warn("WARNING: C++ Compilation failed. Falling back to JS Pathfinder Engine:", stderr || err.message);
    } else {
      console.log("C++ pathfinder compiled successfully at:", binaryPath);
      // Give execution rights on Unix
      try {
        fs.chmodSync(binaryPath, "755");
      } catch (chmodErr) {
        console.warn("Chmod warning:", chmodErr.message);
      }
    }
  });
} else {
  console.warn("WARNING: cpp/pathfinder.cpp not found. JS fallback engine will be used.");
}

// ── Security Middleware ──
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) || 
      origin.includes("localhost") || 
      origin.includes("127.0.0.1") ||
      origin.endsWith(".onrender.com")
    ) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests. Please try again later." }
});
app.use("/api", globalLimiter);

// ── Connect DB ──
connectDB();

// ── Express Routes ──

// 1. AUTHENTICATION

// User Registration
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, registrationNo, email, password } = req.body;
    if (!name || !registrationNo || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const normEmail = email.toLowerCase().trim();
    const normRegNo = registrationNo.toUpperCase().trim();

    const existingEmail = await User.findOne({ email: normEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email address already registered" });
    }

    const existingRegNo = await User.findOne({ registrationNo: normRegNo });
    if (existingRegNo) {
      return res.status(400).json({ success: false, message: "Registration number already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      registrationNo: normRegNo,
      email: normEmail,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        registrationNo: newUser.registrationNo,
        role: newUser.role,
        favorites: newUser.favorites,
        history: newUser.history
      }
    });
  } catch (error) {
    next(error);
  }
});

// User Login
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, registrationNo, password } = req.body;
    if ((!email && !registrationNo) || !password) {
      return res.status(400).json({ success: false, message: "Please provide credentials" });
    }

    const query = {};
    if (email) query.email = email.toLowerCase().trim();
    else if (registrationNo) query.registrationNo = registrationNo.toUpperCase().trim();

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Welcome back!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationNo: user.registrationNo,
        role: user.role,
        favorites: user.favorites,
        history: user.history
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get profile
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      registrationNo: req.user.registrationNo,
      role: req.user.role,
      favorites: req.user.favorites,
      history: req.user.history
    }
  });
});


// 2. PATHFINDER / ROUTING API

app.get("/api/routes/route", async (req, res, next) => {
  try {
    const { from, to, algo = "dijkstra", accessibility = "0" } = req.query;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: "From and To nodes are required" });
    }

    const accessFlag = accessibility === "true" || accessibility === "1" ? "1" : "0";

    // Try C++ Pathfinder first
    if (fs.existsSync(binaryPath)) {
      const command = `"${binaryPath}" "${algo}" "${from}" "${to}" "${accessFlag}"`;
      
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.warn("C++ Pathfinder execution failed, falling back to JS solver:", stderr || err.message);
          return runJSSolver(algo, from, to, accessFlag === "1", res);
        }
        
        try {
          const result = JSON.parse(stdout.trim());
          res.json(result);
        } catch (parseErr) {
          console.warn("C++ stdout parse failed, falling back to JS solver:", stdout);
          return runJSSolver(algo, from, to, accessFlag === "1", res);
        }
      });
    } else {
      // Fallback directly to JS solver
      return runJSSolver(algo, from, to, accessFlag === "1", res);
    }
  } catch (error) {
    next(error);
  }
});

// Helper to run JS solver
function runJSSolver(algo, from, to, accessOnly, res) {
  let result;
  if (algo === "dijkstra") {
    result = jsPathfinder.solveDijkstra(from, to, accessOnly);
  } else if (algo === "bfs") {
    result = jsPathfinder.solveBFS(from, to, accessOnly);
  } else if (algo === "dfs") {
    result = jsPathfinder.solveDFS(from, to, accessOnly);
  } else {
    return res.status(400).json({ success: false, message: "Invalid algorithm" });
  }
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
}


// 3. FAVORITES & HISTORY ENDPOINTS

// Update favorites
app.put("/api/user/favorites", authMiddleware, async (req, res, next) => {
  try {
    const { favorites } = req.body;
    if (!Array.isArray(favorites)) {
      return res.status(400).json({ success: false, message: "Favorites must be an array" });
    }

    req.user.favorites = favorites;
    await req.user.save();
    
    res.json({ success: true, message: "Favorites updated successfully", favorites });
  } catch (error) {
    next(error);
  }
});

// Log navigation history query
app.post("/api/user/history", authMiddleware, async (req, res, next) => {
  try {
    const { from, to, distance, time } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, message: "Missing history values" });
    }

    const logEntry = {
      from,
      to,
      distance,
      time,
      date: new Date()
    };

    req.user.history.unshift(logEntry);
    await req.user.save();

    res.status(201).json({ success: true, message: "History logged successfully", history: req.user.history });
  } catch (error) {
    next(error);
  }
});


// Health Check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CCNS Backend is running" });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`CCNS Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
