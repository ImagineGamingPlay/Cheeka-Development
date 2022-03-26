const { Schema, model } = require("mongoose");

const GuildData = new Schema({
  id: String,
  ruleChannel: String,
  ruleMessage: String,
  leaderboardChannel: String,
  leaderboardMessage: String,
});

/**
 * @type {Model<GuildData>}
 */
module.exports.GuildData = model("Guild_Data", GuildData);
