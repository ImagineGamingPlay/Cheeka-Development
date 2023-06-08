import {
  // ApplicationCommandData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  // SlashCommandBuilder,
} from 'discord.js';
import { Cheeka } from '../lib';

export interface ModifiedCommandInteraction extends CommandInteraction {
  member: GuildMember;
}

export interface RunParams {
  client: Cheeka;
  interaction: ModifiedCommandInteraction;
  options?: CommandInteractionOptionResolver;
}

export interface CommandType extends ChatInputApplicationCommandData {
  devOnly?: boolean;
  ownerOnly?: boolean;
  run: (options: RunParams) => Promise<void>;
}

// export type CommandType = SlashCommandBuilder | ApplicationCommandData;
