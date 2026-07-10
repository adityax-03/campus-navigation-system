#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <algorithm>
#include <climits>

using namespace std;

// Graph Edge definition
struct Edge {
    string to;
    int distance; // meters
    double time;  // minutes
    bool accessible;
};

// Graph representation
unordered_map<string, vector<Edge>> graph;

void initGraph() {
    // Add edges matching JS mapData.js
    graph["main-gate"].push_back({"j-gate", 40, 0.5, true});
    graph["j-gate"].push_back({"main-gate", 40, 0.5, true});
    
    graph["j-gate"].push_back({"block-33", 80, 1.0, true});
    graph["block-33"].push_back({"j-gate", 80, 1.0, true});
    
    graph["block-33"].push_back({"parking-1", 50, 0.8, true});
    graph["parking-1"].push_back({"block-33", 50, 0.8, true});
    
    graph["j-gate"].push_back({"j-plaza-south", 70, 1.0, true});
    graph["j-plaza-south"].push_back({"j-gate", 70, 1.0, true});
    
    graph["j-gate"].push_back({"auditorium", 100, 1.5, true});
    graph["auditorium"].push_back({"j-gate", 100, 1.5, true});
    
    graph["block-33"].push_back({"block-32", 90, 1.2, true});
    graph["block-32"].push_back({"block-33", 90, 1.2, true});
    
    graph["block-32"].push_back({"j-plaza-west", 120, 1.8, true});
    graph["j-plaza-west"].push_back({"block-32", 120, 1.8, true});
    
    graph["j-plaza-west"].push_back({"j-plaza-south", 120, 1.8, true});
    graph["j-plaza-south"].push_back({"j-plaza-west", 120, 1.8, true});
    
    graph["j-plaza-west"].push_back({"admin-block", 80, 1.0, true});
    graph["admin-block"].push_back({"j-plaza-west", 80, 1.0, true});
    
    graph["admin-block"].push_back({"j-library", 50, 0.7, true});
    graph["j-library"].push_back({"admin-block", 50, 0.7, true});
    
    graph["j-library"].push_back({"library", 50, 0.7, true});
    graph["library"].push_back({"j-library", 50, 0.7, true});
    
    graph["j-library"].push_back({"j-plaza-north", 160, 2.2, true});
    graph["j-plaza-north"].push_back({"j-library", 160, 2.2, true});
    
    graph["library"].push_back({"block-31", 90, 1.5, false}); // Stairs!
    graph["block-31"].push_back({"library", 90, 1.5, false});
    
    graph["block-31"].push_back({"cafeteria", 80, 1.0, true});
    graph["cafeteria"].push_back({"block-31", 80, 1.0, true});
    
    graph["cafeteria"].push_back({"j-plaza-north", 60, 0.8, true});
    graph["j-plaza-north"].push_back({"cafeteria", 60, 0.8, true});
    
    graph["central-plaza"].push_back({"j-plaza-south", 80, 1.0, true});
    graph["j-plaza-south"].push_back({"central-plaza", 80, 1.0, true});
    
    graph["central-plaza"].push_back({"j-plaza-north", 80, 1.0, true});
    graph["j-plaza-north"].push_back({"central-plaza", 80, 1.0, true});
    
    graph["central-plaza"].push_back({"j-plaza-west", 100, 1.2, true});
    graph["j-plaza-west"].push_back({"central-plaza", 100, 1.2, true});
    
    graph["central-plaza"].push_back({"j-plaza-east", 100, 1.2, true});
    graph["j-plaza-east"].push_back({"central-plaza", 100, 1.2, true});
    
    graph["j-plaza-south"].push_back({"j-plaza-east", 110, 1.6, true});
    graph["j-plaza-east"].push_back({"j-plaza-south", 110, 1.6, true});
    
    graph["j-plaza-east"].push_back({"block-38", 100, 1.4, true});
    graph["block-38"].push_back({"j-plaza-east", 100, 1.4, true});
    
    graph["j-plaza-north"].push_back({"j-hostel", 140, 2.0, true});
    graph["j-hostel"].push_back({"j-plaza-north", 140, 2.0, true});
    
    graph["j-hostel"].push_back({"hostel-a", 60, 0.8, true});
    graph["hostel-a"].push_back({"j-hostel", 60, 0.8, true});
    
    graph["j-hostel"].push_back({"block-38", 70, 1.0, true});
    graph["block-38"].push_back({"j-hostel", 70, 1.0, true});
    
    graph["block-38"].push_back({"hostel-b", 100, 1.5, true});
    graph["hostel-b"].push_back({"block-38", 100, 1.5, true});
    
    graph["auditorium"].push_back({"sports-complex", 120, 1.8, true});
    graph["sports-complex"].push_back({"auditorium", 120, 1.8, true});
    
    graph["hostel-b"].push_back({"sports-complex", 100, 1.5, true});
    graph["sports-complex"].push_back({"hostel-b", 100, 1.5, true});
}

// ── Dijkstra's Solver ──
void solveDijkstra(string start, string end, bool accessOnly) {
    unordered_map<string, int> dist;
    unordered_map<string, string> prev;
    
    // Priority queue of pair<distance, node_id>
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
    
    // Reconstruct path
    vector<string> path;
    string curr = end;
    while (curr != "") {
        path.push_back(curr);
        curr = prev[curr];
    }
    reverse(path.begin(), path.end());
    
    // Calculate total time
    double totalTime = 0.0;
    for (size_t i = 0; i < path.size() - 1; i++) {
        for (auto const& edge : graph[path[i]]) {
            if (edge.to == path[i+1]) {
                totalTime += edge.time;
                break;
            }
        }
    }
    
    // Print JSON output
    cout << "{\"success\":true,\"path\":[";
    for (size_t i = 0; i < path.size(); i++) {
        cout << "\"" << path[i] << "\"";
        if (i < path.size() - 1) cout << ",";
    }
    cout << "],\"distance\":" << dist[end] << ",\"time\":" << (int)(totalTime + 0.5) << "}" << endl;
}

// ── BFS Solver ──
void solveBFS(string start, string end, bool accessOnly) {
    queue<vector<string>> q;
    unordered_set<string> visited;
    
    q.push({start});
    visited.insert(start);
    
    while (!q.empty()) {
        vector<string> path = q.front();
        q.pop();
        
        string u = path.back();
        
        if (u == end) {
            int totalDist = 0;
            double totalTime = 0.0;
            for (size_t i = 0; i < path.size() - 1; i++) {
                for (auto const& edge : graph[path[i]]) {
                    if (edge.to == path[i+1]) {
                        totalDist += edge.distance;
                        totalTime += edge.time;
                        break;
                    }
                }
            }
            
            cout << "{\"success\":true,\"path\":[";
            for (size_t i = 0; i < path.size(); i++) {
                cout << "\"" << path[i] << "\"";
                if (i < path.size() - 1) cout << ",";
            }
            cout << "],\"distance\":" << totalDist << ",\"time\":" << (int)(totalTime + 0.5) << "}" << endl;
            return;
        }
        
        for (auto const& edge : graph[u]) {
            if (accessOnly && !edge.accessible) continue;
            
            if (visited.find(edge.to) == visited.end()) {
                visited.insert(edge.to);
                vector<string> newPath = path;
                newPath.push_back(edge.to);
                q.push(newPath);
            }
        }
    }
    
    cout << "{\"success\":false,\"message\":\"Path not found\"}" << endl;
}

// Helper for DFS paths list
vector<vector<string>> allDfsPaths;
void dfsHelper(string u, string end, bool accessOnly, unordered_set<string>& visited, vector<string>& path) {
    if (u == end) {
        allDfsPaths.push_back(path);
        return;
    }
    
    for (auto const& edge : graph[u]) {
        if (accessOnly && !edge.accessible) continue;
        
        if (visited.find(edge.to) == visited.end()) {
            visited.insert(edge.to);
            path.push_back(edge.to);
            dfsHelper(edge.to, end, accessOnly, visited, path);
            path.pop_back();
            visited.erase(edge.to);
        }
    }
}

// ── DFS Solver ──
void solveDFS(string start, string end, bool accessOnly) {
    unordered_set<string> visited;
    vector<string> path;
    
    visited.insert(start);
    path.push_back(start);
    dfsHelper(start, end, accessOnly, visited, path);
    
    if (allDfsPaths.empty()) {
        cout << "{\"success\":false,\"message\":\"Path not found\"}" << endl;
        return;
    }
    
    // Sort paths by length, return the alternative (second index or first if only 1)
    sort(allDfsPaths.begin(), allDfsPaths.end(), [](const vector<string>& a, const vector<string>& b) {
        return a.size() < b.size();
    });
    
    vector<string> selectedPath = allDfsPaths.size() > 1 ? allDfsPaths[1] : allDfsPaths[0];
    
    int totalDist = 0;
    double totalTime = 0.0;
    for (size_t i = 0; i < selectedPath.size() - 1; i++) {
        for (auto const& edge : graph[selectedPath[i]]) {
            if (edge.to == selectedPath[i+1]) {
                totalDist += edge.distance;
                totalTime += edge.time;
                break;
            }
        }
    }
    
    cout << "{\"success\":true,\"path\":[";
    for (size_t i = 0; i < selectedPath.size(); i++) {
        cout << "\"" << selectedPath[i] << "\"";
        if (i < selectedPath.size() - 1) cout << ",";
    }
    cout << "],\"distance\":" << totalDist << ",\"time\":" << (int)(totalTime + 0.5) << "}" << endl;
}

int main(int argc, char* argv[]) {
    // Expecting: ./pathfinder [algo: dijkstra/bfs/dfs] [start] [end] [accessibility: 0/1]
    if (argc < 4) {
        cout << "{\"success\":false,\"message\":\"Missing arguments. Usage: ./pathfinder [algo] [start] [end] [access_flag: 0/1]\"}" << endl;
        return 1;
    }
    
    string algo = argv[1];
    string start = argv[2];
    string end = argv[3];
    bool accessOnly = (argc >= 5 && string(argv[4]) == "1");
    
    initGraph();
    
    // Check nodes exist in graph dataset
    if (graph.find(start) == graph.end() || graph.find(end) == graph.end()) {
        cout << "{\"success\":false,\"message\":\"Start or end node not found in map data\"}" << endl;
        return 1;
    }
    
    if (algo == "dijkstra") {
        solveDijkstra(start, end, accessOnly);
    } else if (algo == "bfs") {
        solveBFS(start, end, accessOnly);
    } else if (algo == "dfs") {
        solveDFS(start, end, accessOnly);
    } else {
        cout << "{\"success\":false,\"message\":\"Unknown algorithm. Choose dijkstra, bfs, or dfs\"}" << endl;
        return 1;
    }
    
    return 0;
}
