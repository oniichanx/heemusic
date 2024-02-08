import { Command, Context, heemusic } from '../../structures/index.js';

export default class Nowplaying extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'nowplaying',
            description: {
                content: 'Shows the currently playing song',
                examples: ['nowplaying'],
                usage: 'nowplaying',
            },
            category: 'music',
            aliases: ['np'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: heemusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        const track = player.current;
        const position = player.player.position;
        const duration = track.info.length;
        const bar = client.utils.progressBar(position, duration, 20);
        const embed1 = this.client
            .embed()
            .setColor(this.client.color.main)
            .setAuthor({ name: 'เขากำลังดูดไข่ผมม', iconURL: ctx.guild.iconURL({}) })
            .setThumbnail(track.info.artworkUrl)
            .setDescription(
                `[${track.info.title}](${track.info.uri}) - ชายผู้สั่งให้ผมเริ่มดูดไข่ โดยนาย: ${track.info.requester}\n\n\`${bar}\``
            )
            .addFields({
                name: '\u200b',
                value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(
                    duration
                )}\``,
            });
        return await ctx.sendMessage({ embeds: [embed1] });
    }
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
