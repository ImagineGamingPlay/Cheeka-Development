const { model, Schema } = require("mongoose");
const reqStr = {
	type: String,
	required: true,
};

module.exports = model(
	"tips",
	new Schema({
		tip: reqStr,
		authorId: reqStr,
	})
);
