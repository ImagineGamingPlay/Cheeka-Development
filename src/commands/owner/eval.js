const Discord = require("discord.js");
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    MessageAttachment,
} = require("discord.js");

module.exports = {
    name: "eval",
    category: "owner",
    devCmd: true,
    description: "Evaluate a JavaScript code.",
    disabledChannel: [],
    /**
     * @param client {Client} A discord.js client
     * @param message {Message} A discord.js message
     * @param args {Array} A array of the arguments passed to the command
     * @returns {Promise<*>} Returns a promise that might return anything
     */
    run: async ({client, message, args}) => {

        const notowner = new MessageEmbed()
            .setDescription("Only the developers of cheeku can use this command!")
            .setColor("DARK_ORANGE");

        if (!config.devs.includes(message.author.id))
            return message.channel.send({embeds: [notowner]});


        const clean = async (text) => {
            if (typeof text === "string")
                return text
                    // .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203))
                    .replace(/client.token/g, "[Something Important]");
            else return text;
        };

        try {
            const code = args.join(" ");
            if (!code) {
                return message.channel.send("You forgot your code, dummy");
            }

            let evalCode = code.includes(`await`) ? `;(async () => { ${code} })()` : code;

            let evaled = await clean(eval(evalCode));
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            let output;
            if(evaled !== undefined) {
              output = `\`\`\`js\n` + evaled + `\n\`\`\``;
            } else {
                output = `\`\`\`fix\nNo Output To Show.\n\`\`\``;
            }
            output = output.length >1024 ? '```fix\nLarge Output\n```' : output ;
            const embed = new MessageEmbed()
                .setAuthor({name: "Eval", iconURL: message.author.avatarURL()})
                .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
                .addField("Output",output)
                .setColor("#00ffee")
                .setTimestamp();
            message.channel.send({embeds: [embed]});
        } catch (err) {
            const errorEmb = new MessageEmbed()
            .setAuthor({name: "Eval", iconURL: message.author.avatarURL()})
            .setColor(`#ff0000`)
            .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
            .addField('Error', `\`\`\`js\n${err}\n\`\`\``)
            message.channel.send({embeds: [errorEmb]});
        }
    },
};
