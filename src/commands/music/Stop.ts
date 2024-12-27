import { Command, type Context, type heemusic } from '../../structures/index';

export default class Stop extends Command {
	constructor(client: heemusic) {
		super(client, {
			name: 'stop',
			description: {
				content: 'cmd.stop.description',
				examples: ['stop'],
				usage: 'stop',
			},
			category: 'music',
			aliases: ['sp'],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: true,
				active: true,
				djPerm: null,
			},
			permissions: {
				dev: false,
				client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: heemusic, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild!.id);
		const embed = this.client.embed();
		if (!player) return await ctx.sendMessage(ctx.locale('event.message.no_music_playing'));
		player.stopPlaying(true, false);

		return await ctx.sendMessage({
			embeds: [embed.setColor(this.client.color.main).setDescription(ctx.locale('cmd.stop.messages.stopped'))],
		});
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
