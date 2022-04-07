const { Schema, model } = require("mongoose");

const GuildData = new Schema({
  id: String,
  ruleChannel: String,
  ruleMessage: String,
  leaderboardChannel: String,
  leaderboardMessage: String,
  infoChannel: String,
  infoMessage: String,
  videoChannel: String,
  videoRole: String,
});

/**
 * @type {Model<GuildData>}
 */
module.exports.GuildData = model("Guild_Data", GuildData);
