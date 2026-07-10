// JavaScript fallback pathfinding solvers for MERN backend

const CAMPUS_EDGES = [
  { from: "main-gate", to: "j-gate", distance: 40, time: 0.5, accessible: true },
  { from: "j-gate", to: "block-33", distance: 80, time: 1.0, accessible: true },
  { from: "block-33", to: "parking-1", distance: 50, time: 0.8, accessible: true },
  { from: "j-gate", to: "j-plaza-south", distance: 70, time: 1.0, accessible: true },
  { from: "j-gate", to: "auditorium", distance: 100, time: 1.5, accessible: true },
  { from: "block-33", to: "block-32", distance: 90, time: 1.2, accessible: true },
  { from: "block-32", to: "j-plaza-west", distance: 120, time: 1.8, accessible: true },
  { from: "j-plaza-west", to: "j-plaza-south", distance: 120, time: 1.8, accessible: true },
  { from: "j-plaza-west", to: "admin-block", distance: 80, time: 1.0, accessible: true },
  { from: "admin-block", to: "j-library", distance: 50, time: 0.7, accessible: true },
  { from: "j-library", to: "library", distance: 50, time: 0.7, accessible: true },
  { from: "j-library", to: "j-plaza-north", distance: 160, time: 2.2, accessible: true },
  { from: "library", to: "block-31", distance: 90, time: 1.5, accessible: false },
  { from: "block-31", to: "cafeteria", distance: 80, time: 1.0, accessible: true },
  { from: "cafeteria", to: "j-plaza-north", distance: 60, time: 0.8, accessible: true },
  { from: "central-plaza", to: "j-plaza-south", distance: 80, time: 1.0, accessible: true },
  { from: "central-plaza", to: "j-plaza-north", distance: 80, time: 1.0, accessible: true },
  { from: "central-plaza", to: "j-plaza-west", distance: 100, time: 1.2, accessible: true },
  { from: "central-plaza", to: "j-plaza-east", distance: 100, time: 1.2, accessible: true },
  { from: "j-plaza-south", to: "j-plaza-east", distance: 110, time: 1.6, accessible: true },
  { from: "j-plaza-east", to: "block-38", distance: 100, time: 1.4, accessible: true },
  { from: "j-plaza-north", to: "j-hostel", distance: 140, time: 2.0, accessible: true },
  { from: "j-hostel", to: "hostel-a", distance: 60, time: 0.8, accessible: true },
  { from: "j-hostel", to: "block-38", distance: 70, time: 1.0, accessible: true },
  { from: "block-38", to: "hostel-b", distance: 100, time: 1.5, accessible: true },
  { from: "auditorium", to: "sports-complex", distance: 120, time: 1.8, accessible: true },
  { from: "hostel-b", to: "sports-complex", distance: 100, time: 1.5, accessible: true }
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
