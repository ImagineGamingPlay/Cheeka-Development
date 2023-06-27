import { logger } from 'console-wizard';
import { ButtonOptions } from '../../types/InteractionTypes';
import { getFiles } from '../../utils';
import { client } from '../..';

export const registerButtons = async () => {
    const buttons: ButtonOptions[] = [];
    const buttonFiles = getFiles(
        `${__dirname}/../../interactions/buttons`,
        false
    );

    for (const file of buttonFiles) {
        const { ...button }: ButtonOptions = await (await import(file)).default;

        if (!button.scope) {
            logger.error('A button is missing scope!');
            return;
        }
        buttons.push(button);
        client.buttons.set(button.scope, button);
    }
};
