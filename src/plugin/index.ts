import fs from 'node:fs';
import path from 'node:path';
import type { heemusic } from '../structures/index';

const pluginsFolder = path.join(__dirname, 'plugins');

export default async function loadPlugins(client: heemusic): Promise<void> {
	try {
		const pluginFiles = fs.readdirSync(pluginsFolder).filter(file => file.endsWith('.js'));
		for (const file of pluginFiles) {
			const pluginPath = path.join(pluginsFolder, file);
			const { default: plugin } = require(pluginPath);
			if (plugin.initialize) plugin.initialize(client);
			client.logger.info(`Loaded plugin: ${plugin.name} v${plugin.version}`);
		}
	} catch (error) {
		client.logger.error('Error loading plugins:', error);
	}
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
 * Main Contributor: oniichanx
 * Company: ArchGG
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of ArchGG and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/heelee
 */
