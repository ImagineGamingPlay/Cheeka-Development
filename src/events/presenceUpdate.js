const chad = config.chadRoleTest;

module.exports = {
    name: "presenceUpdate",
    async execute(oldPresence, newPresence) {

        if (!oldPresence) return;

        if (!newPresence && newPresence.member.roles.cache.get(chad)) {
            newPresence.member.roles.remove(chad)
        }
        if (!oldPresence.member || !newPresence.member) return;
        if (oldPresence.member.bot || newPresence.member.bot) return;
        if (!oldPresence.guild || !newPresence.guild) return;

        if (config.guilds.includes(newPresence.guild.id)) {
            if (!newPresence.activities[0]) return;
            const newState = newPresence.activities[0]?.state
            const oldState = oldPresence.activities[0]?.state
            if (oldState === newState) return;
            if (newState === null && newPresence.member.roles.cache.get(chad)) return newPresence.member.roles.remove(chad);
            if (!oldPresence.activities[0] && !newPresence.activities[0]) return;

            if (newPresence.status === "offline" && newPresence.member.roles.cache.get(chad)) return newPresence.member.roles.remove(chad)
            if (newState?.toLowerCase().includes("discord.gg/igp")) {
                if (newPresence.member.roles.cache.get(chad)) return;
                newPresence.member.roles.add(chad)
            }
            if (newPresence.member.roles.cache.get(chad) && !newState.includes("discord.gg/igp")) {
                newPresence.member.roles.remove(chad)
            }
            if (newPresence.state === "offline" && newPresence.member?.roles.cache.get(chad)) {
                newPresence.member.roles.remove(chad)
            }
        }
    }
}