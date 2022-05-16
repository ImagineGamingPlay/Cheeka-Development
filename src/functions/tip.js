const tipsSchema = require("../schema/tips");
const disabledCategories = [
	"743528047365586956", // info
	"811276960608419860", // coding guides
	"936233447503044618", // member codes
	"937321789384704010", // hire and collab
	"936247915230425118", // showcase
	"936241367875731467", // promote
	"923185925222178856", // archived
];

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
