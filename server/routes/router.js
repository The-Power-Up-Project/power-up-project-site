const express = require("express");
const route = express.Router();

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
    return res.redirect("/admin");
  }
  res.render("login");
});

route.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.Admin = true;
  }
  res.redirect("/admin");
});

route.get("/admin", (req, res) => {
  res.render("admin/admin");
});

module.exports = route;
