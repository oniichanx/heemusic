import { Command, Context, heemusic } from '../../structures/index.js';

export default class Leave extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'leave',
            description: {
                content: 'Leaves the voice channel',
                examples: ['leave'],
                usage: 'leave',
            },
            category: 'music',
            aliases: ['dc'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: false,
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
        const embed = this.client.embed();
        if (player) {
            ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(
                            `Left <#${player.node.manager.connections.get(ctx.guild.id).channelId}>`),
                ],
            });
            player.destroy();
        } else {
            ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription(`I'm not in a voice channel`),
                ],
            });
        }
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
