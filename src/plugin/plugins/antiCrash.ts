import type { heemusic } from '../../structures/index';
import type { BotPlugin } from '../index';

const antiCrash: BotPlugin = {
	name: 'AntiCrash Plugin',
	version: '1.0.0',
	author: 'oniichanx',
	initialize: (client: heemusic) => {
		const handleExit = async (): Promise<void> => {
			if (client) {
				client.logger.star('Disconnecting from Discord...');
				await client.destroy();
				client.logger.success('Successfully disconnected from Discord!');
				process.exit();
			}
		};
		process.on('unhandledRejection', (reason, promise) => {
			client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
		});
		process.on('uncaughtException', err => {
			client.logger.error('Uncaught Exception thrown:', err);
		});
		process.on('SIGINT', handleExit);
		process.on('SIGTERM', handleExit);
		process.on('SIGQUIT', handleExit);
	},
};

export default antiCrash;

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
