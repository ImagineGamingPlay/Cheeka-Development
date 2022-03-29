const { Schema, model } = require("mongoose");

const TagSchema = new Schema({
  name: String,
  content: String,
  owner: String,
  createdAt: String,
  guild: String,
});

module.exports = model("TagSystem", TagSchema);
