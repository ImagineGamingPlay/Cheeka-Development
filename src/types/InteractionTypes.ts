import { ButtonInteraction } from 'discord.js';

interface RunParams {
    interaction: ButtonInteraction;
    id: string;
    scope: string;
}

export interface ButtonOptions {
    scope: string;
    run: (params: RunParams) => Promise<void>;
}
