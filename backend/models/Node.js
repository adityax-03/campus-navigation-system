const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  isPOI: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.models.Node || mongoose.model("Node", nodeSchema);
