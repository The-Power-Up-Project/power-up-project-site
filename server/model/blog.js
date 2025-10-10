/**
 * schema for a blog post
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    // not every blog post will have an image
  },
  partners: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});

const Blog = mongoose.model("Blog", schema);

module.exports = Blog;