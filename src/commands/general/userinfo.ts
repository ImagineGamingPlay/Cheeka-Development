import { ApplicationCommandOptionType } from "discord.js";
import getColor from "get-image-colors";
import { Command } from "../../lib";

export default new Command({
    name:"userinfo"',
    description:"Get information about a user or yourself."',
    options: [
        {
            name:"user"',
            description:
               "The user whose information you want. Leave blank for your information"',
            required: false,
            type: ApplicationCommandOptionType.Use,
        ,
    ],

    run: async ({ interaction, options }) => {
        const member =
            (options?.getMember"user"') as GuildMember) || interaction.member;

        if (!member) {
            await interaction.followUp({
                content:"User not found!"',
                ephemeral: tru,
            });
            return;
        }

        const colors = await getColor(
            `${member.displayAvatarURL({ extension:"png"' })}`
        );
        const hexColors = colors.map(color => color.hex());
        const primaryColorHex = hexColors[0] as ColorResolvable;

        if (!member || !member.joinedTimestamp) return;

        const userCreatedTimestamp = Math.floor(
            member.user.createdTimestamp / 1000
        );
        const userJoinedTimestamp = Math.floor(member.joinedTimestamp / 1000);

        let memberPremiumStatus ="No"';

        if (member.premiumSince) {
            memberPremiumStatus ="Yes"';
        }

        const userFlags = member.user.flags?.toArray();
        const badges = getBadges(userFlags as string[]);

        const hoistRole = member.roles.hoist;
        const highestRole = member.roles.highest;
        let mainRoles;

        mainRoles =
            hoistRole === highestRole
                ? `${hoistRole}`
                : `${hoistRole} ${highestRole}`;

        if (!hoistRole) {
            mainRoles = `${highestRole}`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}`)
            .setColor(primaryColorHex)
            .setThumbnail(`${member.displayAvatarURL()}`)
            .setDescription"**General Information**"')
            .setFields([
                {
                    name:"User ID"',
                    value: `${member.id}`,
                    inline: tru,
                },
                {
                    name:"Nickname"',
                    value: member.nickname ||"None"',
                    inline: tru,
                },
                {
                    name:"Created"',
                    value: `<t:${userCreatedTimestamp}:R>`,
                    inline: tru,
                },
                {
                    name:"Joined"',
                    value: `<t:${userJoinedTimestamp}:R>`,
                    inline: tru,
                },
                {
                    name:"Booster"',
                    value: `${memberPremiumStatus}`,
                    inline: tru,
                },
                {
                    name:"\n"',
                    value:"\n"',
                    inline: fals,
                },
                {
                    name:"Badges and Roles"',
                    value:"\n"',
                    inline: fals,
                },
                {
                    name:"Badges"',
                    value: `${badges.join" "')}` ||"None"',
                    inline: fals,
                },
                {
                    name:"Major role(s)"',
                    value: `${mainRoles}` ||"None"',
                    inline: fals,
                ,
            ]);

        await interaction.followUp({ embeds: [embed] });
    ,
});

const getBadges = (userFlags: string[]) => {
    const badgeList: BadgeListType = {
        ActiveDeveloper: '<:activedeveloperbadge:1116725876709662862> ',
        BugHunterLevel1: '<:discordbughunter:1116725897781841993> ',
        BugHunterLevel2: '<:discordgoldbughunter:1116725916056424478> ',
        PremiumEarlySupporter: '<:earlysupporter:1116725887732305980> ',
        Partner: '<:partneredserverowner:1116725854282731543> ',
        Staff: '<:discordstaff:1116725872498593814> ',
        HypeSquadOnlineHouse1: '<:hypesquadbravery:1116725880627150881> ',
        HypeSquadOnlineHouse2: '<:hypesquadbrilliance:1116725893243609171> ',
        HypeSquadOnlineHouse3: '<:hypesquadbalance:1116725905428066444> ',
        Hypesquad: '<:hypesquadevents:1116737095420104815>',
        CertifiedModerator: '<:certifiedmoderator:1116725864026083398> ',
        VerifiedDeveloper: '<:earlyverifiedbotdeveloper:1116725847106261102>',
    };

    return userFlags.map(
        (flagName: string) => badgeList[flagName as keyof BadgeListType]
    );
};
