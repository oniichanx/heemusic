import { Command, Context, heemusic } from '../../structures/index.js';

export default class Help extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: 'help',
            description: {
                content: 'Shows the help menu',
                examples: ['help'],
                usage: 'help',
            },
            category: 'info',
            aliases: ['h'],
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
            options: [
                {
                    name: 'command',
                    description: 'ตามด้วยคำสั่งทวงท่าของฉันที่นายอยากจะดูได้เลย',
                    type: 3,
                    required: false,
                },
            ],
        });
    }
    public async run(client: heemusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed();
        const prefix = client.db.getPrefix(ctx.guild.id);
        const commands = this.client.commands.filter(cmd => cmd.category !== 'dev');
        const categories = commands
            .map(cmd => cmd.category)
            .filter((value, index, self) => self.indexOf(value) === index);

        if (!args[0]) {
            const fildes = [];
            categories.forEach(category => {
                fildes.push({
                    name: category,
                    value: commands
                        .filter(cmd => cmd.category === category)
                        .map(cmd => `\`${cmd.name}\``)
                        .join(', '),
                    inline: false,
                });
            });
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle('คำสั่งดูดหี')
                .setDescription(
                    `เฮ้ ไอหนู! ฉันนาย ${this.client.user.username}, ฉันคือบอทที่สร้างมาเพื่อดูดหีดูดควยน่ะ สร้างโดย [DooHeeMusic](https://github.com/oniichanx) และ Discord. นายสามารถใช้ \`${prefix}help <command>\` เพื่อดูคำสั่งทวงท่าของฉันได้นะ.`
                )
                .setFooter({
                    text: `ใช้ ${prefix.prefix}help <command> ใช้สำหรับดูทวงท่าที่ฉันสามารถทำได้น่ะ`,
                });
            fildes.forEach(field => helpEmbed.addFields(field));
            ctx.sendMessage({ embeds: [helpEmbed] });
        } else {
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command)
                return await ctx.sendMessage({
                    embeds: [
                        client
                            .embed()
                            .setColor(client.color.red)
                            .setDescription(`Command \`${args[0]}\` ฉันไม่เจอท่านี้น่ะ`),
                    ],
                });
            const embed = this.client.embed();
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle(`Help Menu - ${command.name}`).setDescription(`**วัยรุ่นใต้คอมเม้น:** ${
                command.description.content
            }
**Usage:** ${prefix.prefix}${command.description.usage}
**Examples:** ${command.description.examples.map(example => `${prefix.prefix}${example}`).join(', ')}
**Aliases:** ${command.aliases.map(alias => `\`${alias}\``).join(', ')}
**Category:** ${command.category}
**Cooldown:** ${command.cooldown} seconds
**Permissions:** ${
                command.permissions.user.length > 0
                    ? command.permissions.user.map(perm => `\`${perm}\``).join(', ')
                    : 'None'
            }
**Bot Permissions:** ${command.permissions.client.map(perm => `\`${perm}\``).join(', ')}
**Developer Only:** ${command.permissions.dev ? 'Yes' : 'No'}
**Slash Command:** ${command.slashCommand ? 'Yes' : 'No'}
**Args:** ${command.args ? 'Yes' : 'No'}
**Player:** ${command.player.active ? 'Yes' : 'No'}
**DJ:** ${command.player.dj ? 'Yes' : 'No'}
**DJ Permissions:** ${command.player.djPerm ? command.player.djPerm : 'None'}
**Voice:** ${command.player.voice ? 'Yes' : 'No'}`);
            ctx.sendMessage({ embeds: [helpEmbed] });
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
