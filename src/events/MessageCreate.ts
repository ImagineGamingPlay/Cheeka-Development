import { promoTimeout } from '../features';
import { Event } from '../lib';

export default new Event('messageCreate', async message => {
  if (message.author.bot) {
    return;
  }
  await promoTimeout(message, 1).then(() => console.log('promoTimeout called'));
});
