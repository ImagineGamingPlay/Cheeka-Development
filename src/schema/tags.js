const { Schema , model } = require('mongoose');

const TagSchema = new Schema({
Id: String,
Name:String,
Code:String,
Created:String
});

module.exports = model('TagSystem',TagSchema);