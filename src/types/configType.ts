type ColorsType = {
    blurple: number;
    red: number;
    green: number;
    white: number;
};

export interface ConfigType {
    boosterDMCooldown?: number;
    aiReactionTimesCalled?: number;
    aiReactionChannels?: string[];
    openaiApiKey?: string;
    guildId: string;
    ownerId: string;
    devGuildId: string;
    staffRoleId: string;
    mainGuildId: string;
    environment: string;
    repCooldownMS?: number;
    token: string;
    clientId: string;
    colors: ColorsType;
    developerRoleId: string;
}
