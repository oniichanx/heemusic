import { Event, type heemusic } from '../../structures/index';

export default class Raw extends Event {
	client: heemusic;

	constructor(client: heemusic, file: string) {
		super(client, file, {
			name: 'raw',
		});
		this.client = client;
	}

	public async run(d: any): Promise<void> {
		this.client.manager.sendRawData(d);
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
