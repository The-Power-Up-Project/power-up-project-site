/**
 * schema for leadership positions
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  executiveStaff: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: false,
  },
  graduationYear: {
    type: Number,
    required: false,
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});