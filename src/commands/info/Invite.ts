import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { Command, Context, heemusic } from '../../structures/index.js';

export default class Invite extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'invite',
            description: {
                content: 'Sends the bot\'s invite link',
                examples: ['invite'],
                usage: 'invite',
            },
            category: 'info',
            aliases: ['inv'],
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
        const clientId = process.env.CLIENT_ID;
        if (!clientId) {
            console.error(
                'Client ID ไม่เจอใน environment variables, ทำให้ไม่สามารถทำลิ้งค์เชิญได้.'
            );
            return await ctx.sendMessage(
                'ขออภัย ควยของฉันไม่พร้อมใช้งานในขณะนี้ โปรดบอกผู้พัฒนาบอทให้ตรวจสอบคอนโซลของมันด้วย! ก็กูนี้ว้า.'
            );
        }

        const embed = this.client.embed();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`
                ),
            new ButtonBuilder()
                .setLabel('My Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/heelee')
        );

        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(
                        `นายสามารถชวนฉันไปห้องเธอได้โดยคลิกที่ปุ่มด้านล่าง! ถ้าท้องขึ้นมาไม่ใช่ลูกกูน่ะแม่เย็ด!`
                    ),
            ],
            components: [row],
        });
    }
}
