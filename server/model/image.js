/**
 * schema for an image
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageData: {
    type: Buffer,
    required: true,
  },
});

const Image = mongoose.model("Image", schema);

module.exports = Image;