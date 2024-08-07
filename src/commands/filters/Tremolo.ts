import { Command, type Context, type heemusic } from "../../structures/index.js";

export default class Tremolo extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "tremolo",
            description: {
                content: "cmd.tremolo.description",
                examples: ["tremolo"],
                usage: "tremolo",
            },
            category: "filters",
            aliases: ["tr"],
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
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: heemusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const tremoloEnabled = player.filters.includes("tremolo");

        if (tremoloEnabled) {
            player.player.setTremolo();
            player.filters.splice(player.filters.indexOf("tremolo"), 1);
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.tremolo.messages.disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            player.player.setTremolo({ depth: 0.75, frequency: 4 });
            player.filters.push("tremolo");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.tremolo.messages.enabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        }
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
