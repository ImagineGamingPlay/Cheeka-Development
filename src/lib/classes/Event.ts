import { ClientEvents } from 'discord.js';

export class Event<K extends keyof ClientEvents> {
    constructor(
        public event: K,
        public run: (...args: ClientEvents[K]) => void
    ) {}
}
