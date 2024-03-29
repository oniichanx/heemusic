import { Command, Context, heemusic } from '../../structures/index.js';

export default class GuildLeave extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'guildleave',
            description: {
                content: 'Leave a guild',
                examples: ['guildleave'],
                usage: 'guildleave',
            },
            category: 'dev',
            aliases: ['gl'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: heemusic, ctx: Context, args: string[]): Promise<any> {
        const guild = this.client.guilds.cache.get(args[0]);
        if (!guild) return await ctx.sendMessage('Guild not found');
        try {
            await guild.leave();
            ctx.sendMessage(`Left guild ${guild.name}`);
        } catch (e) {
            ctx.sendMessage(`Failed to leave guild ${guild.name}`);
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
