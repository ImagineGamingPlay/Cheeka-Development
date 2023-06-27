import { ButtonOptions } from '../../types/InteractionTypes';

export class Button {
    constructor(buttonOptions: ButtonOptions) {
        Object.assign(this, buttonOptions);
    }
}
