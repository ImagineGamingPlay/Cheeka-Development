import { CommandData } from '../../types';

export class Command {
    constructor(commandOptions: CommandData) {
        Object.assign(this, commandOptions);
    }
}
