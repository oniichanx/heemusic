import type { DestroyReasonsType, LavalinkNode } from 'lavalink-client';
import { Event, type heemusic } from '../../structures/index';
import { sendLog } from '../../utils/BotLog';

export default class Destroy extends Event {
	constructor(client: heemusic, file: string) {
		super(client, file, {
			name: 'destroy',
		});
	}

	public async run(node: LavalinkNode, destroyReason?: DestroyReasonsType): Promise<void> {
		this.client.logger.success(`Node ${node.id} is destroyed!`);
		sendLog(this.client, `Node ${node.id} is destroyed: ${destroyReason}`, 'warn');
	}
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
