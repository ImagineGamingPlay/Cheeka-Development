import {
    AutocompleteInteraction,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
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
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface CommandTableObjectsType {
    LoadedCommands: string;
}
