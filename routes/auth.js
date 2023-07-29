const express = require("express");
const app = express();
const passport = require("passport");
const UserModel = require("../models/user");
const locationModel = require("../models/location");
const https = require("https");

app.get("/", (req, res) => {
  res.render("index", { title: "title", crop: undefined });
});

app.get("/login", (req, res) => {
  let message = null;
  res.render("login", { message: message });
});

app.post("/login", (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        if (req.user.isStaff) {
          console.log(req.user);
          return res.redirect("/profile");
        }
        res.redirect("/crops");
      });
    }
  });
});

// Registor Get and Post
app.get("/register", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  UserModel.register(
    {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      location: req.body.location,
      phonenumber: req.body.phonenumber,
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/login");
        });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
// Profile
app.get("/profile", (req, res) => {
  if (req.isAuthenticated() && req.user.isStaff) {
    locationModel.findOne({ name: req.user.location }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let crops = result.crops;
        res.render("profile", { crops: crops });
      }
    });
  } else {
    res.redirect("/crops");
  }
});
app.post("/profile", (req, res) => {
  let cropName = req.body.cropName;
  let price = req.body.price;
  locationModel.findOneAndUpdate(
    { name: req.user.location, "crops.name": cropName },
    { $set: { "crops.$.msp": price } },
    { new: true },
    (err, doc) => {}
  );
  return res.redirect("crops");
});

module.exports = app;
