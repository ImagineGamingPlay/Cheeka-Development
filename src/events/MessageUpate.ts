import { Event } from '../lib/classes/Event';
import { handleMessageUpdate } from '../features';
export default new Event('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.author?.bot) {
        return;
    }

    if (newMessage.partial || oldMessage.partial) {
        return;
    }

    await handleMessageUpdate(oldMessage, newMessage);
});
