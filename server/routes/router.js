const express = require("express");
const route = express.Router();
const Image = require("../model/image");
const Member = require("../model/member");
const Partner = require("../model/partner");
const Testimonial = require("../model/testimonial");
const Stat = require("../model/stat");
const Blog = require("../model/blog");

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
    return res.redirect("/admin/stats");
  }
  res.render("login");
});

route.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.Admin = true;
  }
  res.redirect("/admin/stats");
});

route.get("/admin/images", async (req, res) => {
  const images = await Image.find()
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

route.get("/admin/testimonials", async (req, res) => {
  const testimonials = await Testimonial.find();
  const partners = await Partner.find().sort({ name: 1 });
  res.render("admin/testimonials", { testimonials, partners });
});
route.post("/admin/testimonials/add", async (req, res) => {
  const { partner, content } = req.body;
  if (!partner || !content) {
    return res.status(400).send("All fields are required");
  }
  const partnerDoc = await Partner.findById(partner);
  if (!partnerDoc) {
    return res.status(400).send("Invalid partner");
  }
  const newTestimonial = new Testimonial({
    partner,
    partnerName: partnerDoc.name,
    content,
  });
  await newTestimonial.save();
  res.redirect("/admin/testimonials");
});
route.put("/admin/testimonials/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { partner, content } = req.body;
  if (!partner || !content) {
    return res.status(400).send("All fields are required");
  }
  const partnerDoc = await Partner.findById(partner);
  if (!partnerDoc) {
    return res.status(400).send("Invalid partner");
  }
  const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, {
    partner,
    partnerName: partnerDoc.name,
    content,
  });
  if (!updatedTestimonial) {
    return res.status(404).send("Testimonial not found");
  }
  res.redirect("/admin/testimonials");
});
route.delete("/admin/testimonials/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
  if (!deletedTestimonial) {
    return res.status(404).send("Testimonial not found");
  }
  res.status(200).send("Testimonial deleted");
});

route.get("/admin/blogs", async (req, res) => {
  const blogs = await Blog.find().populate({ path: 'image', model: Image }).populate({ path: 'partners', model: Partner }).sort({ date: -1 });
  const partners = await Partner.find().sort({ name: 1 });
  res.render("admin/blogs", { blogs, partners });
});

route.post("/admin/blogs/add", async (req, res) => {
  const { title, content, date, imageData, partners } = req.body;
  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }
  if (imageData) {
    imageData = Buffer.from(imageData, "base64");
    image = new Image({
      name: `Blog Image - ${title}`,
      imageData,
    });
    await image.save();
  }
  const newBlog = new Blog({
    title,
    content,
    date: date ? new Date(date) : Date.now(),
    image: imageData ? image._id : null,
    partners,
  });
  await newBlog.save();
  res.redirect("/admin/blogs");
});

route.put("/admin/blogs/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, date, imageData, oldImageId, partners } = req.body;
  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }
  const updateData = {
    title,
    content,
    date: date ? new Date(date) : Date.now(),
    partners,
  };
  if (imageData) {
    Image.findByIdAndDelete(oldImageId); 
    const image = new Image({
      name: `Blog Image - ${title}`,
      imageData: Buffer.from(imageData, "base64"),
    });
    await image.save();
    updateData.image = image._id;
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, updateData);
  if (!updatedBlog) {
    return res.status(404).send("Blog not found");
  }
  res.redirect("/admin/blogs");
});

route.delete("/admin/blogs/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) {
    return res.status(404).send("Blog not found");
  }
  res.status(200).send("Blog deleted");
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
