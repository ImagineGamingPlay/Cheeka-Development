import {
    ApplicationCommandType,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    MessageApplicationCommandData,
    MessageContextMenuCommandInteraction,
    UserApplicationCommandData,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import { Cheeka } from '../lib';

export interface ModifiedChatInputCommandInteraction
    extends ChatInputCommandInteraction {
    member: GuildMember;
}

export interface ModifiedUserContextMenuCommandInteraction
    extends UserContextMenuCommandInteraction {
    targetMember: GuildMember;
}

export interface ModifiedMessageContextMenuCommandInteraction
    extends MessageContextMenuCommandInteraction {
    targetMember: GuildMember;
}

export interface LoadedApplicationCommands {
    LoadedCommands: string;
}

export interface CommandRunParams {
    client: Cheeka;
    interaction: ModifiedChatInputCommandInteraction;
    options?: CommandInteractionOptionResolver;
}
export interface UserContextMenuRunParams {
    client: Cheeka;
    interaction: ModifiedUserContextMenuCommandInteraction;
}
export interface MessageContextMenuRunParams {
    client: Cheeka;
    interaction: ModifiedMessageContextMenuCommandInteraction;
}

type Command<T extends number, U extends object, V extends object> = {
    type: T;
} & U &
    V;

export type ChatInputCommandData = Command<
    ApplicationCommandType.ChatInput,
    {
        devOnly?: boolean;
        ownerOnly?: boolean;
        run: (params: CommandRunParams) => Promise<void>;
        autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    },
    ChatInputApplicationCommandData
>;

export type UserContextMenuData = Command<
    ApplicationCommandType.User,
    {
        devOnly?: boolean;
        ownerOnly?: boolean;
        run: (params: UserContextMenuRunParams) => Promise<void>;
    },
    UserApplicationCommandData
>;

export type MessageContextMenuData = Command<
    ApplicationCommandType.Message,
    {
        devOnly?: boolean;
        ownerOnly?: boolean;
        run: (params: MessageContextMenuRunParams) => Promise<void>;
    },
    MessageApplicationCommandData
>;

// export interface ChatInputCommandData extends ChatInputApplicationCommandData {
//     type: ApplicationCommandType.ChatInput;
//     devOnly?: boolean;
//     ownerOnly?: boolean;
//     run: (params: CommandRunParams) => Promise<void>;
//     autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
// }
// export interface UserContextMenuData extends UserApplicationCommandData {
//     type: ApplicationCommandType.User;
//     devOnly?: boolean;
//     ownerOnly?: boolean;
//     run: (params: UserContextMenuRunParams) => Promise<void>;
// }
//
// export interface MessageContextMenuData extends MessageApplicationCommandData {
//     type: ApplicationCommandType.Message;
//     devOnly?: boolean;
//     ownerOnly?: boolean;
//     run: (params: MessageContextMenuRunParams) => Promise<void>;
// }

export type CommandData =
    | ChatInputCommandData
    | UserContextMenuData
    | MessageContextMenuData;

export interface ButtonRunParams {
    interaction: ButtonInteraction;
    id: string;
    scope: string;
}

export interface ButtonOptions {
    scope: string;
    run: (params: ButtonRunParams) => Promise<void>;
}
