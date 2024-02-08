import { heemusic } from '../../structures/index.js';
import { BotPlugin } from '../index.js';

const updateStatusPlugin: BotPlugin = {
    name: 'Update Status Plugin',
    version: '1.0.0',
    author: 'oniichanx',
    initialize: (client: heemusic) => {
        client.on('ready', () => {
            client.utils.updateStatus(client);
        });
    },
};

export default updateStatusPlugin;


/**
 * Project: heemusic
 * Author: oniichanx
 * Company: ArchGG
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of ArchGG and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/heelee
 */