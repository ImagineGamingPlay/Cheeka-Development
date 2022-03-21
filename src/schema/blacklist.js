const {Schema, model} = require('mongoose');

const Blacklist = new Schema({
    UserId: String,
});

const BlacklistChannel = new Schema({
    channelId: String,
});
/**
 * @type {Model<Blacklist>}
 */
module.exports = model('Blacklist_User', Blacklist);
/**
 * @type {Model<BlacklistChannel>}
 */
module.exports.BlacklistChannel = model('Blacklist_Channel', BlacklistChannel);