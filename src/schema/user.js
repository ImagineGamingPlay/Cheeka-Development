const { Schema, model } = require("mongoose");

const UserType = new Schema({
  id: String,
  thanks: Number,
});

module.exports = model("User_Storage", UserType);
