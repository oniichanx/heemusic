import {
    ApplicationCommandOptionType,
    ChannelType,
    OverwriteType,
    PermissionFlagsBits,
} from 'discord.js';

import { Command, Context, heemusic } from '../../structures/index.js';
import { getButtons } from '../../utils/Buttons.js';

export default class Setup extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'setup',
            description: {
                content: 'Sets up the bot',
                examples: ['setup create', 'setup delete', 'setup info'],
                usage: 'setup',
            },
            category: 'config',
            aliases: ['setup'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'ManageChannels'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'create',
                    description: 'สร้างช่องทางขอดูดหี',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'delete',
                    description: 'ลบช่องทางขอดูดหี',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'info',
                    description: 'เปิดช่องทางขอต่อคิวเข้าเย็ดในห้อง',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
        });
    }
    public async run(client: heemusic, ctx: Context, args: string[]): Promise<any> {
        let subCommand: string;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
        } else {
            subCommand = args[0];
        }
        const embed = client.embed().setColor(client.color.main);
        switch (subCommand) {
            case 'create': {
                const data = client.db.getSetup(ctx.guild.id);
                
                if (data && data.textId && data.msgId)
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: 'มีช่องขอดูดหีอยู่แล้ว',
                                color: client.color.red,
                            },
                        ],
                    });
                const textChannel = await ctx.guild.channels.create({
                    name: `${this.client.user.username}-Hee-List`,
                    type: ChannelType.GuildText,
                    topic: 'ช่องทางขอต่อคิวเข้าเย็ดในห้อง',
                    permissionOverwrites: [
                        {
                            type: OverwriteType.Member,
                            id: this.client.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.EmbedLinks,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                        {
                            type: OverwriteType.Role,
                            id: ctx.guild.roles.everyone.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                });
                const player = this.client.queue.get(ctx.guild.id);
                const image = this.client.config.links.img;
                const desc =
                    player && player.queue && player.current
                        ? `[${player.current.info.title}](${player.current.info.uri})`
                        : 'ไม่มีหีในสต็อกให้เย็ดอยู่. >>> [Invite](https://youtu.be/QAna8T9wvxw) | [Support](https://youtu.be/kEEECmshTjA) | [Website](https://twitter.com/parksunhaaa/status/1555420631315128320?s=12&t=PCnuQMcjF0NR1LB5_rX0iQ)';

                embed.setDescription(desc).setImage(image);
                await textChannel
                    .send({
                        embeds: [embed],
                        components: getButtons(),
                    })
                    .then(async msg => {
                        client.db.setSetup(ctx.guild.id, textChannel.id, msg.id);
                    });
                const embed2 = client.embed().setColor(client.color.main);
                await ctx.sendMessage({
                    embeds: [
                        embed2.setDescription(
                            `ช่องทางขอต่อคิวเข้าเย็ดในห้อง ได้ถูกสร้างเข้ามาอยู่แล้ว <#${textChannel.id}>`
                        ),
                    ],
                });
                break;
            }
            case 'delete': {
                const data2 = client.db.getSetup(ctx.guild.id);
                if (!data2)
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: 'The song request channel doesn\'t exist',
                                color: client.color.red,
                            },
                        ],
                    });
                client.db.deleteSetup(ctx.guild.id);
                await ctx.guild.channels.cache
                    .get(data2.textId)
                    .delete()
                    .catch(() => {
                        null
                    });
                await ctx.sendMessage({
                    embeds: [
                        {
                            description: 'ช่องทางขอต่อคิวเข้าเย็ดในห้อง ได้ถูกลบล้างแล้ว',
                            color: client.color.main,
                        },
                    ],
                });
                break;
            }

            case 'info': {
                const data3 = client.db.getSetup(ctx.guild.id);
                if (!data3)
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: 'The song request channel doesn\'t exist',
                                color: client.color.red,
                            },
                        ],
                    });
                const channel = ctx.guild.channels.cache.get(data3.textId);
                embed
                    .setDescription(`ช่องทางขอต่อคิวเข้าเย็ดในห้อง คือ <#${channel.id}>`)
                    .setColor(client.color.main);
                await ctx.sendMessage({
                    embeds: [embed],
                });
                break;
            }
            default:
                break;
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
