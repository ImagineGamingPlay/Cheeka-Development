const {MessageEmbed, GuildTextBasedChannel, Client, Message} = require("discord.js");
const {cRules} = require("../../schema/rules");
module.exports = {
    name: "rule",
    description: "Check a rules of the server.",
    aliases: ["rules"],
    disabledChannel: [],
    cooldown: 5,
    /**
     * @param client {Client} A discord.js client
     * @param message {Message} A discord.js message
     * @param args {Array} A array of the arguments passed to the command
     * @returns {Promise<*>} Returns a promise that might return anything
     */
    run: async ({client, message, args}) => {
        const query = args[0]?.toLowerCase()
        // If query is a number
        if (!isNaN(query)) {
            return;
        }
        if(message.member.permissions.missing(["ADMINISTRATOR"]).length > 0) {
            return message.channel.send("You need the `ADMINISTRATOR` permission to use this command.");
        }
        if (!query) return message.channel.send("Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete'] \n Send -> ['send']")
        /**
         * @type {GuildTextBasedChannel}
         */
        let channel = message.channel
        if (query === 'add' || query === 'create') {
            // Ask the user for the rule title
            const title = await message.channel.send("Please provide the title of the rule and the description.");
            // Wait for the user to type something
            const filter = m => m.author.id === message.author.id;
            try {
                const titleMsg = await channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 60_000,
                    errors: ['time']
                });
                const title = titleMsg.first().content;
                const description = titleMsg.last().content;
                // Create the embed
                let rule = cRules.findOne({
                    guildId: message.guildId
                })
                if(rule.rules) {
                    rule.rules.push({
                        title,
                        description
                    })
                } else {
                    rule.rules = [{
                        title,
                        description
                    }]
                }
            }catch (_e) {
                // say the process was canceled
                return message.channel.send("Process cancelled, you didn't reply in time");
            }
        } else if (query === 'remove' || query === 'delete') {

        } else if (query === 'send') {
        } else {

        }
    },
};
