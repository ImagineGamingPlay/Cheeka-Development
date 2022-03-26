const {Schema, model} = require('mongoose');

const TagSchema = new Schema({
    Name: String,
    Content: String,
    UserId: String,
    CreatedAt: String
});

module.exports = model('TagSystem', TagSchema);