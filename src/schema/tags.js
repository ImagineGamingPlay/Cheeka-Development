const { Schema, model } = require("mongoose");

const TagSchema = new Schema({
  name: String,
  content: String,
  owner: String,
  createdAt: String,
});

module.exports = model("TagSystem", TagSchema);
