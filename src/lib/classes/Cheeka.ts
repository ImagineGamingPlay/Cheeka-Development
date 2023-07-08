import {
    ActivitiesOptions,
    ActivityType,
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
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

const { Guilds, GuildMessages, DirectMessages, GuildMembers, MessageContent } =
    GatewayIntentBits;

const clientOptions: ClientOptions = {
    intents: [
        Guilds,
        GuildMessages,
        DirectMessages,
        GuildMembers,
        MessageContent,
    ],
    allowedMentions: {
        repliedUser: true,
    },
};

const setActivityStatus = (client: Cheeka) => {
    const activities: ActivitiesOptions[] = [
        {
            name: "Minecraft on IGP's MC Server!",
            type: ActivityType.Playing,
        },
        {
            name: "to your queries on IGP's server!",
            type: ActivityType.Listening,
        },
        {
            name: "IGP's video on YouTube!",
            type: ActivityType.Watching,
        },
    ];
    const { floor, random } = Math;
    const randomActivityIndex = floor(random() * activities.length);
    client.user?.setPresence({
        activities: [activities[randomActivityIndex]],
        status: PresenceUpdateStatus.Online,
    });
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

        this.prisma = new PrismaClient({
            log:
                config.environment === 'dev'
                    ? ['query', 'info', 'warn', 'error']
                    : ['warn', 'error'],
        });
    }

    async deploy() {
        await handleEvents();
        await this.login(config.token).then(() => console.log('Logged!'));

        await registerApplicationCommands();
        await registerButtons();
        await this.prisma
            .$connect()
            .then(() => logger.success('Database Connected!'));
        setActivityStatus(this);
        logger.success('Client Deployed!');
        logger.info(`Environment: ${this.config.environment}`);
    }
}
