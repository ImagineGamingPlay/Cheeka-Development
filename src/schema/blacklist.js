const {Schema, model} = require('mongoose');

const Blacklist = new Schema({
    UserId: String,
});
/**
 * @type {Model<Blacklist>}
 */
module.exports = model('Blacklist_User', Blacklist);