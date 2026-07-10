import React, { useState } from "react";
import { CAMPUS_NODES, CAMPUS_EDGES } from "../services/mapData";

const MapView = ({
  selectedFrom,
  selectedTo,
  setSelectedFrom,
  setSelectedTo,
  routePath,
  accessibility,
  setAccessibility,
  trafficView,
  setTrafficView,
  crowdView,
  setCrowdView
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    // Only drag on canvas backgrounds
    if (e.target.tagName === "svg" || e.target.id === "map-bg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = (nodeId) => {
    // If from is empty, set as from. Else, if to is empty, set as to.
    if (!selectedFrom) {
      setSelectedFrom(nodeId);
    } else if (!selectedTo && nodeId !== selectedFrom) {
      setSelectedTo(nodeId);
    } else {
      // Toggle
      setSelectedFrom(nodeId);
      setSelectedTo("");
    }
  };

  // Convert route path node list into coordinates line string
  const getPathD = () => {
    if (!routePath || routePath.length < 2) return "";
    return routePath
      .map((id, index) => {
        const node = CAMPUS_NODES[id];
        if (!node) return "";
        return `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`;
      })
      .join(" ");
  };

  return (
    <div 
      className="map-panel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Zoom Controls */}
      <div className="map-zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">+</button>
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">-</button>
        <button className="zoom-btn" onClick={handleResetZoom} title="Reset View" style={{ fontSize: "12px" }}>⌖</button>
      </div>

      {/* Map Options Toggle Overlay (top right) */}
      <div className="map-options-card glassmorphism">
        <div className="map-option-row">
          <span>Traffic View</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={trafficView}
              onChange={(e) => setTrafficView(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="map-option-row">
          <span>Crowd View</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={crowdView}
              onChange={(e) => setCrowdView(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="map-option-row">
          <span>Accessibility</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={accessibility}
              onChange={(e) => setAccessibility(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Legend */}
        <div className="legend-divider">
          <div className="legend-item">
            <div className="legend-line best" />
            <span>Best Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line alt" />
            <span>Alternative</span>
          </div>
        </div>
      </div>

      {/* Scale & Details bottom-left */}
      <div className="map-scale-indicator">
        <div className="scale-bar" />
        <span>50 m</span>
      </div>

      {/* Main SVG Map Canvas */}
      <svg
        className="map-svg"
        viewBox="0 0 700 550"
        onMouseMove={handleMouseMove}
      >
        {/* Background Clickable Drag Area */}
        <rect id="map-bg" x="0" y="0" width="100%" height="100%" fill="none" pointerEvents="all" />

        {/* Pan and Zoom Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: "center", transition: isDragging ? "none" : "transform 0.1s" }}>
          
          {/* Main campus green area */}
          <rect x="50" y="40" width="600" height="470" rx="20" fill="var(--bg-map)" opacity="0.6" stroke="var(--border-color)" strokeWidth="2" />
          
          {/* Central Plaza Park Circle */}
          <circle cx="350" cy="310" r="45" fill="#d1fae5" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
          <text x="350" y="313" fill="#065f46" fontSize="9" fontWeight="700" textAnchor="middle" opacity="0.6">Central Plaza</text>

          {/* Draw Roads / Connections */}
          <g>
            {CAMPUS_EDGES.map((edge, index) => {
              const fromNode = CAMPUS_NODES[edge.from];
              const toNode = CAMPUS_NODES[edge.to];
              if (!fromNode || !toNode) return null;

              // Accessibility styles
              let strokeColor = "var(--border-color)";
              if (accessibility && !edge.accessible) {
                strokeColor = "rgba(239, 68, 68, 0.4)"; // Highlight inaccessible roads in red
              }

              return (
                <line
                  key={`edge-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor === "var(--border-color)" ? "rgba(148, 163, 184, 0.15)" : strokeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          <g>
            {CAMPUS_EDGES.map((edge, index) => {
              const fromNode = CAMPUS_NODES[edge.from];
              const toNode = CAMPUS_NODES[edge.to];
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={`edge-inner-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="var(--bg-card)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Traffic / Crowd Heat Overlays */}
          {trafficView && (
            <g opacity="0.35">
              {/* Traffic hotspot around main gate & plaza */}
              <circle cx="350" cy="460" r="28" fill="#ef4444" />
              <circle cx="350" cy="390" r="22" fill="#f97316" />
              <circle cx="250" cy="310" r="18" fill="#eab308" />
            </g>
          )}

          {crowdView && (
            <g opacity="0.35">
              {/* Crowd hotspot around cafeteria & library */}
              <circle cx="315" cy="190" r="32" fill="#ef4444" />
              <circle cx="190" cy="170" r="26" fill="#f97316" />
              <circle cx="440" cy="415" r="20" fill="#eab308" />
            </g>
          )}

          {/* Render Route Paths */}
          {routePath && routePath.length >= 2 && (
            <g>
              {/* Main pathway stroke */}
              <path
                d={getPathD()}
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              {/* Moving dots walker indicator */}
              <path
                d={getPathD()}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 8"
                style={{ animation: "march 1.5s linear infinite" }}
              />
            </g>
          )}

          {/* Render Waypoints / Nodes */}
          {Object.values(CAMPUS_NODES).map((node) => {
            // Determine size, color & status
            const isPOI = node.isPOI;
            const isSelectedFrom = selectedFrom === node.id;
            const isSelectedTo = selectedTo === node.id;
            
            if (!isPOI) {
              // Junction node: render small invisible or tiny grey dot
              return (
                <circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  fill="rgba(148, 163, 184, 0.4)"
                  pointerEvents="none"
                />
              );
            }

            let nodeFill = "var(--bg-sidebar)";
            let strokeColor = "var(--primary-color)";
            let nodeRadius = 8;
            let iconText = "";

            if (isSelectedFrom) {
              nodeFill = "var(--success)";
              strokeColor = "#ffffff";
              nodeRadius = 10;
            } else if (isSelectedTo) {
              nodeFill = "var(--error)";
              strokeColor = "#ffffff";
              nodeRadius = 10;
            }

            // Assign icons based on building type
            switch (node.type) {
              case "academic": iconText = "🏫"; break;
              case "library": iconText = "📖"; break;
              case "cafeteria": iconText = "☕"; break;
              case "parking": iconText = "🅿️"; break;
              case "hostel": iconText = "🏠"; break;
              case "sports": iconText = "⚽"; break;
              case "gate": iconText = "🚪"; break;
              default: iconText = "📍";
            }

            return (
              <g 
                key={node.id} 
                className="map-node-dot"
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Ring Outline */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={isSelectedFrom ? "var(--success)" : isSelectedTo ? "var(--error)" : "rgba(99, 102, 241, 0.15)"}
                  strokeWidth="2.5"
                  style={{
                    animation: (isSelectedFrom || isSelectedTo) ? "pulseBorder 1.8s infinite" : "none"
                  }}
                />
                {/* Node core circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={nodeFill}
                  stroke={isSelectedFrom || isSelectedTo ? strokeColor : "var(--primary-color)"}
                  strokeWidth="2"
                />

                {/* Building Icon (Hover Indicator) */}
                <text
                  x={node.x}
                  y={node.y + 3}
                  fontSize="8"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {!isSelectedFrom && !isSelectedTo && iconText}
                </text>

                {/* Node Text Label */}
                <text
                  x={node.x}
                  y={node.y - (nodeRadius + 7)}
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                  className="map-label"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Render Green/Red Pins on top of Selected Start/End Nodes */}
          {selectedFrom && CAMPUS_NODES[selectedFrom] && (
            <g transform={`translate(${CAMPUS_NODES[selectedFrom].x}, ${CAMPUS_NODES[selectedFrom].y - 4})`} pointerEvents="none">
              <ellipse cx="0" cy="3" rx="4" ry="2" fill="black" opacity="0.15" />
              <path d="M 0 0 C -3 -3 -5 -6 -5 -9 C -5 -12 -2.5 -14.5 0 -14.5 C 2.5 -14.5 5 -12 5 -9 C 5 -6 3 -3 0 0 Z" fill="var(--success)" stroke="white" strokeWidth="1" />
              <circle cx="0" cy="-9" r="2.2" fill="white" />
            </g>
          )}

          {selectedTo && CAMPUS_NODES[selectedTo] && (
            <g transform={`translate(${CAMPUS_NODES[selectedTo].x}, ${CAMPUS_NODES[selectedTo].y - 4})`} pointerEvents="none">
              <ellipse cx="0" cy="3" rx="4" ry="2" fill="black" opacity="0.15" />
              <path d="M 0 0 C -3 -3 -5 -6 -5 -9 C -5 -12 -2.5 -14.5 0 -14.5 C 2.5 -14.5 5 -12 5 -9 C 5 -6 3 -3 0 0 Z" fill="var(--error)" stroke="white" strokeWidth="1" />
              <circle cx="0" cy="-9" r="2.2" fill="white" />
            </g>
          )}
        </g>
      </svg>

      {/* Floating Node Info Hover Card Tooltip */}
      {hoveredNode && (
        <div
          className="glassmorphism"
          style={{
            position: "absolute",
            left: "20px",
            bottom: "20px",
            width: "200px",
            padding: "12px",
            borderRadius: "12px",
            boxShadow: "var(--shadow-md)",
            zIndex: 30,
            animation: "fadeIn 0.2s ease-out",
            pointerEvents: "none",
            textAlign: "left"
          }}
        >
          <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>
            {hoveredNode.name}
          </h4>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
            {hoveredNode.desc}
          </p>
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              fontWeight: "700",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary-dark)"
            }}
          >
            {hoveredNode.type}
          </span>
        </div>
      )}
    </div>
  );
};

export default MapView;
