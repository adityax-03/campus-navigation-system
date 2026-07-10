import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";
import { CAMPUS_NODES } from "../services/mapData";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, updateFavorites } = useAuth();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState("home"); // home, map, route-planner, favorites, history, profile, settings, etc.
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Map / Navigation State
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [routePath, setRoutePath] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  
  // Layer Toggles
  const [accessibility, setAccessibility] = useState(true);
  const [trafficView, setTrafficView] = useState(false);
  const [crowdView, setCrowdView] = useState(false);

  // Filter nodes for search query
  const filteredPOIs = searchQuery
    ? Object.values(CAMPUS_NODES).filter(
        (n) => n.isPOI && n.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchedNode = (nodeId) => {
    setSelectedTo(nodeId);
    setSearchQuery("");
    setActiveTab("home");
  };

  const handleToggleFavorite = (nodeId) => {
    const currentFavs = user?.favorites || [];
    if (currentFavs.includes(nodeId)) {
      updateFavorites(currentFavs.filter((id) => id !== nodeId));
    } else {
      updateFavorites([...currentFavs, nodeId]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        return (
          <div className="glassmorphism" style={{ padding: "30px", borderRadius: "16px", animation: "fadeIn 0.4s" }}>
            <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              ❤️ Saved Favorites
            </h2>
            {user?.favorites && user.favorites.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                {user.favorites.map((favId) => {
                  const node = CAMPUS_NODES[favId];
                  if (!node) return null;
                  return (
                    <div
                      key={favId}
                      className="glassmorphism"
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        textAlign: "left"
                      }}
                    >
                      <h4 style={{ fontSize: "15px", fontWeight: "700" }}>{node.name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", flex: 1 }}>{node.desc}</p>
                      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        <button
                          className="btn-sidebar-promo"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => {
                            setSelectedTo(favId);
                            setActiveTab("home");
                          }}
                        >
                          Navigate Here
                        </button>
                        <button
                          style={{ color: "var(--error)", fontSize: "14px" }}
                          onClick={() => handleToggleFavorite(favId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No favorites saved yet. Search for a place on the map to add it here!</p>
            )}
          </div>
        );

      case "history":
        return (
          <div className="glassmorphism" style={{ padding: "30px", borderRadius: "16px", animation: "fadeIn 0.4s" }}>
            <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              🕒 Navigation History
            </h2>
            {user?.history && user.history.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "10px" }}>
                    <th style={{ padding: "12px 6px" }}>From</th>
                    <th style={{ padding: "12px 6px" }}>To</th>
                    <th style={{ padding: "12px 6px" }}>Distance</th>
                    <th style={{ padding: "12px 6px" }}>Duration</th>
                    <th style={{ padding: "12px 6px" }}>Query Date</th>
                  </tr>
                </thead>
                <tbody>
                  {user.history.map((log, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px 6px", fontWeight: "600" }}>{log.from}</td>
                      <td style={{ padding: "12px 6px", fontWeight: "600" }}>{log.to}</td>
                      <td style={{ padding: "12px 6px" }}>{log.distance}</td>
                      <td style={{ padding: "12px 6px" }}>{log.time}</td>
                      <td style={{ padding: "12px 6px", fontSize: "12px", color: "var(--text-muted)" }}>
                        {new Date(log.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No navigation logs. Find a route on the map to log history!</p>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="glassmorphism" style={{ padding: "35px", borderRadius: "16px", maxWidth: "500px", margin: "0 auto", textAlign: "left", animation: "fadeIn 0.4s" }}>
            <h2 style={{ marginBottom: "24px" }}>👤 Student Profile</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
              <div 
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "50%", 
                  background: "var(--primary-gradient)", 
                  color: "white", 
                  fontSize: "24px", 
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {user?.name ? user.name[0] : "A"}
              </div>
              <div>
                <h3 style={{ fontSize: "18px" }}>{user?.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{user?.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Registration Number</span>
                <p style={{ fontWeight: "600" }}>{user?.registrationNo}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>College Email Address</span>
                <p style={{ fontWeight: "600" }}>{user?.email}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Account Status</span>
                <p style={{ color: "var(--success)", fontWeight: "700" }}>Active (Offline Mode Fallback)</p>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="glassmorphism" style={{ padding: "30px", borderRadius: "16px", maxWidth: "600px", margin: "0 auto", textAlign: "left", animation: "fadeIn 0.4s" }}>
            <h2 style={{ marginBottom: "20px" }}>⚙️ Application Settings</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "15px" }}>Preferred Navigation Filter</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Always prioritize wheelchair accessible routes with ramps and elevators.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "15px" }}>Traffic Route Compensation</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Reroute dynamically if walkways are congested or crowded.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={trafficView} onChange={(e) => setTrafficView(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px" }}>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "15px" }}>Graph Solver Backend</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Use high-performance C++ solver executable in background.</p>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary-color)" }}>Auto Fallback Enabled</span>
              </div>
            </div>
          </div>
        );

      default: // 'home', 'map', 'route-planner'
        return (
          <>
            {/* Top Stats Cards (Pictured in mockup) */}
            <div className="stats-cards-grid">
              <div className="stats-card">
                <div className="stats-card-icon academic">🏫</div>
                <div className="stats-card-info">
                  <h3>12 Buildings</h3>
                  <p>Academic Blocks</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon hostels">🏠</div>
                <div className="stats-card-info">
                  <h3>8 Hostels</h3>
                  <p>Student Hostels</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon cafeteria">☕</div>
                <div className="stats-card-info">
                  <h3>5 Cafeterias</h3>
                  <p>Food Courts</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon library">📖</div>
                <div className="stats-card-info">
                  <h3>2 Libraries</h3>
                  <p>Campus Libraries</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon parking">🅿️</div>
                <div className="stats-card-info">
                  <h3>4 Areas</h3>
                  <p>Parking Lots</p>
                </div>
              </div>
            </div>

            {/* Map & Planner Layout */}
            <div className="map-planner-layout">
              {/* Map Panel */}
              <MapView
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                setSelectedFrom={setSelectedFrom}
                setSelectedTo={setSelectedTo}
                routePath={routePath}
                accessibility={accessibility}
                setAccessibility={setAccessibility}
                trafficView={trafficView}
                setTrafficView={setTrafficView}
                crowdView={crowdView}
                setCrowdView={setCrowdView}
              />

              {/* Route Planner Panel */}
              <RoutePlanner
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                setSelectedFrom={setSelectedFrom}
                setSelectedTo={setSelectedTo}
                setRoutePath={setRoutePath}
                setRouteInfo={setRouteInfo}
                routeInfo={routeInfo}
                accessibility={accessibility}
              />
            </div>

            {/* Bottom Row - Stat / Feature Cards */}
            <div className="bottom-features-row">
              <div className="bottom-feature-card glassmorphism">
                <div className="bottom-card-icon">⚡</div>
                <div className="bottom-card-info">
                  <h4>Shortest Path</h4>
                  <p>Dijkstra computes the absolute shortest walkway paths.</p>
                </div>
              </div>

              <div className="bottom-feature-card glassmorphism" style={{ cursor: "pointer" }} onClick={() => setActiveTab("favorites")}>
                <div className="bottom-card-icon">❤️</div>
                <div className="bottom-card-info">
                  <h4>Save Favorites</h4>
                  <p>Flag places you visit often (like Library) for quick loading.</p>
                </div>
              </div>

              <div className="bottom-feature-card glassmorphism">
                <div className="bottom-card-icon">🛰️</div>
                <div className="bottom-card-info">
                  <h4>Live Updates</h4>
                  <p>Reflects real-time traffic congestion on campus routes.</p>
                </div>
              </div>

              <div className="bottom-feature-card glassmorphism">
                <div className="bottom-card-icon">♿</div>
                <div className="bottom-card-info">
                  <h4>Accessibility Mode</h4>
                  <p>Filters routes to bypass stairways for ramped walkways.</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Area */}
      <div className="dashboard-main">
        {/* Header Action Bar */}
        <Header setSearchQuery={setSearchQuery} />

        {/* Floating Search Results auto-complete popup */}
        {searchQuery && filteredPOIs.length > 0 && (
          <div
            className="glassmorphism"
            style={{
              position: "absolute",
              left: "290px",
              top: "65px",
              width: "420px",
              borderRadius: "12px",
              boxShadow: "var(--shadow-lg)",
              zIndex: 100,
              padding: "10px",
              textAlign: "left",
              animation: "fadeIn 0.2s"
            }}
          >
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", paddingLeft: "6px" }}>
              Suggested Campus Locations:
            </p>
            {filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                onClick={() => handleSelectSearchedNode(poi.id)}
                className="search-item-row"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: "700", fontSize: "13.5px" }}>{poi.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{poi.desc}</div>
                </div>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--bg-input)" }}>
                  {poi.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Dashboard Body */}
        <div className="dashboard-body">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
