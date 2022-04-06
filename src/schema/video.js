const { Schema, model } = require("mongoose");

const Video = new Schema({
  id: String,
});

module.exports = model("Video_Data", Video);
