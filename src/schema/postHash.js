const {Schema, model} = require('mongoose');

const PostHash = new Schema({
  hash: String,
  text: String | null,
  img: String | null,
});

/**
 * @typedef {Schema<PostHash>}
 */
module.exports.PostModel = model('Community_Posts', PostHash);
