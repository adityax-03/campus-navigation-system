const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("./db");
const Node = require("../models/Node");
const Edge = require("../models/Edge");

const CAMPUS_NODES = [
  { id: "block-32", name: "Block 32", x: 160, y: 340, type: "academic", desc: "School of Engineering & Technology", isPOI: true },
  { id: "admin-block", name: "Admin Block", x: 130, y: 250, type: "academic", desc: "Main Administrative Building", isPOI: true },
  { id: "library", name: "Library", x: 190, y: 170, type: "library", desc: "Central Library", isPOI: true },
  { id: "block-31", name: "Block 31", x: 260, y: 120, type: "academic", desc: "School of Humanities & Sciences", isPOI: true },
  { id: "cafeteria", name: "Cafeteria", x: 315, y: 190, type: "cafeteria", desc: "Campus Main Food Court", isPOI: true },
  { id: "block-33", name: "Block 33", x: 270, y: 410, type: "academic", desc: "Department of Management Studies", isPOI: true },
  { id: "parking-1", name: "Parking Area 1", x: 270, y: 460, type: "parking", desc: "North Car & Bike Parking", isPOI: true },
  { id: "main-gate", name: "Main Gate", x: 350, y: 500, type: "gate", desc: "Main Campus Entrance", isPOI: true },
  { id: "auditorium", name: "Auditorium", x: 440, y: 415, type: "academic", desc: "APJ Abdul Kalam Convocation Hall", isPOI: true },
  { id: "central-plaza", name: "Central Plaza", x: 350, y: 310, type: "park", desc: "Central Green Park & Social Hub", isPOI: true },
  { id: "hostel-a", name: "Hostel A", x: 480, y: 130, type: "hostel", desc: "Boys Hostel Block A", isPOI: true },
  { id: "hostel-b", name: "Hostel B", x: 580, y: 340, type: "hostel", desc: "Girls Hostel Block B", isPOI: true },
  { id: "block-38", name: "Block 38", x: 480, y: 250, type: "academic", desc: "Department of Computer Science & IT", isPOI: true },
  { id: "sports-complex", name: "Sports Complex", x: 550, y: 420, type: "sports", desc: "Sports Field & Gymnasium", isPOI: true },

  // Junctions
  { id: "j-gate", name: "Gate Junction", x: 350, y: 460, type: "junction", isPOI: false },
  { id: "j-plaza-south", name: "Plaza South Crossing", x: 350, y: 390, type: "junction", isPOI: false },
  { id: "j-plaza-west", name: "Plaza West Lane", x: 250, y: 310, type: "junction", isPOI: false },
  { id: "j-plaza-east", name: "Plaza East Lane", x: 440, y: 310, type: "junction", isPOI: false },
  { id: "j-plaza-north", name: "Plaza North Crossing", x: 350, y: 250, type: "junction", isPOI: false },
  { id: "j-library", name: "Library Crossing", x: 190, y: 220, type: "junction", isPOI: false },
  { id: "j-hostel", name: "Hostel Lane", x: 480, y: 190, type: "junction", isPOI: false }
];

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

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing map collection data
    console.log("Dropping old nodes and edges...");
    await Node.deleteMany({});
    await Edge.deleteMany({});

    // Insert Nodes
    console.log("Inserting campus nodes...");
    await Node.insertMany(CAMPUS_NODES);
    console.log(`Successfully seeded ${CAMPUS_NODES.length} nodes`);

    // Insert Edges
    console.log("Inserting campus edges...");
    await Edge.insertMany(CAMPUS_EDGES);
    console.log(`Successfully seeded ${CAMPUS_EDGES.length} edges`);

    console.log("Database Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
