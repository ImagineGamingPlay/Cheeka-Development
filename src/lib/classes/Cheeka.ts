import {
    ActivitiesOptions,
    ActivityType,
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
    Partials,
    PresenceUpdateStatus,
} from 'discord.js';
import { handleEvents } from '../../handlers';
import { config } from '../../config';
import { ChatInputCommandData } from '../../types';
import { logger } from 'console-wizard';
import { ConfigType } from './../../types/configType';
import { PrismaClient } from '@prisma/client';
import {
    ButtonOptions,
    MessageContextMenuData,
    UserContextMenuData,
} from '../../types/InteractionTypes';
import { registerApplicationCommands } from '../functions/registerApplicatonCommands';
import { registerButtons } from '../functions/registerButtons';
import { prisma } from '../..';

const { Guilds, GuildMessages, DirectMessages, GuildMembers, MessageContent } =
    GatewayIntentBits;
const { Channel } = Partials;
const clientOptions: ClientOptions = {
    intents: [
        Guilds,
        GuildMessages,
        DirectMessages,
        GuildMembers,
        MessageContent,
    ],
    partials: [
        Channel
    ],
    allowedMentions: {
        repliedUser: true,
    },
};

const setActivityStatus = (client: Cheeka) => {
    const activities: ActivitiesOptions[] = [
        {
            name: 'Better than Sans the Skeleton',
            type: ActivityType.Playing,
        },
        {
            name: 'main-chat, the help channel',
            type: ActivityType.Listening,
        },
        {
            name: "keita's media stash",
            type: ActivityType.Watching,
        },
    ];
    const { floor, random } = Math;

    setInterval(() => {
        const randomActivityIndex = floor(random() * activities.length);

        client.user?.setPresence({
            activities: [activities[randomActivityIndex]],
            status: PresenceUpdateStatus.Online,
        });
    }, 2 * 60 * 60 * 1000 /* 2 hours */);
};

export class Cheeka extends Client {
    config: ConfigType;
    commands: Collection<string, ChatInputCommandData>;
    buttons: Collection<string, ButtonOptions>;
    userContextMenus: Collection<string, UserContextMenuData>;
    messageContextMenus: Collection<string, MessageContextMenuData>;
    prisma: PrismaClient;

    constructor() {
        super(clientOptions);

        this.config = config;

        this.commands = new Collection();
        this.buttons = new Collection();
        this.userContextMenus = new Collection();
        this.messageContextMenus = new Collection();

        this.prisma = prisma;
    }

    async deploy() {
        await handleEvents();
        await this.login(config.token);

        await registerApplicationCommands();
        await registerButtons();
        await prisma
            .$connect()
            .then(() => logger.success('Database Connected!'));
        setActivityStatus(this);
        logger.success('Client Deployed!');
        logger.info(`Environment: ${this.config.environment}`);
    }
}
