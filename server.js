/**
 * main Javascript file for the application
 *  this file is executed by the Node server
 */

// import the express module, which exports the express function
const express = require("express");
const path = require("path");

// invoke the express function to create an Express
const app = express();

// load environment variables from the .env file into process.env
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// connect to the database
const connectDB = require("./server/database/connection");
connectDB();

// import the express-session module, which is used to manage sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// add middleware to handle JSON in HTTP request bodies (used with POST commands)
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// set the template engine to EJS, which generates HTML with embedded JavaScript
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, "assets")));

// load assets
app.use("/css", express.static("assets/css"));
app.use("/img", express.static("assets/img"));
app.use("/js", express.static("assets/js"));

// app.use takes a function that is added to the chain of a request.
//  when we call next(), it goes to the next function in the chain.

app.use(async (req, res, next) => {
  if (!req.path.startsWith("/admin") || req.path === "/login") {
    return next();
  }
  if (req.session && req.session.Admin) {
    return next();
  }
  res.redirect("/login");
});

app.use("/", require("./server/routes/router"));

app.all("*", (req, res) => {
  res.render("404");
});

const PORT = process.env.PORT || process.env.PORT_NUM || 6767;

app.listen(PORT, () => {
  console.log("server is listening on http://localhost:" + PORT);
});
