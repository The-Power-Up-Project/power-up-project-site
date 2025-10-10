/**
 * schema for leadership members
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  advisoryBoard: {
    type: Boolean,
    required: true,
  },
  rank: {
    type: Number,
    required: false,
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
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  imageData: {
    type: Buffer,
    required: true,
  },
});

const Member = mongoose.model("Member", schema);

module.exports = Member;