const express = require("express");
const route = express.Router();
const Image = require("../model/image");
const Member = require("../model/member");
const Partner = require("../model/partner");
const Stat = require("../model/stat");

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
  const members = await Member.find().sort({ advisoryBoard: -1 });
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

route.get("/admin/partners", async (req, res) => {
  const partners = await Partner.find().sort({ donator: -1 });
  res.render("admin/partners", { partners });
});

route.post("/admin/partners/add", async (req, res) => {
  const { name, url, donator, imageData } = req.body;
  if (!name || !url  || !imageData || donator === undefined ) {
    return res.status(400).send("All fields are required");
  }
  const newPartner = new Partner({
    name,
    url,
    donator,
    imageData: Buffer.from(imageData, "base64"),
  });
  await newPartner.save();
  res.redirect("/admin/partners");
});

route.put("/admin/partners/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, donator , imageData} = req.body;
  if (!name || !url || donator === undefined) {
    return res.status(400).send("All fields are required");
  }
  const updateData = {
    name,
    url,
    donator: donator === 'true',
  };
  if (imageData) {
    updateData.imageData = Buffer.from(imageData, 'base64');
  }
  await Partner.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/partners");
});

route.delete("/admin/partners/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedPartner = await Partner.findByIdAndDelete(id);
  if (!deletedPartner) {
    return res.status(404).send("Partner not found");
  }
  res.status(200).send("Partner deleted");
});

route.get("/admin/stats", async (req, res) => {
  const stats = await Stat.find().sort({ date: -1 }) // find most recent entry
  if (!stats) {
    return res.status(404).send("Stats not found");
  }
  res.render("admin/stats", { stats });
});
route.post("/admin/stats/update", async (req, res) => {

  const { computersDonated, phonesDonated, monitorsDonated, devicesCollected, totalDonationValue } = req.body;
  if (!computersDonated || !phonesDonated || !monitorsDonated || !devicesCollected || !totalDonationValue) {
    return res.status(400).send("All fields are required");
  }
  if (isNaN(computersDonated) || isNaN(phonesDonated) || isNaN(monitorsDonated) || isNaN(devicesCollected) || isNaN(totalDonationValue)) {
    return res.status(400).send("All fields must be numbers");
  }

  const newStatEntry = new Stat({
    date: Date.now(),
    computersDonated,
    phonesDonated,
    monitorsDonated,
    devicesCollected,
    totalDonationValue,
  });
  await newStatEntry.save();
  res.redirect("/admin/stats");
});


module.exports = route;
