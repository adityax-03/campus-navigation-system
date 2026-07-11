// Campus map dataset and pathfinding engine for CCNS

export const CAMPUS_NODES = {
  "gate-1": { id: "gate-1", name: "Main Gate", x: 520, y: 500, type: "gate", desc: "LPU Main Entrance Gate", isPOI: true },
  "block-1": { id: "block-1", name: "Block 1 (Fashion)", x: 460, y: 460, type: "academic", desc: "School of Fashion Design", isPOI: true },
  "block-2": { id: "block-2", name: "Block 2 (Baldev Raj Aud)", x: 370, y: 480, type: "academic", desc: "Baldev Raj Auditorium", isPOI: true },
  "block-3": { id: "block-3", name: "Block 3 (Physio)", x: 490, y: 400, type: "academic", desc: "School of Physiotherapy", isPOI: true },
  "block-4": { id: "block-4", name: "Block 4 (Pharmacy)", x: 430, y: 360, type: "academic", desc: "School of Pharmaceutical Sciences (Block 4)", isPOI: true },
  "block-6": { id: "block-6", name: "Block 6 (Arch)", x: 350, y: 390, type: "academic", desc: "School of Architecture & Design", isPOI: true },
  "block-7": { id: "block-7", name: "Block 7 (Pharmacy)", x: 390, y: 320, type: "academic", desc: "School of Pharmaceutical Sciences (Block 7)", isPOI: true },
  "block-8": { id: "block-8", name: "Block 8 (Fine Arts)", x: 310, y: 350, type: "academic", desc: "School of Animation & Fine Arts", isPOI: true },
  "gh-9-12": { id: "gh-9-12", name: "Girls Hostel 9-12", x: 460, y: 310, type: "hostel", desc: "Girls Hostel Blocks 9, 10, 11, and 12", isPOI: true },
  "block-13": { id: "block-13", name: "Block 13 (Business)", x: 270, y: 310, type: "academic", desc: "Mittal School of Business & Student Welfare", isPOI: true },
  "block-15": { id: "block-15", name: "Block 15 (Hotel Mgmt)", x: 380, y: 260, type: "academic", desc: "School of Hotel Management & Catering", isPOI: true },
  "block-18": { id: "block-18", name: "Block 18 (Education)", x: 390, y: 200, type: "academic", desc: "School of Education", isPOI: true },
  "block-19": { id: "block-19", name: "Block 19 (Perf Arts)", x: 330, y: 170, type: "academic", desc: "Department of Performing Arts", isPOI: true },
  "block-20": { id: "block-20", name: "Block 20 (Law & Film)", x: 280, y: 180, type: "academic", desc: "School of Law & Journalism", isPOI: true },
  "gh-21": { id: "gh-21", name: "Girls Hostel 21", x: 450, y: 190, type: "hostel", desc: "Girls Hostel Blocks 21A & 21B", isPOI: true },
  "block-25-26": { id: "block-25-26", name: "Block 25-26 (Agri)", x: 100, y: 300, type: "academic", desc: "School of Agriculture", isPOI: true },
  "block-27": { id: "block-27", name: "Block 27 (Phys Sci)", x: 80, y: 260, type: "academic", desc: "School of Physical Sciences", isPOI: true },
  "block-28": { id: "block-28", name: "Block 28 (Biotech)", x: 60, y: 220, type: "academic", desc: "School of Bioengineering & Biosciences", isPOI: true },
  "block-29": { id: "block-29", name: "Block 29 (Admin)", x: 200, y: 250, type: "academic", desc: "Administrative Block 29", isPOI: true },
  "block-30": { id: "block-30", name: "Block 30 (Prochancellor)", x: 160, y: 230, type: "academic", desc: "Prochancellor Secretariat", isPOI: true },
  "block-31": { id: "block-31", name: "Block 31 (Chancellor)", x: 130, y: 210, type: "academic", desc: "Chancellor Secretariat", isPOI: true },
  "block-32": { id: "block-32", name: "Block 32 (Admission)", x: 180, y: 270, type: "academic", desc: "University Admission & Counselling Center", isPOI: true },
  "block-33": { id: "block-33", name: "Block 33 (Comp App)", x: 220, y: 190, type: "academic", desc: "School of Computer Application", isPOI: true },
  "block-34": { id: "block-34", name: "Block 34 (Comp Sci/CSE)", x: 240, y: 150, type: "academic", desc: "School of Computer Science & Engineering", isPOI: true },
  "block-35": { id: "block-35", name: "Block 35 (Shantidevi Aud)", x: 260, y: 120, type: "library", desc: "Shantidevi Auditorium (Central Hall)", isPOI: true },
  "block-36": { id: "block-36", name: "Block 36 (Telecom)", x: 210, y: 100, type: "academic", desc: "School of Electronics & Electrical Eng", isPOI: true },
  "block-37": { id: "block-37", name: "Block 37 (Research)", x: 170, y: 120, type: "academic", desc: "University Research & Development Wing", isPOI: true },
  "block-38": { id: "block-38", name: "Block 38 (Civil Eng)", x: 140, y: 140, type: "academic", desc: "School of Civil Engineering", isPOI: true },
  "apartments-41-44": { id: "apartments-41-44", name: "Apartments 41-44", x: 120, y: 80, type: "hostel", desc: "Residential Apartments Blocks 41-44", isPOI: true },
  "block-47": { id: "block-47", name: "Block 47 (Indoor Stadium)", x: 170, y: 60, type: "sports", desc: "Indoor Stadium & Sports Center", isPOI: true },
  "bh-45": { id: "bh-45", name: "Boys Hostel 45", x: 220, y: 45, type: "hostel", desc: "Boys Hostel Block 45", isPOI: true },
  "bh-48-50": { id: "bh-48-50", name: "Boys Hostel 48-50", x: 280, y: 55, type: "hostel", desc: "Boys Hostel Blocks 48, 49, and 50", isPOI: true },
  "bh-51-53": { id: "bh-51-53", name: "Boys Hostel 51-53", x: 340, y: 45, type: "hostel", desc: "Boys Hostel Blocks 51, 52, and 53", isPOI: true },
  "sports-ground": { id: "sports-ground", name: "Sports Ground", x: 420, y: 45, type: "sports", desc: "Outdoor Stadium, Track & Playing Fields", isPOI: true },
  "block-56": { id: "block-56", name: "Block 56 (Mechanical)", x: 520, y: 60, type: "academic", desc: "School of Mechanical Engineering", isPOI: true },
  "block-57": { id: "block-57", name: "Block 57 (Polytechnic)", x: 560, y: 70, type: "academic", desc: "LPU Polytechnic College", isPOI: true },
  "block-58": { id: "block-58", name: "Block 58 (Project Lab)", x: 595, y: 80, type: "academic", desc: "Central Research & Project Labs", isPOI: true },

  // Junctions
  "j-gate": { id: "j-gate", name: "Gate Junction", x: 520, y: 460, type: "junction", isPOI: false },
  "j-physio": { id: "j-physio", name: "Physio Junction", x: 410, y: 410, type: "junction", isPOI: false },
  "j-welfare": { id: "j-welfare", name: "Welfare Junction", x: 340, y: 320, type: "junction", isPOI: false },
  "j-hotel": { id: "j-hotel", name: "Hotel Junction", x: 370, y: 250, type: "junction", isPOI: false },
  "j-plaza-south": { id: "j-plaza-south", name: "Plaza South", x: 240, y: 240, type: "junction", isPOI: false },
  "j-plaza-inner": { id: "j-plaza-inner", name: "Plaza Inner", x: 190, y: 165, type: "junction", isPOI: false },
  "j-hostel-lane": { id: "j-hostel-lane", name: "Hostel Junction", x: 430, y: 250, type: "junction", isPOI: false },
  "j-science-branch": { id: "j-science-branch", name: "Science Junction", x: 170, y: 260, type: "junction", isPOI: false },
  "j-top-road": { id: "j-top-road", name: "Top Road", x: 160, y: 100, type: "junction", isPOI: false },
  "j-sports-road": { id: "j-sports-road", name: "Sports Road", x: 420, y: 90, type: "junction", isPOI: false }
};

export const CAMPUS_EDGES = [
  { from: "gate-1", to: "j-gate", distance: 50, time: 0.6, accessible: true },
  { from: "j-gate", to: "block-1", distance: 60, time: 0.8, accessible: true },
  { from: "j-gate", to: "block-2", distance: 100, time: 1.3, accessible: true },
  { from: "block-1", to: "block-3", distance: 50, time: 0.7, accessible: true },
  { from: "block-2", to: "block-6", distance: 60, time: 0.8, accessible: true },
  { from: "block-3", to: "j-physio", distance: 40, time: 0.5, accessible: true },
  { from: "block-6", to: "j-physio", distance: 50, time: 0.7, accessible: true },
  { from: "j-physio", to: "block-4", distance: 70, time: 1.0, accessible: true },
  { from: "j-physio", to: "block-8", distance: 80, time: 1.1, accessible: false }, // Has steps!
  { from: "block-4", to: "block-7", distance: 50, time: 0.7, accessible: true },
  { from: "block-8", to: "block-13", distance: 60, time: 0.8, accessible: true },
  { from: "block-7", to: "j-welfare", distance: 40, time: 0.5, accessible: true },
  { from: "block-13", to: "j-welfare", distance: 50, time: 0.7, accessible: true },
  { from: "j-welfare", to: "gh-9-12", distance: 60, time: 0.8, accessible: true },
  { from: "j-welfare", to: "block-15", distance: 90, time: 1.2, accessible: true },
  { from: "block-15", to: "j-hotel", distance: 30, time: 0.4, accessible: true },
  { from: "j-hotel", to: "block-18", distance: 70, time: 1.0, accessible: true },
  { from: "block-18", to: "gh-21", distance: 60, time: 0.8, accessible: true },
  { from: "block-18", to: "block-19", distance: 50, time: 0.7, accessible: true },
  { from: "block-18", to: "block-19", distance: 50, time: 0.7, accessible: true },
  { from: "block-19", to: "block-20", distance: 50, time: 0.7, accessible: true },
  { from: "block-20", to: "j-welfare", distance: 110, time: 1.5, accessible: true },
  { from: "j-hotel", to: "j-plaza-south", distance: 120, time: 1.6, accessible: true },
  { from: "j-plaza-south", to: "block-29", distance: 40, time: 0.5, accessible: true },
  { from: "j-plaza-south", to: "block-32", distance: 40, time: 0.5, accessible: true },
  { from: "block-29", to: "block-30", distance: 50, time: 0.7, accessible: true },
  { from: "block-30", to: "block-31", distance: 40, time: 0.5, accessible: true },
  { from: "block-32", to: "j-science-branch", distance: 30, time: 0.4, accessible: true },
  { from: "j-science-branch", to: "block-25-26", distance: 100, time: 1.3, accessible: true },
  { from: "block-25-26", to: "block-27", distance: 50, time: 0.7, accessible: true },
  { from: "block-27", to: "block-28", distance: 50, time: 0.7, accessible: true },
  { from: "block-29", to: "block-33", distance: 60, time: 0.8, accessible: true },
  { from: "block-33", to: "block-34", distance: 40, time: 0.5, accessible: true },
  { from: "block-34", to: "block-35", distance: 40, time: 0.5, accessible: true },
  { from: "block-35", to: "block-36", distance: 50, time: 0.7, accessible: true },
  { from: "block-36", to: "block-37", distance: 40, time: 0.5, accessible: true },
  { from: "block-37", to: "block-38", distance: 40, time: 0.5, accessible: true },
  { from: "block-38", to: "block-31", distance: 50, time: 0.7, accessible: true },
  { from: "block-33", to: "j-plaza-inner", distance: 30, time: 0.4, accessible: true },
  { from: "block-37", to: "j-plaza-inner", distance: 30, time: 0.4, accessible: true },
  { from: "j-plaza-inner", to: "j-top-road", distance: 80, time: 1.1, accessible: true },
  { from: "j-top-road", to: "apartments-41-44", distance: 40, time: 0.5, accessible: true },
  { from: "j-top-road", to: "block-47", distance: 30, time: 0.4, accessible: true },
  { from: "j-top-road", to: "bh-45", distance: 60, time: 0.8, accessible: true },
  { from: "block-47", to: "bh-48-50", distance: 100, time: 1.3, accessible: true },
  { from: "bh-48-50", to: "bh-51-53", distance: 70, time: 1.0, accessible: true },
  { from: "bh-51-53", to: "sports-ground", distance: 80, time: 1.1, accessible: true },
  { from: "sports-ground", to: "j-sports-road", distance: 40, time: 0.5, accessible: true },
  { from: "j-sports-road", to: "block-56", distance: 110, time: 1.5, accessible: true },
  { from: "block-56", to: "block-57", distance: 40, time: 0.5, accessible: true },
  { from: "block-57", to: "block-58", distance: 30, time: 0.4, accessible: true },
  { from: "j-sports-road", to: "block-15", distance: 180, time: 2.4, accessible: true }
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
