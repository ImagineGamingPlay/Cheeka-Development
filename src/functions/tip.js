
client.on("typingStart", typing => {
	if (typing.channel.id !== "954618018560868392") return;
	const tips = [
		"You can dm the bot to create a modmail?! You can directly talk to the staff team or the bot development team!",
		"We got fun commands, too? Try `-help` and select the **fun** category! We got commands like 8ball, meme, hack etc!",
	]; // TODO: Add schema for tips


	const frequency = 40;
	const randomTip = Math.floor(Math.random() * tips.length);
	const randomNum = Math.floor(Math.random() * frequency);

	if (randomNum !== 1) return;

	const tipEmbed = {
		title: "Did you know?",
		description: tips[randomTip],
		color: "BLURPLE",
	};
	typing.channel.send({ embeds: [tipEmbed] });
});
