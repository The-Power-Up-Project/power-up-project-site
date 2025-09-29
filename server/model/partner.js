/**
 * schema for a partner/supporter
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  donator: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageData: {
    type: Buffer,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});

const Partner = mongoose.model("Partner", schema);

module.exports = Partner;