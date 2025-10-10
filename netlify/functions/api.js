const express = require("express");
const serverless = require("serverless-http");
const path = require("path");

// Create Express app
const app = express();

// Load environment variables
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Connect to database
const connectDB = require("../../server/database/connection");
connectDB();

// Session middleware
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

// Static files - these will be served directly by Netlify from /public
app.use(express.static(path.join(__dirname, "../../public")));

// Load assets (pointing to public directory)
app.use("/css", express.static(path.join(__dirname, "../../public/css")));
app.use("/img", express.static(path.join(__dirname, "../../public/img")));
app.use("/js", express.static(path.join(__dirname, "../../public/js")));

// Admin middleware (copied from your server.js)
app.use(async (req, res, next) => {
  if (!req.path.startsWith("/admin") || req.path === "/login") {
    return next();
  }
  if (req.session && req.session.Admin) {
    return next();
  }
  res.redirect("/login");
});

// Routes
app.use("/", require("../../server/routes/router"));

// 404 handler
app.all("*", (req, res) => {
  res.render("404");
});

// Export the serverless function
module.exports.handler = serverless(app);
