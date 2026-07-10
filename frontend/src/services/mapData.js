// Campus map dataset and pathfinding engine for CCNS

export const CAMPUS_NODES = {
  // POIs (Buildings & Facilities)
  "block-32": { id: "block-32", name: "Block 32", x: 160, y: 340, type: "academic", desc: "School of Engineering & Technology", isPOI: true },
  "admin-block": { id: "admin-block", name: "Admin Block", x: 130, y: 250, type: "academic", desc: "Main Administrative Building", isPOI: true },
  "library": { id: "library", name: "Library", x: 190, y: 170, type: "library", desc: "Central Library", isPOI: true },
  "block-31": { id: "block-31", name: "Block 31", x: 260, y: 120, type: "academic", desc: "School of Humanities & Sciences", isPOI: true },
  "cafeteria": { id: "cafeteria", name: "Cafeteria", x: 315, y: 190, type: "cafeteria", desc: "Campus Main Food Court", isPOI: true },
  "block-33": { id: "block-33", name: "Block 33", x: 270, y: 410, type: "academic", desc: "Department of Management Studies", isPOI: true },
  "parking-1": { id: "parking-1", name: "Parking Area 1", x: 270, y: 460, type: "parking", desc: "North Car & Bike Parking", isPOI: true },
  "main-gate": { id: "main-gate", name: "Main Gate", x: 350, y: 500, type: "gate", desc: "Main Campus Entrance", isPOI: true },
  "auditorium": { id: "auditorium", name: "Auditorium", x: 440, y: 415, type: "academic", desc: "APJ Abdul Kalam Convocation Hall", isPOI: true },
  "central-plaza": { id: "central-plaza", name: "Central Plaza", x: 350, y: 310, type: "park", desc: "Central Green Park & Social Hub", isPOI: true },
  "hostel-a": { id: "hostel-a", name: "Hostel A", x: 480, y: 130, type: "hostel", desc: "Boys Hostel Block A", isPOI: true },
  "hostel-b": { id: "hostel-b", name: "Hostel B", x: 580, y: 340, type: "hostel", desc: "Girls Hostel Block B", isPOI: true },
  "block-38": { id: "block-38", name: "Block 38", x: 480, y: 250, type: "academic", desc: "Department of Computer Science & IT", isPOI: true },
  "sports-complex": { id: "sports-complex", name: "Sports Complex", x: 550, y: 420, type: "sports", desc: "Sports Field & Gymnasium", isPOI: true },

  // Juncions / Waypoints (Intersection nodes for path drawing, not POIs in select dropdowns)
  "j-gate": { id: "j-gate", name: "Gate Junction", x: 350, y: 460, type: "junction", isPOI: false },
  "j-plaza-south": { id: "j-plaza-south", name: "Plaza South Crossing", x: 350, y: 390, type: "junction", isPOI: false },
  "j-plaza-west": { id: "j-plaza-west", name: "Plaza West Lane", x: 250, y: 310, type: "junction", isPOI: false },
  "j-plaza-east": { id: "j-plaza-east", name: "Plaza East Lane", x: 440, y: 310, type: "junction", isPOI: false },
  "j-plaza-north": { id: "j-plaza-north", name: "Plaza North Crossing", x: 350, y: 250, type: "junction", isPOI: false },
  "j-library": { id: "j-library", name: "Library Crossing", x: 190, y: 220, type: "junction", isPOI: false },
  "j-hostel": { id: "j-hostel", name: "Hostel Lane", x: 480, y: 190, type: "junction", isPOI: false }
};

export const CAMPUS_EDGES = [
  // Roads connecting buildings and junctions
  { from: "main-gate", to: "j-gate", distance: 40, time: 0.5, accessible: true },
  { from: "j-gate", to: "block-33", distance: 80, time: 1.0, accessible: true },
  { from: "block-33", to: "parking-1", distance: 50, time: 0.8, accessible: true },
  { from: "j-gate", to: "j-plaza-south", distance: 70, time: 1.0, accessible: true },
  { from: "j-gate", to: "auditorium", distance: 100, time: 1.5, accessible: true },
  
  // Left Wing (Block 32, Admin, Library)
  { from: "block-33", to: "block-32", distance: 90, time: 1.2, accessible: true },
  { from: "block-32", to: "j-plaza-west", distance: 120, time: 1.8, accessible: true },
  { from: "j-plaza-west", to: "j-plaza-south", distance: 120, time: 1.8, accessible: true },
  { from: "j-plaza-west", to: "admin-block", distance: 80, time: 1.0, accessible: true },
  { from: "admin-block", to: "j-library", distance: 50, time: 0.7, accessible: true },
  { from: "j-library", to: "library", distance: 50, time: 0.7, accessible: true },
  { from: "j-library", to: "j-plaza-north", distance: 160, time: 2.2, accessible: true },

  // Top Wing (Block 31, Cafeteria)
  { from: "library", to: "block-31", distance: 90, time: 1.5, accessible: false }, // Has steps
  { from: "block-31", to: "cafeteria", distance: 80, time: 1.0, accessible: true },
  { from: "cafeteria", to: "j-plaza-north", distance: 60, time: 0.8, accessible: true },

  // Center Plaza Connections
  { from: "central-plaza", to: "j-plaza-south", distance: 80, time: 1.0, accessible: true },
  { from: "central-plaza", to: "j-plaza-north", distance: 80, time: 1.0, accessible: true },
  { from: "central-plaza", to: "j-plaza-west", distance: 100, time: 1.2, accessible: true },
  { from: "central-plaza", to: "j-plaza-east", distance: 100, time: 1.2, accessible: true },

  // Right Wing (Block 38, Hostel A/B, Sports Complex)
  { from: "j-plaza-south", to: "j-plaza-east", distance: 110, time: 1.6, accessible: true },
  { from: "j-plaza-east", to: "block-38", distance: 100, time: 1.4, accessible: true },
  { from: "j-plaza-north", to: "j-hostel", distance: 140, time: 2.0, accessible: true },
  { from: "j-hostel", to: "hostel-a", distance: 60, time: 0.8, accessible: true },
  { from: "j-hostel", to: "block-38", distance: 70, time: 1.0, accessible: true },
  { from: "block-38", to: "hostel-b", distance: 100, time: 1.5, accessible: true },
  { from: "auditorium", to: "sports-complex", distance: 120, time: 1.8, accessible: true },
  { from: "hostel-b", to: "sports-complex", distance: 100, time: 1.5, accessible: true }
];

// Helper to generate step-by-step written directions based on path nodes
export const generateDirections = (path) => {
  if (!path || path.length < 2) return [];

  const directions = [];
  
  for (let i = 0; i < path.length - 1; i++) {
    const currId = path[i];
    const nextId = path[i+1];
    
    const currNode = CAMPUS_NODES[currId];
    const nextNode = CAMPUS_NODES[nextId];
    
    // Find edge to get distance
    const edge = CAMPUS_EDGES.find(
      e => (e.from === currId && e.to === nextId) || (e.from === nextId && e.to === currId)
    );
    const dist = edge ? edge.distance : 100;

    let instruction = "";
    
    if (i === 0) {
      instruction = `Start from ${currNode.name}. Head towards ${nextNode.name}.`;
    } else {
      // Determine pseudo-directions based on coordinates relative difference
      const dx = nextNode.x - currNode.x;
      const dy = nextNode.y - currNode.y;
      
      let turn = "Go straight";
      if (Math.abs(dx) > Math.abs(dy)) {
        turn = dx > 0 ? "Turn right" : "Turn left";
      } else {
        turn = dy > 0 ? "Walk straight south" : "Head straight north";
      }
      
      instruction = `${turn} towards ${nextNode.name}.`;
    }
    
    directions.push({
      step: i + 1,
      instruction,
      distance: `${dist}m`
    });
  }

  // Final step
  const finalNode = CAMPUS_NODES[path[path.length - 1]];
  directions.push({
    step: directions.length + 1,
    instruction: `Arrive at ${finalNode.name}. You have reached your destination.`,
    distance: ""
  });

  return directions;
};

// ── pathfinding algorithms in JS ──

// Dijkstra's Algorithm (Shortest Path)
export const dijkstra = (startId, endId, accessibilityOnly = false) => {
  const distances = {};
  const previous = {};
  const nodes = new Set();

  // Initialize
  for (const id in CAMPUS_NODES) {
    distances[id] = id === startId ? 0 : Infinity;
    previous[id] = null;
    nodes.add(id);
  }

  while (nodes.size > 0) {
    // Find node with smallest distance
    let smallest = null;
    for (const node of nodes) {
      if (smallest === null || distances[node] < distances[smallest]) {
        smallest = node;
      }
    }

    if (smallest === null || distances[smallest] === Infinity) break;
    if (smallest === endId) break;

    nodes.delete(smallest);

    // Get neighbors
    const neighbors = CAMPUS_EDGES.filter(edge => {
      if (accessibilityOnly && !edge.accessible) return false;
      return edge.from === smallest || edge.to === smallest;
    }).map(edge => {
      const neighbor = edge.from === smallest ? edge.to : edge.from;
      return { id: neighbor, weight: edge.distance };
    });

    for (const neighbor of neighbors) {
      if (!nodes.has(neighbor.id)) continue;
      
      const alt = distances[smallest] + neighbor.weight;
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        previous[neighbor.id] = smallest;
      }
    }
  }

  // Reconstruct path
  const path = [];
  let curr = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  if (path[0] !== startId) return { path: [], distance: 0, time: 0 };

  // Calculate total distance and time
  let totalDist = 0;
  let totalTime = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = CAMPUS_EDGES.find(
      e => (e.from === path[i] && e.to === path[i+1]) || (e.from === path[i+1] && e.to === path[i])
    );
    if (edge) {
      totalDist += edge.distance;
      totalTime += edge.time;
    }
  }

  return {
    path,
    distance: totalDist,
    time: Math.round(totalTime)
  };
};

// Breadth First Search (BFS - Fewest Hops)
export const bfs = (startId, endId, accessibilityOnly = false) => {
  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === endId) {
      let totalDist = 0;
      let totalTime = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = CAMPUS_EDGES.find(
          e => (e.from === path[i] && e.to === path[i+1]) || (e.from === path[i+1] && e.to === path[i])
        );
        if (edge) {
          totalDist += edge.distance;
          totalTime += edge.time;
        }
      }
      return { path, distance: totalDist, time: Math.round(totalTime) };
    }

    const neighbors = CAMPUS_EDGES.filter(edge => {
      if (accessibilityOnly && !edge.accessible) return false;
      return edge.from === node || edge.to === node;
    }).map(edge => (edge.from === node ? edge.to : edge.from));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return { path: [], distance: 0, time: 0 };
};

// Depth First Search (DFS - Alternative Path)
export const dfs = (startId, endId, accessibilityOnly = false) => {
  const allPaths = [];
  
  const findPaths = (node, visited, path) => {
    if (node === endId) {
      allPaths.push([...path]);
      return;
    }

    const neighbors = CAMPUS_EDGES.filter(edge => {
      if (accessibilityOnly && !edge.accessible) return false;
      return edge.from === node || edge.to === node;
    }).map(edge => (edge.from === node ? edge.to : edge.from));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        findPaths(neighbor, visited, [...path, neighbor]);
        visited.delete(neighbor);
      }
    }
  };

  const visited = new Set([startId]);
  findPaths(startId, visited, [startId]);

  if (allPaths.length === 0) return { path: [], distance: 0, time: 0 };

  // For DFS, let's sort by path length to find a decent alternate path
  // (We'll return the second shortest, or the longest if only 1, to make it distinct from Dijkstra)
  allPaths.sort((a, b) => a.length - b.length);
  const selectedPath = allPaths[1] || allPaths[0];

  let totalDist = 0;
  let totalTime = 0;
  for (let i = 0; i < selectedPath.length - 1; i++) {
    const edge = CAMPUS_EDGES.find(
      e => (e.from === selectedPath[i] && e.to === selectedPath[i+1]) || (e.from === selectedPath[i+1] && e.to === selectedPath[i])
    );
    if (edge) {
      totalDist += edge.distance;
      totalTime += edge.time;
    }
  }

  return {
    path: selectedPath,
    distance: totalDist,
    time: Math.round(totalTime)
  };
};
