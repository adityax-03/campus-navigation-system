import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = ({ setSearchQuery }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="dashboard-header">
      {/* Universal Search Bar */}
      <div className="header-search-container">
        <span className="header-search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
        <input
          type="text"
          className="header-search-input"
          placeholder="Search LPU campus (e.g. Block 34, Block 13, Girls Hostel)..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Theme Toggle */}
        <button
          className="header-action-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>

        {/* Notifications */}
        <button className="header-action-btn" title="Notifications" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="notification-badge">3</span>
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: "relative" }}>
          <div
            className="header-profile-dropdown"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="profile-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="profile-info-text">
              <h4>{user?.name || "Aditya Gupta"}</h4>
              <p>{user?.role || "Student"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>

          {showDropdown && (
            <div
              className="glassmorphism"
              style={{
                position: "absolute",
                right: 0,
                top: "50px",
                width: "160px",
                borderRadius: "10px",
                padding: "8px",
                boxShadow: "var(--shadow-md)",
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ padding: "6px 10px", fontSize: "11px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}>
                ID: {user?.registrationNo || "2023CS45"}
              </div>
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "6px",
                  color: "var(--error)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => {
                  logout();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
