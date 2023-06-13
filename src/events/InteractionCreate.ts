import { CacheType, CommandInteractionOptionResolver, EmbedBuilder, Interaction } from "discord.js";
import { client } from "..";
import { Event } from "../lib";
import { ModifiedCommandInteraction, RunParams } from "../types";

const handleSlashCommands = async (interaction: ModifiedCommandInteraction) => {
    await interaction.deferReply();

    const command = client.commands.get(interaction.commandName);

    if (
        command?.devOnly &&
        !interaction.member.roles.cache.has(client.config.developerRoleId)
    ) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle"Oops! Something went wrong"')
                    .setColor(client.config.colors.red)
                    .setDescription(
                       "Turns out this is a **developer only command**, and you do not seem to be my developer!"'
                    ,
            ],
            ephemeral: tru,
        });
        return;
    }

    if (
        command?.ownerOnly &&
        interaction.guild?.ownerId !== interaction.member.id
    ) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle"Oops! Something went wrong"')
                    .setColor(client.config.colors.red)
                    .setDescription(
                       "Apparently you need to be the owner of the server to run this command! *very prestigious, I know*"'
                    ,
            ],
            ephemeral: tru,
        });
        return;
    }
    const params: RunParams = {
        client,
        interaction,
        options:
            interaction.options as CommandInteractionOptionResolver<CacheType,
    };

    await command?.run(params);
};

export default new Event(
    "interactionCreate",
    async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            return await handleSlashCommands(
                interaction as ModifiedCommandInteraction
            );
        }
    }
);
