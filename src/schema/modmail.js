const { model, Schema } = require("mongoose");

module.exports = model(
	"modmail",
	new Schema({
		authorId: String,
		content: Array,
	})
);
