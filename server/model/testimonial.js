/**
 * schema for a testimonial
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  partnerName: {
    type: String,
    required: true,
  },
});

const Testimonial = mongoose.model("Testimonial", schema);

module.exports = Testimonial;