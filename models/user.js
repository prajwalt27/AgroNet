const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  location: String,
  password: String,
  phonenumber: Number,
  harvest: Array,
  isStaff: Boolean,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", UserSchema);
