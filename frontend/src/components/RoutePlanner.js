import React, { useState, useEffect } from "react";
import { CAMPUS_NODES, generateDirections, dijkstra, bfs, dfs } from "../services/mapData";
import { useAuth } from "../context/AuthContext";

const RoutePlanner = ({
  selectedFrom,
  selectedTo,
  setSelectedFrom,
  setSelectedTo,
  setRoutePath,
  setRouteInfo,
  routeInfo,
  accessibility
}) => {
  const [algo, setAlgo] = useState("dijkstra"); // dijkstra, bfs, dfs
  const [directions, setDirections] = useState([]);
  const [altRouteInfo, setAltRouteInfo] = useState(null);
  const [showAlt, setShowAlt] = useState(false);
  const { addHistory } = useAuth();

  // Filter out junction nodes for selection dropdowns
  const pois = Object.values(CAMPUS_NODES).filter((n) => n.isPOI);

  const handleSwap = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
    setRoutePath([]);
    setRouteInfo(null);
    setAltRouteInfo(null);
    setDirections([]);
  };

  const handleFindRoute = () => {
    if (!selectedFrom || !selectedTo) return;

    let result = null;
    
    // Run selected pathfinding algorithm
    if (algo === "dijkstra") {
      result = dijkstra(selectedFrom, selectedTo, accessibility);
    } else if (algo === "bfs") {
      result = bfs(selectedFrom, selectedTo, accessibility);
    } else if (algo === "dfs") {
      result = dfs(selectedFrom, selectedTo, accessibility);
    }

    if (result && result.path.length > 0) {
      setRoutePath(result.path);
      setRouteInfo(result);
      setDirections(generateDirections(result.path));
      
      // Add to user navigation history log
      const startNodeName = CAMPUS_NODES[selectedFrom].name;
      const endNodeName = CAMPUS_NODES[selectedTo].name;
      addHistory({
        from: startNodeName,
        to: endNodeName,
        distance: `${result.distance}m`,
        time: `${result.time} min`
      });

      // Calculate an Alternative Route using DFS for contrast (unless DFS is already selected)
      if (algo !== "dfs") {
        const altResult = dfs(selectedFrom, selectedTo, accessibility);
        // Make sure it is actually different
        if (altResult && altResult.path.length > 0 && JSON.stringify(altResult.path) !== JSON.stringify(result.path)) {
          setAltRouteInfo(altResult);
        } else {
          setAltRouteInfo(null);
        }
      } else {
        // If DFS selected, show Dijkstra as Alternative
        const altResult = dijkstra(selectedFrom, selectedTo, accessibility);
        if (altResult && altResult.path.length > 0 && JSON.stringify(altResult.path) !== JSON.stringify(result.path)) {
          setAltRouteInfo(altResult);
        } else {
          setAltRouteInfo(null);
        }
      }
    } else {
      alert("No route found! Paths might be blocked by accessibility filters.");
    }
  };

  // Re-run pathfinding when accessibility filter shifts
  useEffect(() => {
    if (selectedFrom && selectedTo && routeInfo) {
      handleFindRoute();
    }
    // eslint-disable-next-line
  }, [accessibility, algo]);

  const selectAltRoute = () => {
    if (altRouteInfo) {
      // Swap active route with alternative route
      const tempPath = [...altRouteInfo.path];
      const tempInfo = { ...altRouteInfo };
      
      // Calculate alternative for the new active route
      let currentAlgoResult = null;
      if (algo === "dijkstra") {
        currentAlgoResult = dijkstra(selectedFrom, selectedTo, accessibility);
      } else {
        currentAlgoResult = dfs(selectedFrom, selectedTo, accessibility);
      }

      setRoutePath(tempPath);
      setRouteInfo(tempInfo);
      setDirections(generateDirections(tempPath));
      setAltRouteInfo(currentAlgoResult);
      setShowAlt(false);
    }
  };

  return (
    <div className="route-planner-panel">
      <div className="planner-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h9a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-5"/></svg>
        <h3>Route Planner</h3>
      </div>

      {/* Input Selection Block */}
      <div className="route-inputs-container">
        <div className="route-inputs-col">
          {/* FROM Dropdown */}
          <div className="input-node-wrapper">
            <span className="input-node-indicator from" />
            <select
              className="select-node-input"
              value={selectedFrom}
              onChange={(e) => {
                setSelectedFrom(e.target.value);
                setRoutePath([]);
                setRouteInfo(null);
                setAltRouteInfo(null);
                setDirections([]);
              }}
            >
              <option value="">Choose starting point...</option>
              {pois.map((node) => (
                <option key={node.id} value={node.id} disabled={node.id === selectedTo}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>

          {/* TO Dropdown */}
          <div className="input-node-wrapper">
            <span className="input-node-indicator to" />
            <select
              className="select-node-input"
              value={selectedTo}
              onChange={(e) => {
                setSelectedTo(e.target.value);
                setRoutePath([]);
                setRouteInfo(null);
                setAltRouteInfo(null);
                setDirections([]);
              }}
            >
              <option value="">Choose destination...</option>
              {pois.map((node) => (
                <option key={node.id} value={node.id} disabled={node.id === selectedFrom}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Nodes Button */}
        <button 
          className="swap-nodes-btn" 
          onClick={handleSwap} 
          title="Swap starting & end point"
          aria-label="Swap nodes"
        >
          ↕
        </button>
      </div>

      {/* Algorithm Choice */}
      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label className="form-label">Search Algorithm</label>
        <select
          className="select-node-input"
          style={{ paddingLeft: "14px" }}
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
        >
          <option value="dijkstra">(Recommended) Dijkstra's Shortest Path</option>
          <option value="bfs">BFS (Fewest Hops)</option>
          <option value="dfs">DFS (Alternative Paths)</option>
        </select>
      </div>

      {/* Find Route Button */}
      <button 
        className="btn-find-route" 
        onClick={handleFindRoute}
        disabled={!selectedFrom || !selectedTo}
        style={{ opacity: (!selectedFrom || !selectedTo) ? 0.6 : 1, cursor: (!selectedFrom || !selectedTo) ? "not-allowed" : "pointer" }}
      >
        Find Route
      </button>

      {/* Output Directions Pane */}
      {routeInfo && (
        <div className="route-output-container">
          <div className="route-best-header">
            <div className="route-best-label">
              <h4>Best Route</h4>
            </div>
            <span className="recommend-badge">Recommended</span>
          </div>

          {/* Time & Distance Row */}
          <div className="route-stats-summary">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              ⏱ {routeInfo.time} min ({routeInfo.distance}m)
            </span>
            <span>🚶 Walking</span>
          </div>

          {/* Steps list */}
          <div className="route-directions-list">
            {directions.map((step) => (
              <div className="direction-step" key={step.step}>
                <div className="step-number-dot">{step.step}</div>
                <div className="step-details">
                  <p className="step-instruction">{step.instruction}</p>
                  {step.distance && <p className="step-distance">{step.distance}</p>}
                </div>
              </div>
            ))}

            {/* Alternative Route Expander */}
            {altRouteInfo && (
              <div 
                className="alt-route-card" 
                onClick={() => {
                  setShowAlt(!showAlt);
                  selectAltRoute();
                }}
                title="Switch to alternative route"
              >
                <span>Alternative Route</span>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                  ⏱ {altRouteInfo.time} min ({altRouteInfo.distance}m) ➔
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
