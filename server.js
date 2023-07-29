const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const cropsRoutes = require("./routes/crops");
const UserModel = require("./models/user");
// Configuration of App

require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "This is Auth",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use("/", authRoutes);
app.use("/", cropsRoutes);

mongoose.set("strictQuery", false);
// Configuring DataBase
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(` The Server is running at port ${PORT}`);
});
