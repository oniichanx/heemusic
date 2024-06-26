import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, CommandInteraction, type TextChannel } from "discord.js";

import config from "../config.js";
import type { Context, heemusic } from "../structures/index.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Utils {
    public static formatTime(ms: number): string {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) {
            return `${ms / 1000}s`;
        }
        if (ms < hourMs) {
            return `${Math.floor(ms / minuteMs)}m ${Math.floor((ms % minuteMs) / 1000)}s`;
        }
        if (ms < dayMs) {
            return `${Math.floor(ms / hourMs)}h ${Math.floor((ms % hourMs) / minuteMs)}m`;
        }
        return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
    }

    public static updateStatus(client: heemusic, guildId?: string): void {
        const { user } = client;
        if (user && guildId === config.guildId) {
            const player = client.queue.get(config.guildId);
            user.setPresence({
                activities: [
                    {
                        name: player?.current ? `🎶 | ${player.current.info.title}` : config.botActivity,
                        type: player?.current ? ActivityType.Listening : config.botActivityType,
                    },
                ],
                status: config.botStatus as any,
            });
        }
    }

    public static chunk(array: any[], size: number): any[] {
        const chunked_arr = [];
        for (let index = 0; index < array.length; index += size) {
            chunked_arr.push(array.slice(index, size + index));
        }
        return chunked_arr;
    }

    public static formatBytes(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
    }

    public static formatNumber(number: number): string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    public static parseTime(string: string): number {
        const time = string.match(/([0-9]+[d,h,m,s])/g);
        if (!time) return 0;
        let ms = 0;
        for (const t of time) {
            const unit = t[t.length - 1];
            const amount = Number(t.slice(0, -1));
            if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
            else if (unit === "h") ms += amount * 60 * 60 * 1000;
            else if (unit === "m") ms += amount * 60 * 1000;
            else if (unit === "s") ms += amount * 1000;
        }
        return ms;
    }

    public static progressBar(current: number, total: number, size: number = 20): string {
        const percent = Math.round((current / total) * 100);
        const filledSize = Math.round((size * current) / total);
        const filledBar = "▓".repeat(filledSize);
        const emptyBar = "░".repeat(size - filledSize);
        return `${filledBar}${emptyBar} ${percent}%`;
    }

    public static async paginate(ctx: Context, embed: any[]): Promise<void> {
        if (embed.length < 2) {
            if (ctx.isInteraction) {
                ctx.deferred ? ctx.interaction.followUp({ embeds: embed }) : ctx.interaction.reply({ embeds: embed });
                return;
            }
            (ctx.channel as TextChannel).send({ embeds: embed });
            return;
        }
        let page = 0;
        const getButton = (page: number): any => {
            const firstEmbed = page === 0;
            const lastEmbed = page === embed.length - 1;
            const pageEmbed = embed[page];
            const first = new ButtonBuilder().setCustomId("fast").setEmoji("⏪").setStyle(ButtonStyle.Primary);
            if (firstEmbed) first.setDisabled(true);
            const back = new ButtonBuilder().setCustomId("back").setEmoji("◀️").setStyle(ButtonStyle.Primary);
            if (firstEmbed) back.setDisabled(true);
            const next = new ButtonBuilder().setCustomId("next").setEmoji("▶️").setStyle(ButtonStyle.Primary);
            if (lastEmbed) next.setDisabled(true);
            const last = new ButtonBuilder().setCustomId("last").setEmoji("⏩").setStyle(ButtonStyle.Primary);
            if (lastEmbed) last.setDisabled(true);
            const stop = new ButtonBuilder().setCustomId("stop").setEmoji("⏹️").setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(first, back, stop, next, last);
            return { embeds: [pageEmbed], components: [row] };
        };
        const msgOptions = getButton(0);
        let msg: any;
        if (ctx.isInteraction) {
            msg = ctx.deferred
                ? await ctx.interaction.followUp({
                    ...msgOptions,
                    fetchReply: true as boolean,
                })
                : await ctx.interaction.reply({
                    ...msgOptions,
                    fetchReply: true,
                });
        } else {
            msg = await (ctx.channel as TextChannel).send({
                ...msgOptions,
                fetchReply: true,
            });
        }
        let author: any;
        if (ctx instanceof CommandInteraction) {
            author = ctx.user;
        } else {
            author = ctx.author;
        }
        const filter = (int: any): any => int.user.id === author.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
        });
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
        collector.on("collect", async (interaction) => {
            if (interaction.user.id === author.id) {
                await interaction.deferUpdate();
                if (interaction.customId === "fast") {
                    if (page !== 0) {
                        page = 0;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === "back") {
                    if (page !== 0) {
                        page--;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === "stop") {
                    collector.stop();
                    await interaction.editReply({
                        embeds: [embed[page]],
                        components: [],
                    });
                }
                if (interaction.customId === "next") {
                    if (page !== embed.length - 1) {
                        page++;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === "last") {
                    if (page !== embed.length - 1) {
                        page = embed.length - 1;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
            } else {
                await interaction.reply({
                    content: "You can\"t use this button",
                    ephemeral: true,
                });
            }
        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [embed[page]], components: [] });
        });
    }
}

/**
 * Project: heemusic
 * Author: oniichanx
 * Company: ArchGG
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of ArchGG and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/heelee
 */
