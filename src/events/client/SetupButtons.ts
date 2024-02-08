import { Event, heemusic } from '../../structures/index.js';
import { buttonReply } from '../../utils/SetupSystem.js';
import { checkDj } from '../player/TrackStart.js';

export default class SetupButtons extends Event {
    constructor(client: heemusic, file: string) {
        super(client, file, {
            name: 'setupButtons',
        });
    }
    public async run(interaction: any): Promise<void> {
        if (!interaction.replied) await interaction.deferReply().catch(() => {});

        if (!interaction.member.voice.channel)
            return await buttonReply(
                interaction,
                `กราบเรียนคุณมึงเชิญเข้าห้องมาก่อนจะใช้ปุ่มน่ะอีสัส.`,
                this.client.color.red
            );
        if (
            interaction.guild.members.cache.get(this.client.user.id).voice.channel &&
            interaction.guild.members.cache.get(this.client.user.id).voice.channelId !==
                interaction.member.voice.channelId
        )
            return await buttonReply(
                interaction,
                `You are not connected to ${interaction.guild.me.voice.channel} to use this buttons.`,
                this.client.color.red
            );
        const player = this.client.queue.get(interaction.guildId);
        if (!player)
            return await buttonReply(
                interaction,
                `คือมันไม่มีเพลงค้าาอีสัสนรกนี่จะสั่งกูทำไมนักหนา?`,
                this.client.color.red
            );
        if (!player.queue)
            return await buttonReply(
                interaction,
                `คือมันไม่มีเพลงค้าาอีสัสนรกนี่จะสั่งกูทำไมนักหนา?`,
                this.client.color.red
            );
        if (!player.current)
            return await buttonReply(
                interaction,
                `คือมันไม่มีเพลงค้าาอีสัสนรกนี่จะสั่งกูทำไมนักหนา?`,
                this.client.color.red
            );
        const data = this.client.db.getSetup(interaction.guildId);
        const { title, uri, length } = player.current.info;
        let message;
        try {
            message = await interaction.channel.messages.fetch(data.messageId, { cache: true });
        } catch (e) {
            /* empty */
        }
        const icon = player
            ? player.current.info.artworkUrl
            : this.client.user.displayAvatarURL({ extension: 'png' });
        let iconUrl = this.client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = this.client.user.displayAvatarURL({ extension: 'png' });

        const embed = this.client
            .embed()
            .setAuthor({ name: `เขากำลังดูดไข่ผมม..`, iconURL: iconUrl })
            .setDescription(
                `[${title}](${uri}) - ${
                    player.current.info.isStream ? 'LIVE' : this.client.utils.formatTime(length)
                } - ชายผู้สั่งให้ผมเริ่มดูดไข่ โดยนาย ${player.current.info.requester}`
            )
            .setImage(icon);
        if (!interaction.isButton()) return;
        if (!(await checkDj(this.client, interaction))) {
            await buttonReply(
                interaction, 
                `You need to have the Dj role to use this command`, 
                this.client.color.red
                );
            return;
        }
        if (message) {
            switch (interaction.customId) {
                case 'LOW_VOL_BUT': {
                    const vol = player.player.volume - 10;
                    player.player.setGlobalVolume(vol);
                    await buttonReply(interaction,`ลดแรงดันควยเป็น ${vol}%`,this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Volume: ${vol}%`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'HIGH_VOL_BUT': {
                    const vol2 = player.player.volume + 10;
                    player.player.setGlobalVolume(vol2);
                    await buttonReply(
                        interaction,
                        `เพิ่มแรงดันควยเป็น ${vol2}%`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Volume: ${vol2}%`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'PAUSE_BUT': {
                    const name = player.player.paused ? `Resumed` : `Paused`;
                    player.pause();
                    await buttonReply(interaction, `${name} the music.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `${name} by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'SKIP_BUT':
                    if (player.queue.length === 0)
                        return await buttonReply(
                            interaction,
                            `ไม่มีหีในคิวให้ข้ามไปเย็ด.`,
                            this.client.color.main
                        );
                    player.skip();
                    await buttonReply(interaction, `ข้ามหาแม่มึงแงะ.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Skipped by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'STOP_BUT':
                    player.stop();
                    await buttonReply(interaction, `หยุดเด้าหาเหิ้ยไรกำลังมันส์.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Stopped by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'LOOP_BUT': {
                    const random = ['off', 'queue', 'repeat'];
                    const loop = random[Math.floor(Math.random() * random.length)];
                    if (player.loop === loop)
                        return await buttonReply(
                            interaction,
                            `Loop is already ${player.loop}.`,
                            this.client.color.main
                        );
                    player.setLoop(loop);
                    await buttonReply(
                        interaction,
                        `Loop set to ${player.loop}.`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Loop set to ${player.loop} by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'SHUFFLE_BUT':
                    player.setShuffle(player.shuffle ? false : true);
                    await buttonReply(
                        interaction,
                        `Shuffle set to ${player.shuffle ? `on` : `off`}.`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Shuffle set to ${player.shuffle ? `on` : `off`} by ${
                                    interaction.member.displayName
                                }`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'PREV_BUT':
                    if (!player.previous)
                        return await buttonReply(
                            interaction,
                            `ไม่ได้เย็ดผู้หญิงก่อนหน้านี้.`,
                            this.client.color.main
                        );
                    player.previousTrack();
                    await buttonReply(
                        interaction,
                        `กำลังกลับไปซ้ำหีเดิมก่อนหน้า.`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `กำลังกลับไปซ้ำหีเดิมก่อนหน้า โดยนาย ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'REWIND_BUT': {
                    const time = player.player.position - 10000;
                    if (time < 0)
                        return await buttonReply(
                            interaction,
                            `ถอกควยจนสุดล่ะไอเหิ้ยจะเอาสุดไปถึงไหน.`,
                            this.client.color.main
                        );
                    player.seek(time);
                    await buttonReply(interaction, `กำลังถอกหัวควยลง.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Rewinded by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'FORWARD_BUT': {
                    const time2 = player.player.position + 10000;
                    if (time2 > player.current.info.length)
                        return await buttonReply(
                            interaction,
                            `เนื้อควยปิดอยู่แล้วไอสัสจะเอาปิดไปถึงไหน.`,
                            this.client.color.main
                        );
                    player.seek(time2);
                    await buttonReply(interaction, `กำลังดึงหนังควยขึ้นเล็กน้อย.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Forwarded by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                default:
                    await buttonReply(
                        interaction,
                        `This button is not available.`,
                        this.client.color.main
                    );
                    break;
            }
        }
    }
}
