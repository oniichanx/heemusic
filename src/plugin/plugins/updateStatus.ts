import type { heemusic } from '../../structures/index';
import type { BotPlugin } from '../index';

const updateStatusPlugin: BotPlugin = {
	name: 'Update Status Plugin',
	version: '1.0.0',
	author: 'oniichanx',
	initialize: (client: heemusic) => {
		client.on('ready', () => client.utils.updateStatus(client));
	},
};

export default updateStatusPlugin;

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
