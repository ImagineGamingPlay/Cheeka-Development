const { Schema, model } = require("mongoose");
const reqStr = {
	type: String,
	required: true,
};

module.exports = model(
	"warnings",
	new Schema({
		guildId: reqStr,
		userId: reqStr,
		executerId: reqStr,
		reason: reqStr,
		date: {
			type: Date,
			required: true,
		},
	})
);
