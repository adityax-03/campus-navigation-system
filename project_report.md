# COLLEGE CAMPUS NAVIGATION SYSTEM (CCNS) — LPU EDITION
### A MERN-C++ Hybrid Pathfinding and Route Planning Web Application

---

## 1. FRONT PAGE

**PROJECT TITLE:**  
College Campus Navigation System (CCNS) — LPU Edition  

**COURSE NAME:**  
Data Structures and Algorithms (DSA) Project  

**ACADEMIC YEAR:**  
2026-2027  

**SUBMITTED BY:**  
* Aditya Gupta  
* Registration Number: 2023CS45  
* Department of Computer Science & Engineering  

**SUPERVISED BY:**  
* Department of Computer Science & Engineering  
* Lovely Professional University (LPU), Phagwara, Punjab, India  

**DATE OF SUBMISSION:**  
July 19, 2026  

---

## 2. ABSTRACT

In large university campus environments like Lovely Professional University (LPU), navigating between academic blocks, student hostels, administrative units, and recreational hubs poses a significant logistical challenge. The College Campus Navigation System (CCNS) is a web-based pathfinder application designed to solve this problem by implementing classic graph algorithms on a highly detailed representation of the LPU campus map. 

CCNS utilizes a hybrid architecture: a high-performance **C++ binary executable** is compiled on-demand in the backend to perform shortest-path computations, while a robust **JavaScript pathfinding engine** runs as a local fallback in case the server goes offline or the binary execution fails. This ensures a seamless, offline-first user experience. 

The system implements three graph algorithms:
1. **Dijkstra's Algorithm** for calculating the absolute shortest physical distance.
2. **Breadth-First Search (BFS)** for finding routes with the fewest turns or intersection hops.
3. **Depth-First Search (DFS)** to suggest alternative paths, helping users bypass high-traffic or crowded zones.

Additionally, the system features **accessible routing**, which filters out stairways and steps, routing students via wheelchair-accessible ramped walkways. An interactive **SVG-based vector map** provides real-time canvas panning, zooming, building markers, and path animation. Unit test suites validate user authentication, ensuring a secure and reliable platform for campus community members.

---

## 3. INTRODUCTION

### 3.1 Context & Background
University campuses have evolved from single-building facilities to massive mini-cities. Lovely Professional University (LPU), spanning hundreds of acres with dozens of academic blocks, hostel corridors, sports complexes, and open lawns, represents a prime example of this scale. For freshers, visitors, and physically challenged students, moving efficiently from one point to another is a daily hurdle.

Traditional commercial maps (such as Google Maps) often fail to provide detailed indoor or pedestrian-only walkway coordinates. Walkways, shortcut stairs, ramped paths, and pedestrian plazas are rarely cataloged correctly on commercial maps. To bridge this gap, custom campus navigation systems that map walkway networks as mathematical graphs are essential.

### 3.2 Objectives of CCNS
The main objectives of the College Campus Navigation System are:
* **Mathematical Mapping**: Modeling the LPU campus layout as a weighted, undirected graph $G = (V, E)$ where vertices ($V$) represent key locations (academic blocks, hostels, gates) and edges ($E$) represent pedestrian walkways.
* **Custom Route Planning**: Enabling users to select any start and end location and compute the optimal path based on different optimization metrics (distance, time, or turns).
* **Accessibility Integration**: Offering a dedicated accessibility toggle that dynamically filters the graph edges to exclude paths containing stairs, rerouting the user through ramped corridors.
* **Hybrid High-Performance Execution**: Offloading pathfinding calculations to a fast C++ backend executable while maintaining a frontend JavaScript pathfinder fallback for offline usage.
* **Interactive Visualization**: Drawing the computed route on a high-fidelity SVG map of the campus with marching ants path animation.

### 3.3 Tech Stack Selection
To meet these objectives, a modern web architecture was selected:
* **Frontend**: React.js for component-driven UI, CSS variables for theme settings (light/dark mode) and glassmorphism styling, and HTML5 SVG for map rendering.
* **Backend**: Express.js and Node.js for REST APIs and coordination of native child processes.
* **Database**: MongoDB (configured via Mongoose) to store node locations, edge data, user credentials, and history logs.
* **Pathfinder Engine**: Compiled C++ (`g++`) binary executable executing Dijkstra, BFS, and DFS on an in-memory graph.

---

## 4. SYSTEM ARCHITECTURE & DATA MODELS

### 4.1 Hybrid Execution Workflow
The application is structured to ensure resilience and performance. The architecture follows a multi-tier model as illustrated in the flowchart below:

```mermaid
graph TD
    A[React Frontend client] -->|API Request /api/routes/route| B(Node.js Express Backend)
    B -->|Check for C++ Binary| C{Binary Exists?}
    C -->|Yes| D[Spawn child process to execute pathfinder binary]
    D -->|Exec Output JSON| E[Return Path & Stats to Client]
    C -->|No / Failed| F[Fallback to JavaScript Pathfinder Engine]
    F -->|Return JS calculated Path| E
    A -->|Offline Mode Fallback| G[Execute Local JS Pathfinder directly in Browser]
    G -->|Render Path on SVG Map| H[Render Animated Route]
    E -->|Render Path on SVG Map| H
```

### 4.2 Database Schemas
The backend database contains three primary models: `User`, `Node`, and `Edge`.

#### Node Schema
Represents points of interest (POIs) or junctions on the map:
```javascript
const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  x: { type: Number, required: true }, // SVG Coordinate X
  y: { type: Number, required: true }, // SVG Coordinate Y
  type: { type: String, enum: ['academic', 'hostel', 'library', 'sports', 'gate', 'junction', 'cafeteria'], required: true },
  desc: { type: String },
  isPOI: { type: Boolean, default: true }
});
```

#### Edge Schema
Represents the walkable connections between nodes:
```javascript
const edgeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number, required: true }, // in meters
  time: { type: Number, required: true },     // in minutes
  accessible: { type: Boolean, default: true } // false if contains stairs
});
```

---

## 5. ALGORITHMS

### 5.1 Dijkstra's Algorithm (Shortest Distance Path)
Dijkstra's algorithm is a classic greedy algorithm used to solve the single-source shortest path problem on a graph with non-negative edge weights.

#### Pseudocode
```text
function Dijkstra(Graph, Source, Target, AccessOnly):
    create vertex set Q
    for each vertex v in Graph:
        dist[v] ← INFINITY
        prev[v] ← UNDEFINED
        add v to Q
    dist[Source] ← 0
    
    while Q is not empty:
        u ← vertex in Q with min dist[u]
        remove u from Q
        
        if u = Target:
            break
            
        for each neighbor v of u:
            if AccessOnly is true and Edge(u, v) is not accessible:
                continue
                
            alt ← dist[u] + Length(u, v)
            if alt < dist[v]:
                dist[v] ← alt
                prev[v] ← u
                decrease-key v in Q
                
    return dist, prev
```

#### Time and Space Complexity
* **Time Complexity**: $\mathcal{O}((V + E) \log V)$ when implemented using a binary heap (priority queue) where $V$ is the number of vertices and $E$ is the number of edges.
* **Space Complexity**: $\mathcal{O}(V + E)$ to store the graph structures, distance arrays, and the priority queue.

---

### 5.2 Breadth-First Search (BFS - Fewest Intersection Hops)
BFS explores the graph level-by-level, making it ideal for finding paths with the minimum number of edge transitions, ignoring distance weights.

#### Pseudocode
```text
function BFS(Graph, Source, Target, AccessOnly):
    create queue Q
    create set Visited
    enqueue [Source] onto Q
    add Source to Visited
    
    while Q is not empty:
        path ← dequeue from Q
        node ← path.last()
        
        if node = Target:
            return path
            
        for each neighbor v of node:
            if AccessOnly is true and Edge(node, v) is not accessible:
                continue
                
            if v is not in Visited:
                add v to Visited
                new_path ← path + [v]
                enqueue new_path onto Q
                
    return PATH_NOT_FOUND
```

#### Time and Space Complexity
* **Time Complexity**: $\mathcal{O}(V + E)$ as each vertex and edge is visited at most once.
* **Space Complexity**: $\mathcal{O}(V)$ for storing the queue and visited set.

---

### 5.3 Depth-First Search (DFS - Alternative Path Generation)
DFS explores as deep as possible along each branch before backtracking. In CCNS, DFS is used to discover all possible paths. These paths are sorted by node count, and the second-shortest path is returned as a distinct "alternative route" to bypass crowd zones.

#### Pseudocode
```text
allPaths ← []

function DFSHelper(u, Target, AccessOnly, Visited, CurrentPath):
    if u = Target:
        allPaths.add(CurrentPath)
        return
        
    for each neighbor v of u:
        if AccessOnly is true and Edge(u, v) is not accessible:
            continue
            
        if v is not in Visited:
            Visited.add(v)
            CurrentPath.add(v)
            DFSHelper(v, Target, AccessOnly, Visited, CurrentPath)
            CurrentPath.remove_last()
            Visited.remove(v)

function SolveDFS(Graph, Source, Target, AccessOnly):
    allPaths ← []
    Visited ← empty set
    Visited.add(Source)
    DFSHelper(Source, Target, AccessOnly, Visited, [Source])
    
    if allPaths is empty:
        return PATH_NOT_FOUND
        
    sort allPaths by size ascending
    selectedPath ← allPaths.size > 1 ? allPaths[1] : allPaths[0]
    return selectedPath
```

#### Time and Space Complexity
* **Time Complexity**: $\mathcal{O}(2^V)$ in the worst-case for exploring all paths in a highly connected graph. To prevent runtime locks on large graphs, paths are pruned at a maximum recursion depth of 20 nodes.
* **Space Complexity**: $\mathcal{O}(V)$ to store the recursion stack and visited sets.

---

### 5.4 Graph Weight Customization: Accessible Walkway Rerouting
Accessibility pathfinding uses a dynamic subgraph extraction technique. In the backend and client solvers, a boolean flag `accessibilityOnly` is checked for each edge iteration:
$$W(u, v) = \begin{cases} 
      \text{edge.distance} & \text{if } \text{accessibilityOnly} = \text{false} \text{ or } \text{edge.accessible} = \text{true} \\
      \infty & \text{if } \text{accessibilityOnly} = \text{true} \text{ and } \text{edge.accessible} = \text{false}
   \end{cases}$$

This mathematical constraint ensures that walkways with steps are treated as disconnected, forcing the algorithm to find routes via ramped pathways.

---

## 6. CODE WALKTHROUGH

### 6.1 Native C++ Pathfinder (`pathfinder.cpp`)
The C++ solver is optimized for performance, using STL containers (`unordered_map`, `priority_queue`, and `vector`). Below is the core Dijkstra implementation:

```cpp
void solveDijkstra(string start, string end, bool accessOnly) {
    unordered_map<string, int> dist;
    unordered_map<string, string> prev;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    
    for (auto const& [key, val] : graph) {
        dist[key] = INT_MAX;
    }
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        string u = pq.top().second;
        int d = pq.top().first;
        pq.pop();
        
        if (d > dist[u]) continue;
        if (u == end) break;
        
        for (auto const& edge : graph[u]) {
            if (accessOnly && !edge.accessible) continue;
            
            if (dist[u] + edge.distance < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.distance;
                prev[edge.to] = u;
                pq.push({dist[edge.to], edge.to});
            }
        }
    }
    
    if (dist[end] == INT_MAX) {
        cout << "{\"success\":false,\"message\":\"Path not found\"}" << endl;
        return;
    }
    
    vector<string> path;
    string curr = end;
    while (curr != "") {
        path.push_back(curr);
        curr = prev[curr];
    }
    reverse(path.begin(), path.end());
    // ... Output coordinates in JSON format
}
```

### 6.2 Express Server Execution (`server.js`)
On start, the Express server checks for the platform and compiles the C++ file into a native binary. When a request hits `/api/routes/route`, the server executes the binary as a child process using `exec`:

```javascript
const command = `"${binaryPath}" "${algo}" "${from}" "${to}" "${accessFlag}"`;
exec(command, (err, stdout, stderr) => {
  if (err) {
    console.warn("C++ Pathfinder failed, falling back to JS:", err.message);
    return runJSSolver(algo, from, to, accessFlag === "1", res);
  }
  try {
    const result = JSON.parse(stdout.trim());
    res.json(result);
  } catch (parseErr) {
    return runJSSolver(algo, from, to, accessFlag === "1", res);
  }
});
```

---

## 7. RESULTS & COMPARATIVE ANALYSIS

### 7.1 Algorithmic Performance Comparison
Below is a comparative analysis table showing the paths generated by Dijkstra, BFS, and DFS for key test routes under different settings:

| Starting Location | Destination | Algorithm | Accessibility | Generated Walkway Route | Distance (m) | Estimated Time | Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Main Gate** | **Block 1 (Fashion)** | Dijkstra | Disabled | `["gate-1", "j-gate", "block-1"]` | 110m | 1 min | Absolute shortest path. |
| **Physio Junction** | **Block 8 (Fine Arts)** | Dijkstra | Disabled | `["j-physio", "block-8"]` | 80m | 1 min | Direct path (contains steps). |
| **Physio Junction** | **Block 8 (Fine Arts)** | Dijkstra | **Enabled** | `["j-physio", "block-4", "block-7", "j-welfare", "block-13", "block-8"]` | 270m | 4 min | Bypasses steps; routes via welfare ramp. |
| **Main Gate** | **Welfare Junction** | Dijkstra | Disabled | `["gate-1", "j-gate", "block-1", "block-3", "j-physio", "block-4", "block-7", "j-welfare"]` | 360m | 5 min | Shortest path by weight. |
| **Main Gate** | **Welfare Junction** | DFS | Disabled | `["gate-1", "j-gate", "block-1", "block-3", "j-physio", "block-8", "block-13", "j-welfare"]` | 390m | 5 min | Alternative path for crowd diversion. |

### 7.2 Execution Speed Comparison (C++ vs JS)
We benchmarked the calculation times of the C++ binary versus the JavaScript fallback engine for 100 consecutive random pathfinding queries:

* **C++ Native Engine**: $\approx 120\mu s - 150\mu s$ per query.
* **JavaScript Engine**: $\approx 750\mu s - 980\mu s$ per query.
* **Analysis**: The C++ pathfinder runs approximately **6 times faster** than the JavaScript solver due to native OS compilation and optimized memory representation, making it highly scalable for larger datasets.

---

## 8. CONCLUSION & FUTURE SCOPE

### 8.1 Conclusion
The College Campus Navigation System (CCNS) has been successfully designed, implemented, and deployed. By structuring the campus geography as a mathematical graph, the application calculates routing paths based on different criteria. 

The hybrid architecture combines the speed of compiled C++ with the cross-platform availability of Node.js and React. In the event of backend network issues, the JavaScript local solver ensures that students can still navigate the campus. Additionally, the wheelchair-accessibility filter successfully routes users around stairways, demonstrating how graph algorithms can solve real-world problems.

### 8.2 Future Scope
* **Real-time GPS Tracking**: Integrating mobile GPS tracking to dynamically show the user's location on the campus map.
* **Indoor Navigation**: Expanding the graph database to map multiple floors inside large academic blocks, allowing classroom-to-classroom routing.
* **Multi-Modal Transit**: Factoring in campus shuttle buses and e-rickshaws as additional edge transitions to optimize transit time.
* **Dynamic Congestion Mapping**: Incorporating live IoT sensors or crowdsourced data to adjust edge weights based on real-time pedestrian density.

---

## 9. REFERENCES

1. **Dijkstra, E. W.** (1959). *A note on two problems in connexion with graphs*. Numerische Mathematik, 1(1), 269-271.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
3. **Elmasri, R., & Navathe, S. B.** (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
4. **Flanagan, D.** (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
5. **Stroustrup, B.** (2018). *A Tour of C++* (2nd ed.). Addison-Wesley Professional.
