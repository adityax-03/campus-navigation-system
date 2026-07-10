const mongoose = require("mongoose");

const edgeSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  to: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  distance: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  accessible: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.models.Edge || mongoose.model("Edge", edgeSchema);
