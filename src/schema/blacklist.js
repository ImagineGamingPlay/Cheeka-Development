const { Schema, model } = require('mongoose');

const Blacklist = new Schema({
    UserId : String,
});

module.exports = model('Blacklist_User',Blacklist);