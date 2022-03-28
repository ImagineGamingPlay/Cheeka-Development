const { Schema, model } = require("mongoose")

module.exports = model("warnings", new Schema({
  guildId: String,
  userId: String,
  userTag: String,
  content: Array
}))