// JavaScript fallback pathfinding solvers for MERN backend

const CAMPUS_EDGES = [
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

const solveDijkstra = (startId, endId, accessibilityOnly = false) => {
  const distances = {};
  const previous = {};
  const nodes = new Set();
  const allNodes = new Set();

  CAMPUS_EDGES.forEach(e => {
    allNodes.add(e.from);
    allNodes.add(e.to);
  });

  allNodes.forEach(id => {
    distances[id] = id === startId ? 0 : Infinity;
    previous[id] = null;
    nodes.add(id);
  });

  if (!allNodes.has(startId) || !allNodes.has(endId)) {
    return { success: false, message: "Nodes not found" };
  }

  while (nodes.size > 0) {
    let smallest = null;
    for (const node of nodes) {
      if (smallest === null || distances[node] < distances[smallest]) {
        smallest = node;
      }
    }

    if (smallest === null || distances[smallest] === Infinity) break;
    if (smallest === endId) break;

    nodes.delete(smallest);

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

  const path = [];
  let curr = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  if (path[0] !== startId) return { success: false, message: "Path not found" };

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
    success: true,
    path,
    distance: totalDist,
    time: Math.round(totalTime)
  };
};

const solveBFS = (startId, endId, accessibilityOnly = false) => {
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
      return { success: true, path, distance: totalDist, time: Math.round(totalTime) };
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

  return { success: false, message: "Path not found" };
};

const solveDFS = (startId, endId, accessibilityOnly = false) => {
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

  if (allPaths.length === 0) return { success: false, message: "Path not found" };

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
    success: true,
    path: selectedPath,
    distance: totalDist,
    time: Math.round(totalTime)
  };
};

module.exports = {
  solveDijkstra,
  solveBFS,
  solveDFS
};
