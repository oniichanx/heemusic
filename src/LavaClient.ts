import { ClientOptions, GatewayIntentBits } from 'discord.js';

import config from './config.js';
import heemusic from './structures/Heemusic.js';

const {
    GuildMembers,
    MessageContent,
    GuildVoiceStates,
    GuildMessages,
    Guilds,
    GuildMessageTyping,
} = GatewayIntentBits;
const clientOptions: ClientOptions = {
    intents: [
        Guilds,
        GuildMessages,
        MessageContent,
        GuildVoiceStates,
        GuildMembers,
        GuildMessageTyping,
    ],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false,
    },
};

const client = new heemusic(clientOptions);

client.start(config.token);

/**
 * Project: heemusic
 * Author: oniichanx
 * Company: ArchGG
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of ArchGG and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/heelee
 */
