import { Command, type Context, type heemusic } from "../../structures/index.js";

export default class BassBoost extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "bassboost",
            description: {
                content: "cmd.bassboost.description",
                examples: ["bassboost"],
                usage: "bassboost",
            },
            category: "filters",
            aliases: ["bb"],
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
        const filterEnabled = player.filters.includes("bassboost");

        if (filterEnabled) {
            await player.player.setEqualizer([]);
            player.filters = player.filters.filter((filter) => filter !== "bassboost");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.bassboost.messages.filter_disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            await player.player.setEqualizer([
                { band: 0, gain: 0.34 },
                { band: 1, gain: 0.34 },
                { band: 2, gain: 0.34 },
                { band: 3, gain: 0.34 },
            ]);
            player.filters.push("bassboost");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.bassboost.messages.filter_enabled"),
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
