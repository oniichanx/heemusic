import { LoadType } from "shoukaku";
import { Command, type Context, type heemusic } from "../../structures/index.js";

export default class AddSong extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "addsong",
            description: {
                content: "cmd.addsong.description",
                examples: ["addsong <playlist> <song>"],
                usage: "addsong <playlist> <song>",
            },
            category: "playlist",
            aliases: ["as"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "cmd.addsong.options.playlist",
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
                {
                    name: "song",
                    description: "cmd.addsong.options.song",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: heemusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.shift();
        const song = args.join(" ");

        if (!playlist) {
            const errorMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.addsong.messages.no_playlist"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!song) {
            const errorMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.addsong.messages.no_song"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);

        if (!playlistData) {
            const playlistNotFoundError = this.client
                .embed()
                .setDescription(ctx.locale("cmd.addsong.messages.playlist_not_found"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [playlistNotFoundError] });
        }

        const res = await client.queue.search(song);
        if (!res) {
            const noSongsFoundError = this.client
                .embed()
                .setDescription(ctx.locale("cmd.addsong.messages.no_songs_found"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [noSongsFoundError] });
        }

        let trackStrings: any;
        let count: number;
        if (res.loadType === LoadType.PLAYLIST) {
            trackStrings = res.data.tracks;
            count = res.data.tracks.length;
        } else if (res.loadType === LoadType.TRACK) {
            trackStrings = [res.data];
            count = 1;
        }

        client.db.addSong(ctx.author.id, playlist, trackStrings);

        const successMessage = this.client
            .embed()
            .setDescription(ctx.locale("cmd.addsong.messages.added", { count, playlist: playlistData.name }))
            .setColor(this.client.color.green);
        await ctx.sendMessage({ embeds: [successMessage] });
    }

    // Add autocomplete handler
    public async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const userId = interaction.user.id;

        // Fetch user playlists from the database
        const playlists = await this.client.db.getUserPlaylists(userId);

        // Filter playlists based on the focused value and respond
        const filtered = playlists.filter(playlist =>
            playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filtered.map(playlist => ({ name: playlist.name, value: playlist.name }))
        );
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
