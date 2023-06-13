type ColorsType = {
  blurple: number;
  red: number;
  green: number;
  white: number;
};

export interface ConfigType {
  aiReactionTimesCalled?: number;
  aiReactionChannels?: string[];
  openaiApiKey?: string;
  guildId: string;
  devGuildId: string;
  mainGuildId: string;
  environment: string;
  token: string;
  clientId: string;
  colors: ColorsType;
  developerRoleId: string;
}
