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
    // Add LPU edges
    graph["gate-1"].push_back({"j-gate", 50, 0.6, true});
    graph["j-gate"].push_back({"gate-1", 50, 0.6, true});
    
    graph["j-gate"].push_back({"block-1", 60, 0.8, true});
    graph["block-1"].push_back({"j-gate", 60, 0.8, true});
    
    graph["j-gate"].push_back({"block-2", 100, 1.3, true});
    graph["block-2"].push_back({"j-gate", 100, 1.3, true});
    
    graph["block-1"].push_back({"block-3", 50, 0.7, true});
    graph["block-3"].push_back({"block-1", 50, 0.7, true});
    
    graph["block-2"].push_back({"block-6", 60, 0.8, true});
    graph["block-6"].push_back({"block-2", 60, 0.8, true});
    
    graph["block-3"].push_back({"j-physio", 40, 0.5, true});
    graph["j-physio"].push_back({"block-3", 40, 0.5, true});
    
    graph["block-6"].push_back({"j-physio", 50, 0.7, true});
    graph["j-physio"].push_back({"block-6", 50, 0.7, true});
    
    graph["j-physio"].push_back({"block-4", 70, 1.0, true});
    graph["block-4"].push_back({"j-physio", 70, 1.0, true});
    
    graph["j-physio"].push_back({"block-8", 80, 1.1, false});
    graph["block-8"].push_back({"j-physio", 80, 1.1, false});
    
    graph["block-4"].push_back({"block-7", 50, 0.7, true});
    graph["block-7"].push_back({"block-4", 50, 0.7, true});
    
    graph["block-8"].push_back({"block-13", 60, 0.8, true});
    graph["block-13"].push_back({"block-8", 60, 0.8, true});
    
    graph["block-7"].push_back({"j-welfare", 40, 0.5, true});
    graph["j-welfare"].push_back({"block-7", 40, 0.5, true});
    
    graph["block-13"].push_back({"j-welfare", 50, 0.7, true});
    graph["j-welfare"].push_back({"block-13", 50, 0.7, true});
    
    graph["j-welfare"].push_back({"gh-9-12", 60, 0.8, true});
    graph["gh-9-12"].push_back({"j-welfare", 60, 0.8, true});
    
    graph["j-welfare"].push_back({"block-15", 90, 1.2, true});
    graph["block-15"].push_back({"j-welfare", 90, 1.2, true});
    
    graph["block-15"].push_back({"j-hotel", 30, 0.4, true});
    graph["block-15"].push_back({"j-hotel", 30, 0.4, true});
    
    graph["j-hotel"].push_back({"block-18", 70, 1.0, true});
    graph["block-18"].push_back({"j-hotel", 70, 1.0, true});
    
    graph["block-18"].push_back({"gh-21", 60, 0.8, true});
    graph["gh-21"].push_back({"block-18", 60, 0.8, true});
    
    graph["block-18"].push_back({"block-19", 50, 0.7, true});
    graph["block-19"].push_back({"block-18", 50, 0.7, true});
    
    graph["block-19"].push_back({"block-20", 50, 0.7, true});
    graph["block-20"].push_back({"block-19", 50, 0.7, true});
    
    graph["block-20"].push_back({"j-welfare", 110, 1.5, true});
    graph["j-welfare"].push_back({"block-20", 110, 1.5, true});
    
    graph["j-hotel"].push_back({"j-plaza-south", 120, 1.6, true});
    graph["j-plaza-south"].push_back({"j-hotel", 120, 1.6, true});
    
    graph["j-plaza-south"].push_back({"block-29", 40, 0.5, true});
    graph["block-29"].push_back({"j-plaza-south", 40, 0.5, true});
    
    graph["j-plaza-south"].push_back({"block-32", 40, 0.5, true});
    graph["block-32"].push_back({"j-plaza-south", 40, 0.5, true});
    
    graph["block-29"].push_back({"block-30", 50, 0.7, true});
    graph["block-30"].push_back({"block-29", 50, 0.7, true});
    
    graph["block-30"].push_back({"block-31", 40, 0.5, true});
    graph["block-31"].push_back({"block-30", 40, 0.5, true});
    
    graph["block-32"].push_back({"j-science-branch", 30, 0.4, true});
    graph["j-science-branch"].push_back({"block-32", 30, 0.4, true});
    
    graph["j-science-branch"].push_back({"block-25-26", 100, 1.3, true});
    graph["block-25-26"].push_back({"j-science-branch", 100, 1.3, true});
    
    graph["block-25-26"].push_back({"block-27", 50, 0.7, true});
    graph["block-27"].push_back({"block-25-26", 50, 0.7, true});
    
    graph["block-27"].push_back({"block-28", 50, 0.7, true});
    graph["block-28"].push_back({"block-27", 50, 0.7, true});
    
    graph["block-29"].push_back({"block-33", 60, 0.8, true});
    graph["block-33"].push_back({"block-29", 60, 0.8, true});
    
    graph["block-33"].push_back({"block-34", 40, 0.5, true});
    graph["block-34"].push_back({"block-33", 40, 0.5, true});
    
    graph["block-34"].push_back({"block-35", 40, 0.5, true});
    graph["block-35"].push_back({"block-34", 40, 0.5, true});
    
    graph["block-35"].push_back({"block-36", 50, 0.7, true});
    graph["block-36"].push_back({"block-35", 50, 0.7, true});
    
    graph["block-36"].push_back({"block-37", 40, 0.5, true});
    graph["block-37"].push_back({"block-36", 40, 0.5, true});
    
    graph["block-37"].push_back({"block-38", 40, 0.5, true});
    graph["block-38"].push_back({"block-37", 40, 0.5, true});
    
    graph["block-38"].push_back({"block-31", 50, 0.7, true});
    graph["block-31"].push_back({"block-38", 50, 0.7, true});
    
    graph["block-33"].push_back({"j-plaza-inner", 30, 0.4, true});
    graph["j-plaza-inner"].push_back({"block-33", 30, 0.4, true});
    
    graph["block-37"].push_back({"j-plaza-inner", 30, 0.4, true});
    graph["j-plaza-inner"].push_back({"block-37", 30, 0.4, true});
    
    graph["j-plaza-inner"].push_back({"j-top-road", 80, 1.1, true});
    graph["j-top-road"].push_back({"j-plaza-inner", 80, 1.1, true});
    
    graph["j-top-road"].push_back({"apartments-41-44", 40, 0.5, true});
    graph["apartments-41-44"].push_back({"j-top-road", 40, 0.5, true});
    
    graph["j-top-road"].push_back({"block-47", 30, 0.4, true});
    graph["block-47"].push_back({"j-top-road", 30, 0.4, true});
    
    graph["j-top-road"].push_back({"bh-45", 60, 0.8, true});
    graph["bh-45"].push_back({"j-top-road", 60, 0.8, true});
    
    graph["block-47"].push_back({"bh-48-50", 100, 1.3, true});
    graph["bh-48-50"].push_back({"block-47", 100, 1.3, true});
    
    graph["bh-48-50"].push_back({"bh-51-53", 70, 1.0, true});
    graph["bh-51-53"].push_back({"bh-48-50", 70, 1.0, true});
    
    graph["bh-51-53"].push_back({"sports-ground", 80, 1.1, true});
    graph["sports-ground"].push_back({"bh-51-53", 80, 1.1, true});
    
    graph["sports-ground"].push_back({"j-sports-road", 40, 0.5, true});
    graph["j-sports-road"].push_back({"sports-ground", 40, 0.5, true});
    
    graph["j-sports-road"].push_back({"block-56", 110, 1.5, true});
    graph["block-56"].push_back({"j-sports-road", 110, 1.5, true});
    
    graph["block-56"].push_back({"block-57", 40, 0.5, true});
    graph["block-57"].push_back({"block-56", 40, 0.5, true});
    
    graph["block-57"].push_back({"block-58", 30, 0.4, true});
    graph["block-58"].push_back({"block-57", 30, 0.4, true});
    
    graph["j-sports-road"].push_back({"block-15", 180, 2.4, true});
    graph["block-15"].push_back({"j-sports-road", 180, 2.4, true});
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
