/**
 * Schema for a statistics entry
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  computersDonated: {
    type: Number,
    required: true,
  },
  phonesDonated: {
    type: Number,
    required: true,
  },      
  monitorsDonated: {
    type: Number,
    required: true,
  },
  devicesCollected: {
    type: Number,
    required: true,
  },
  totalDonationValue: {
    type: Number,
    required: true,
  },
});

const Stat = mongoose.model("Stat", schema);

module.exports = Stat;


