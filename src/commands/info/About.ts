import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { Command, Context, heemusic } from '../../structures/index.js';

export default class About extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'about',
            description: {
                content: 'เปิดข้อมูลความลับที่ทำให้หำฉันใหญ่',
                examples: ['about'],
                usage: 'about',
            },
            category: 'info',
            aliases: ['ab'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
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
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite DooHeeMusic')
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=1171042527932067900&permissions=8&scope=bot%20applications.commands`
                ),
            new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://media.discordapp.net/attachments/858027691021959168/982975962859851846/-7114398070693093601.mp4')
        );

        const embed = this.client
            .embed()
            .setAuthor({
                name: 'DooHeeMusic',
                iconURL:
                    'https://cdn.discordapp.com/attachments/721455382177906828/1171111436722913340/IMG_5984.jpg',
            })
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/721455382177906828/1171111436722913340/IMG_5984.jpg'
            )
            .setColor(this.client.color.main)
            .addFields([
                {
                    name: 'Creator',
                    value: '[oniichanx#2291](https://github.com/oniichanx)',
                    inline: true,
                },
                {
                    name: 'Repository',
                    value: '[Here](https://github.com/oniichanx/heemusic)',
                    inline: true,
                },
                {
                    name: 'Support',
                    value: '[Here](https://discord.gg/heelee)',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: `ฉันต้องการสร้างโปรเจ็กต์โอเพ่นซอร์สครั้งแรกเพื่อประสบการณ์การเขียนโค้ดที่มากขึ้น ในโปรเจ็กต์นี้ ฉันถูกท้าทายให้สร้างโปรเจ็กต์ที่มีข้อบกพร่องน้อยลง หวังว่าคุณจะสนุกกับการใช้ DooHeeMusic!`,
                    inline: true,
                },
            ]);
        return await ctx.sendMessage({
            content: '',
            embeds: [embed],
            components: [row],
        });
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
