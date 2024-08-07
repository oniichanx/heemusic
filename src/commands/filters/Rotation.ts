import { Command, type Context, type heemusic } from "../../structures/index.js";

export default class Rotation extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "rotation",
            description: {
                content: "cmd.rotation.description",
                examples: ["rotation"],
                usage: "rotation",
            },
            category: "filters",
            aliases: ["rt"],
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
        if (player.filters.includes("rotation")) {
            player.player.setRotation();
            player.filters = player.filters.filter((filter) => filter !== "rotation");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.rotation.messages.disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            player.player.setRotation({ rotationHz: 0 });
            player.filters.push("rotation");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.rotation.messages.enabled"),
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
