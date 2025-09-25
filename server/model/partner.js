/**
 * schema for a partner/supporter
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  supporter: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});

const Partner = mongoose.model("Partner", schema);

module.exports = Partner;