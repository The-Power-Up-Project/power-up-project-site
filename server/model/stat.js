/**
 * Schema for the stats
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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


