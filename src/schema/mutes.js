const { Schema, model } = require("mongoose");

const MutesData = new Schema({
  id: String,
  unmuteOn: Number | null,
  reason: String | null,
  moderator: String | null,
  active: (Boolean = true),
  guild: String,
});

/**
 * @typedef {Schema<MutesData>}
 */
module.exports.MutesModel = model("Mute_Data", MutesData);
