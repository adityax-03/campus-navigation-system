const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("./db");
const Node = require("../models/Node");
const Edge = require("../models/Edge");

const CAMPUS_NODES = [
  { id: "gate-1", name: "Main Gate", x: 520, y: 500, type: "gate", desc: "LPU Main Entrance Gate", isPOI: true },
  { id: "block-1", name: "Block 1 (Fashion)", x: 460, y: 460, type: "academic", desc: "School of Fashion Design", isPOI: true },
  { id: "block-2", name: "Block 2 (Baldev Raj Aud)", x: 370, y: 480, type: "academic", desc: "Baldev Raj Auditorium", isPOI: true },
  { id: "block-3", name: "Block 3 (Physio)", x: 490, y: 400, type: "academic", desc: "School of Physiotherapy", isPOI: true },
  { id: "block-4", name: "Block 4 (Pharmacy)", x: 430, y: 360, type: "academic", desc: "School of Pharmaceutical Sciences (Block 4)", isPOI: true },
  { id: "block-6", name: "Block 6 (Arch)", x: 350, y: 390, type: "academic", desc: "School of Architecture & Design", isPOI: true },
  { id: "block-7", name: "Block 7 (Pharmacy)", x: 390, y: 320, type: "academic", desc: "School of Pharmaceutical Sciences (Block 7)", isPOI: true },
  { id: "block-8", name: "Block 8 (Fine Arts)", x: 310, y: 350, type: "academic", desc: "School of Animation & Fine Arts", isPOI: true },
  { id: "gh-9-12", name: "Girls Hostel 9-12", x: 460, y: 310, type: "hostel", desc: "Girls Hostel Blocks 9, 10, 11, and 12", isPOI: true },
  { id: "block-13", name: "Block 13 (Business)", x: 270, y: 310, type: "academic", desc: "Mittal School of Business & Student Welfare", isPOI: true },
  { id: "block-15", name: "Block 15 (Hotel Mgmt)", x: 380, y: 260, type: "academic", desc: "School of Hotel Management & Catering", isPOI: true },
  { id: "block-18", name: "Block 18 (Education)", x: 390, y: 200, type: "academic", desc: "School of Education", isPOI: true },
  { id: "block-19", name: "Block 19 (Perf Arts)", x: 330, y: 170, type: "academic", desc: "Department of Performing Arts", isPOI: true },
  { id: "block-20", name: "Block 20 (Law & Film)", x: 280, y: 180, type: "academic", desc: "School of Law & Journalism", isPOI: true },
  { id: "gh-21", name: "Girls Hostel 21", x: 450, y: 190, type: "hostel", desc: "Girls Hostel Blocks 21A & 21B", isPOI: true },
  { id: "block-25-26", name: "Block 25-26 (Agri)", x: 100, y: 300, type: "academic", desc: "School of Agriculture", isPOI: true },
  { id: "block-27", name: "Block 27 (Phys Sci)", x: 80, y: 260, type: "academic", desc: "School of Physical Sciences", isPOI: true },
  { id: "block-28", name: "Block 28 (Biotech)", x: 60, y: 220, type: "academic", desc: "School of Bioengineering & Biosciences", isPOI: true },
  { id: "block-29", name: "Block 29 (Admin)", x: 200, y: 250, type: "academic", desc: "Administrative Block 29", isPOI: true },
  { id: "block-30", name: "Block 30 (Prochancellor)", x: 160, y: 230, type: "academic", desc: "Prochancellor Secretariat", isPOI: true },
  { id: "block-31", name: "Block 31 (Chancellor)", x: 130, y: 210, type: "academic", desc: "Chancellor Secretariat", isPOI: true },
  { id: "block-32", name: "Block 32 (Admission)", x: 180, y: 270, type: "academic", desc: "University Admission & Counselling Center", isPOI: true },
  { id: "block-33", name: "Block 33 (Comp App)", x: 220, y: 190, type: "academic", desc: "School of Computer Application", isPOI: true },
  { id: "block-34", name: "Block 34 (Comp Sci/CSE)", x: 240, y: 150, type: "academic", desc: "School of Computer Science & Engineering", isPOI: true },
  { id: "block-35", name: "Block 35 (Shantidevi Aud)", x: 260, y: 120, type: "library", desc: "Shantidevi Auditorium (Central Hall)", isPOI: true },
  { id: "block-36", name: "Block 36 (Telecom)", x: 210, y: 100, type: "academic", desc: "School of Electronics & Electrical Eng", isPOI: true },
  { id: "block-37", name: "Block 37 (Research)", x: 170, y: 120, type: "academic", desc: "University Research & Development Wing", isPOI: true },
  { id: "block-38", name: "Block 38 (Civil Eng)", x: 140, y: 140, type: "academic", desc: "School of Civil Engineering", isPOI: true },
  { id: "apartments-41-44", name: "Apartments 41-44", x: 120, y: 80, type: "hostel", desc: "Residential Apartments Blocks 41-44", isPOI: true },
  { id: "block-47", name: "Block 47 (Indoor Stadium)", x: 170, y: 60, type: "sports", desc: "Indoor Stadium & Sports Center", isPOI: true },
  { id: "bh-45", name: "Boys Hostel 45", x: 220, y: 45, type: "hostel", desc: "Boys Hostel Block 45", isPOI: true },
  { id: "bh-48-50", name: "Boys Hostel 48-50", x: 280, y: 55, type: "hostel", desc: "Boys Hostel Blocks 48, 49, and 50", isPOI: true },
  { id: "bh-51-53", name: "Boys Hostel 51-53", x: 340, y: 45, type: "hostel", desc: "Boys Hostel Blocks 51, 52, and 53", isPOI: true },
  { id: "sports-ground", name: "Sports Ground", x: 420, y: 45, type: "sports", desc: "Outdoor Stadium, Track & Playing Fields", isPOI: true },
  { id: "block-56", name: "Block 56 (Mechanical)", x: 520, y: 60, type: "academic", desc: "School of Mechanical Engineering", isPOI: true },
  { id: "block-57", name: "Block 57 (Polytechnic)", x: 560, y: 70, type: "academic", desc: "LPU Polytechnic College", isPOI: true },
  { id: "block-58", name: "Block 58 (Project Lab)", x: 595, y: 80, type: "academic", desc: "Central Research & Project Labs", isPOI: true },

  // Junctions
  { id: "j-gate", name: "Gate Junction", x: 520, y: 460, type: "junction", isPOI: false },
  { id: "j-physio", name: "Physio Junction", x: 410, y: 410, type: "junction", isPOI: false },
  { id: "j-welfare", name: "Welfare Junction", x: 340, y: 320, type: "junction", isPOI: false },
  { id: "j-hotel", name: "Hotel Junction", x: 370, y: 250, type: "junction", isPOI: false },
  { id: "j-plaza-south", name: "Plaza South", x: 240, y: 240, type: "junction", isPOI: false },
  { id: "j-plaza-inner", name: "Plaza Inner", x: 190, y: 165, type: "junction", isPOI: false },
  { id: "j-hostel-lane", name: "Hostel Junction", x: 430, y: 250, type: "junction", isPOI: false },
  { id: "j-science-branch", name: "Science Junction", x: 170, y: 260, type: "junction", isPOI: false },
  { id: "j-top-road", name: "Top Road", x: 160, y: 100, type: "junction", isPOI: false },
  { id: "j-sports-road", name: "Sports Road", x: 420, y: 90, type: "junction", isPOI: false }
];

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
