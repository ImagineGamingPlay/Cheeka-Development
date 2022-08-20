const {Schema, model} = require('mongoose');

const MutesData = new Schema({
  id: String,
  unmuteOn: Number | null,
  reason: String | null,
  moderator: String | null,
  active: {
    type: Boolean,
    default: true,
  },
  guild: String,
  role: String,
});

/**
 * @typedef {Schema<MutesData>}
 */
module.exports.MutesModel = model('Mute_Data', MutesData);
