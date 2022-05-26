/*
 * Package Imports
 */
const express = require("express");
const partials = require("express-partials");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const path = require("path");
require("dotenv").config();

const app = express();

/*
 * Variable Declarations
 */
const PORT = 3000;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/*
 * Passport Configurations
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: Iv1.79422e46e06f8c23,
      clientSecret: 09d6193cc54d683df8025abfcc45a07cb36e44c4,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/*
 *  Express Project Setup
 */
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(partials());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({ secret: "codecademy", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

/*
 * Routes
 */
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/auth/github", passport.authenticate("github", { scope: ["user"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

/*
 * Listener
 */
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

/*
 * ensureAuthenticated Callback Function
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
