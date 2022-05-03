const tipsSchema = require("../schema/tips");

client.on("typingStart", async typing => {
	// if (typing.channel.id !== "743528053019508848") return;

	let tips = [];
	await tipsSchema.find({}).then(data => (tips = data.map(obj => obj.tip)));

	// const tips = [
	// 	"You can dm the bot to create a modmail?! You can directly talk to the staff team or the bot development team through this feature!",
	// 	"We got fun commands, too? Try `-help` and select the **fun** category! We got commands like 8ball, meme, hack etc!",
	// ];

	const frequency = 100;
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
