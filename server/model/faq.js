/**
 * schema for an image
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Faq = mongoose.model("Faq", schema);

module.exports = Faq;
