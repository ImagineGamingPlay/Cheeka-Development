import { EmbedBuilder } from "discord.js";
import { Command } from "../../lib/classes/Command";
import { humanizeMillisecond } from "../../utils/HumanizeMillisecond";

export default new Command({
    name: 'ping',
    description: 'View the connection status',

    run: async ({ interaction, client }) => {
        const uptimeInMilliseconds = client.uptime ?? 0;
        const { hours, minutes } = humanizeMillisecond(uptimeInMilliseconds);

        const message = await interaction.fetchReply();
        const clientPing =
            message.createdTimestamp - interaction.createdTimestamp;
        const websocketPing = client.ws.ping;

        const clientPingEmoji = getPingStatusInEmoji(clientPing);
        const websocketPingEmoji = getPingStatusInEmoji(websocketPing);

        const embed = new EmbedBuilder({
            title: ':ping_pong: Ping Status',
            description: 'Information about the latency and uptime!',
            color: client.config.colors.blurple,
            // author: {
            //   name: interaction.user.username,
            //   iconURL: interaction.user.avatarURL() || '',
            // },
            fields: [
                {
                    name: 'Ping',
                    value: `Client: ${clientPingEmoji} ${clientPing}ms\nWebsocket: ${websocketPingEmoji} ${websocketPing}ms`,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: `${hours} hours, ${minutes} minutes`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        });

        interaction.editReply({ embeds: [embed] });
    },
});

const getPingStatusInEmoji = (ping: number) => {
    if (ping < 150) {
        re"🟢" '🟢';
    }
    if (ping < 350) {
        re"🟡" '🟡';
    }
    re"🔴" '🔴';
};
