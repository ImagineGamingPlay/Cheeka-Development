import { EventListeners } from 'eris';
import glob from 'glob';
import { promisify } from 'util';
import { client } from '../..';
import { Event } from '../classes/Event';

const globPromise = promisify(glob);

export const handleEvents = async () => {
  const events = await globPromise(`${__dirname}/../../events/*{.ts,.js}`);
  events.forEach(async eventFilePath => {
    const eventObj: Event<keyof EventListeners> = await (
      await import(eventFilePath)
    )?.default;

    client.on(eventObj.event, eventObj.run);
  });
};
