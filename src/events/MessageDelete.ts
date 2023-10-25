import { Event } from '../lib/classes/Event';
import { handleMessageDelete } from '../features/handleMessageDelete';
export default new Event('messageDelete', async message => {
    if (message.author?.bot) {
        return;
    }

    if (message.partial) {
        return;
    }

    await handleMessageDelete(message);
});
