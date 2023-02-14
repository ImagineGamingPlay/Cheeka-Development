import {
  ChatInputApplicationCommandStructure,
  CommandInteraction,
  InteractionDataOptions,
} from 'eris';
import { Cheeka } from '../lib';

export interface RunParams {
  client: Cheeka;
  interaction: CommandInteraction;
  options?: InteractionDataOptions[];
}

export interface CommandType extends ChatInputApplicationCommandStructure {
  run: (options: RunParams) => Promise<void>;
}
