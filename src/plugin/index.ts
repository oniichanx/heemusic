import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { heemusic } from '../structures/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function loadPlugins(client: heemusic): void {
    const pluginsFolder = path.join(__dirname, './plugins');
    const pluginFiles = fs.readdirSync(pluginsFolder).filter(file => file.endsWith('.js'));

    pluginFiles.forEach(async (file: string) => {
        const plugin = (await import(`./plugins/${file}`)).default as BotPlugin;
        if (plugin.initialize) plugin.initialize(client);
        client.logger.info(`Loaded plugin: ${plugin.name} v${plugin.version}`);
    });
}

export interface BotPlugin {
    name: string;
    version: string;
    author: string;
    description?: string;
    initialize: (client: heemusic) => void;
    shutdown?: (client: heemusic) => void;
}
/**
 * Project: heemusic
 * Author: oniichanx
 * Company: ArchGG
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of ArchGG and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/heelee
 */
