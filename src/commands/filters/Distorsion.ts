import { Command, type Context, type heemusic } from "../../structures/index.js";

export default class Distorsion extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "distorsion",
            description: {
                content: "cmd.distorsion.description",
                examples: ["distorsion"],
                usage: "distorsion",
            },
            category: "filters",
            aliases: ["dt"],
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
        const filterEnabled = player.filters.includes("distorsion");

        if (filterEnabled) {
            await player.player.setDistortion({});
            player.filters = player.filters.filter((filter) => filter !== "distorsion");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.distorsion.messages.filter_disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            await player.player.setDistortion({
                sinOffset: 0,
                sinScale: 1,
                cosOffset: 0,
                cosScale: 1,
                tanOffset: 0,
                tanScale: 1,
                offset: 0,
                scale: 1,
            });
            player.filters.push("distorsion");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.distorsion.messages.filter_enabled"),
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
