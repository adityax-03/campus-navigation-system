import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Landing.css";

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartNavigating = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header glassmorphism">
        <div className="logo-container">
          <div className="logo-icon">R</div>
          <div className="logo-text">
            <h1>CCNS</h1>
            <p>Campus Navigation System</p>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          <Link to={user ? "/dashboard" : "/login"} className="btn-header">
            {user ? "Go to Dashboard" : "Get Started →"}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-tag">
            <span>★</span> Smart Navigation, Seamless Campus
          </div>

          <h2 className="hero-heading">
            Navigate Your Campus<br />
            With <span>Ease & Confidence</span>
          </h2>

          <p className="hero-subtitle">
            Find the shortest paths to any building, classroom, hostel, or facility on campus. 
            Powered by graph algorithms like Dijkstra, BFS, and DFS. Save time, explore more.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartNavigating}>
              Start Navigating 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="#features" className="btn-secondary">
              Explore Features
            </a>
          </div>

          {/* Feature Mini Cards */}
          <div className="mini-features" id="features">
            <div className="mini-feature-card glassmorphism">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h40M21 3h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h40M9 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h40M21 13h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h40"/></svg>
              </div>
              <div className="feature-info">
                <h4>Shortest Routes</h4>
                <p>Using advanced graph algorithms</p>
              </div>
            </div>

            <div className="mini-feature-card glassmorphism">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="feature-info">
                <h4>Live Map</h4>
                <p>Interactive & easy to use</p>
              </div>
            </div>

            <div className="mini-feature-card glassmorphism">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>
              </div>
              <div className="feature-info">
                <h4>Nearby Places</h4>
                <p>Find places around you</p>
              </div>
            </div>

            <div className="mini-feature-card glassmorphism">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <div className="feature-info">
                <h4>Save Favorites</h4>
                <p>Quick access to saved spots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Isometric Map Illustration */}
        <div className="hero-illustration">
          <div className="illustration-svg-container">
            <svg 
              viewBox="0 0 600 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "auto" }}
            >
              {/* Isometric Grid Background */}
              <g opacity="0.15" stroke="var(--primary-color)" strokeWidth="1">
                <path d="M 300 0 L 600 150 L 300 300 L 0 150 Z" />
                <path d="M 300 100 L 600 250 L 300 400 L 0 250 Z" />
                <path d="M 300 200 L 600 350 L 300 500 L 0 350 Z" />
                {/* Diagonal lines */}
                <path d="M 100 200 L 400 350" />
                <path d="M 200 150 L 500 300" />
                <path d="M 400 150 L 100 300" />
                <path d="M 500 200 L 200 350" />
              </g>

              {/* Grid Plate (Island) */}
              <path 
                d="M 300 50 L 550 175 L 300 300 L 50 175 Z" 
                fill={isDark ? "#1f2937" : "#e2e8f0"} 
                stroke={isDark ? "#374151" : "#cbd5e1"} 
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Roads / Paths */}
              <g stroke={isDark ? "#374151" : "#ffffff"} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                {/* Main Gate to Central Plaza road */}
                <path d="M 300 300 L 300 200" />
                {/* Left wing road to Library & Block 32 */}
                <path d="M 300 200 L 150 160" />
                <path d="M 150 160 L 100 210" />
                {/* Right wing road to Hostel & Block 38 */}
                <path d="M 300 200 L 450 180" />
                <path d="M 450 180 L 480 230" />
                {/* Central top road */}
                <path d="M 300 200 L 320 120" />
              </g>

              <g stroke={isDark ? "#4b5563" : "#e2e8f0"} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                <path d="M 300 300 L 300 200" />
                <path d="M 300 200 L 150 160" />
                <path d="M 150 160 L 100 210" />
                <path d="M 300 200 L 450 180" />
                <path d="M 450 180 L 480 230" />
                <path d="M 300 200 L 320 120" />
              </g>

              {/* Isometric Buildings */}
              
              {/* Library (Purple) */}
              <g transform="translate(130, 110)">
                {/* Left side */}
                <path d="M 0 30 L 25 42.5 L 25 72.5 L 0 60 Z" fill="#c084fc" />
                {/* Right side */}
                <path d="M 25 42.5 L 50 30 L 50 60 L 25 72.5 Z" fill="#a855f7" />
                {/* Top face */}
                <path d="M 0 30 L 25 17.5 L 50 30 L 25 42.5 Z" fill="#d8b4fe" />
                {/* Label */}
                <rect x="-5" y="-5" width="60" height="18" rx="4" fill="white" stroke="#a855f7" strokeWidth="1" />
                <text x="25" y="7" fill="#6b21a8" fontSize="9" fontWeight="700" textAnchor="middle">Library</text>
              </g>

              {/* Hostel A (Red/Pink) */}
              <g transform="translate(420, 120)">
                <path d="M 0 25 L 20 35 L 20 65 L 0 55 Z" fill="#f87171" />
                <path d="M 20 35 L 40 25 L 40 55 L 20 65 Z" fill="#ef4444" />
                <path d="M 0 25 L 20 15 L 40 25 L 20 35 Z" fill="#fca5a5" />
                <rect x="-5" y="-10" width="50" height="18" rx="4" fill="white" stroke="#ef4444" strokeWidth="1" />
                <text x="20" y="2" fill="#991b1b" fontSize="9" fontWeight="700" textAnchor="middle">Hostel A</text>
              </g>

              {/* Cafeteria (Orange) */}
              <g transform="translate(300, 80)">
                <path d="M 0 20 L 15 27.5 L 15 52.5 L 0 45 Z" fill="#fb923c" />
                <path d="M 15 27.5 L 30 20 L 30 45 L 15 52.5 Z" fill="#f97316" />
                <path d="M 0 20 L 15 12.5 L 30 20 L 15 27.5 Z" fill="#fdbaf8" opacity="0" />
                <path d="M 0 20 L 15 12.5 L 30 20 L 15 27.5 Z" fill="#ffedd5" />
                <rect x="-10" y="-15" width="50" height="18" rx="4" fill="white" stroke="#f97316" strokeWidth="1" />
                <text x="15" y="-3" fill="#c2410c" fontSize="8" fontWeight="700" textAnchor="middle">Cafeteria</text>
              </g>

              {/* Block 32 (Blue/Green) */}
              <g transform="translate(80, 170)">
                <path d="M 0 25 L 20 35 L 20 65 L 0 55 Z" fill="#6ee7b7" />
                <path d="M 20 35 L 40 25 L 40 55 L 20 65 Z" fill="#34d399" />
                <path d="M 0 25 L 20 15 L 40 25 L 20 35 Z" fill="#a7f3d0" />
                <rect x="-10" y="-10" width="60" height="18" rx="4" fill="white" stroke="#10b981" strokeWidth="1" />
                <text x="20" y="2" fill="#065f46" fontSize="9" fontWeight="700" textAnchor="middle">Block 32</text>
              </g>

              {/* Auditorium (Teal/Blue) */}
              <g transform="translate(340, 240)">
                <path d="M 0 35 L 30 50 L 30 80 L 0 65 Z" fill="#38bdf8" />
                <path d="M 30 50 L 60 35 L 60 65 L 30 80 Z" fill="#0284c7" />
                <path d="M 0 35 L 30 20 L 60 35 L 30 50 Z" fill="#bae6fd" />
                <rect x="5" y="0" width="50" height="18" rx="4" fill="white" stroke="#0284c7" strokeWidth="1" />
                <text x="30" y="12" fill="#075985" fontSize="8" fontWeight="700" textAnchor="middle">Auditorium</text>
              </g>

              {/* Main Gate (Gray) */}
              <g transform="translate(280, 280)">
                <circle cx="20" cy="20" r="10" fill="#6b7280" />
                <circle cx="20" cy="20" r="6" fill="#f3f4f6" />
                <rect x="-5" y="32" width="50" height="18" rx="4" fill="white" stroke="#4b5563" strokeWidth="1" />
                <text x="20" y="44" fill="#1f2937" fontSize="8" fontWeight="700" textAnchor="middle">Main Gate</text>
              </g>

              {/* Animated Path (Navigation Path Line) */}
              {/* Path from Main Gate (300, 300) -> Central Plaza (300, 200) -> Left (150, 160) -> Block 32 (100, 195) */}
              <g>
                {/* Outer pulsing stroke */}
                <path 
                  d="M 300 300 L 300 200 L 150 160 L 100 195" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.3"
                />
                {/* Main animated line */}
                <path 
                  d="M 300 300 L 300 200 L 150 160 L 100 195" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeDasharray="10 10"
                  style={{ animation: "march 1s linear infinite" }}
                />
              </g>

              {/* Start Marker (Pulse) */}
              <g transform="translate(300, 300)">
                <circle cx="0" cy="0" r="12" fill="#6366f1" opacity="0.3">
                  <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="5" fill="#6366f1" />
              </g>

              {/* End Marker (Location Pin) */}
              {/* Placed at Block 32 node (100, 195) */}
              <g transform="translate(100, 195)">
                {/* Pin Shadow */}
                <ellipse cx="0" cy="3" rx="6" ry="3" fill="black" opacity="0.2" />
                {/* Pin Body */}
                <path 
                  d="M 0 0 C -6 -6 -10 -12 -10 -18 C -10 -24 -5 -29 0 -29 C 5 -29 10 -24 10 -18 C 10 -12 6 -6 0 0 Z" 
                  fill="#ef4444" 
                  stroke="white" 
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-18" r="4.5" fill="white" />
              </g>

              {/* Floating dynamic text labels matching the design */}
              <g transform="translate(340, 180)">
                <rect x="0" y="0" width="100" height="24" rx="12" fill="#1e293b" opacity="0.8" />
                <text x="50" y="15" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">
                  Best Route: 8 min
                </text>
              </g>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
