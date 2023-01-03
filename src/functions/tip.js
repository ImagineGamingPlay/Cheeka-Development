const tipsSchema = require("../schema/tips");
const disabledCategories = config.disabledCategoriesForTip

client.on("typingStart", async typing => {
	if (disabledCategories.includes(typing.channel.parentId)) return;

	let tips = [];
	await tipsSchema.find({}).then(data => (tips = data.map(obj => obj.tip)));

	const frequency = 696;
	const randomTip = Math.floor(Math.random() * tips.length);
	const randomNum = Math.floor(Math.random() * frequency);

	if (randomNum !== 1) return;

	const tipEmbed = {
		title: "Did you know?",
		description: tips[randomTip],
		color: client.config.colors.primary,
	};
	typing.channel.send({ embeds: [tipEmbed] });
});
