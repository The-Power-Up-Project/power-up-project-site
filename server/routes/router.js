const express = require("express");
const route = express.Router();
const Image = require("../model/image");
const Member = require("../model/member");

// Public routes
route.get("/", (req, res) => {
  res.redirect("/home");
});

route.get("/home", (req, res) => {
  res.render("home");
});

// Admin routes
route.get("/login", (req, res) => {
  if (req.session.Admin) {
    return res.redirect("/admin/images");
  }
  res.render("login");
});

route.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.Admin = true;
  }
  res.redirect("/admin/images");
});

route.get("/admin/images", async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 }); // sort newest first
  res.render("admin/images", { images });
});

route.post("/admin/images/add", async (req, res) => {
  const { name, imageData } = req.body;
  if (!name || !imageData) {
    return res.status(400).send("Name and image data are required");
  }
  const newImage = new Image({
    name,
    imageData: Buffer.from(imageData, "base64"),
  });
  await newImage.save();
  res.redirect("/admin/images");
});

route.put("/admin/images/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required");
  }
  const updatedImage = await Image.findByIdAndUpdate(id, {
    name,
  });
  if (!updatedImage) {
    return res.status(404).send("Image not found");
  }
  res.redirect("/admin/images");
});
route.delete("/admin/images/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedImage = await Image.findByIdAndDelete(id);
  if (!deletedImage) {
    return res.status(404).send("Image not found");
  }
  res.status(200).send("Image deleted");
});

route.get("/admin/members", async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.render("admin/members", { members });
});

route.post("/admin/members/add", async (req, res) => {
  const { name, position, school, graduationYear, advisoryBoard, imageData } = req.body;
  if (!name || !position || !school || !graduationYear || advisoryBoard === undefined || !imageData) {
    return res.status(400).send("All fields are required");
  }
  const newMember = new Member({
    name,
    position,
    school,
    graduationYear,
    advisoryBoard,
    imageData: Buffer.from(imageData, "base64"),
  });
  await newMember.save();
  res.redirect("/admin/members");
});

route.put("/admin/members/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, school, graduationYear, advisoryBoard } = req.body;
  if (!name || !position || !school || !graduationYear || advisoryBoard === undefined) {
    return res.status(400).send("All fields are required");
  }
  const updatedMember = await Member.findByIdAndUpdate(id, {
    name,
    position,
    school,
    graduationYear,
    advisoryBoard,
  });
  if (!updatedMember) {
    return res.status(404).send("Member not found");
  }
  res.redirect("/admin/members");
});

route.delete("/admin/members/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedMember = await Member.findByIdAndDelete(id);
  if (!deletedMember) {
    return res.status(404).send("Member not found");
  }
  res.status(200).send("Member deleted");
});



module.exports = route;
