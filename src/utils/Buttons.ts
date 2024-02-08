import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function getButtons(): ActionRowBuilder<ButtonBuilder>[] {
    const pauseEmojiId = '<:ac_boom_pause:1200503399158915173>'; // Replace with your custom emoji ID
    const previousEmojiId = '<:aa_boom_rewind:1200503448777527506>';
    const skipEmojiId = '<:ae_boom_play_pause:1200503431111135415>';
    const highvolumeEmojiId = '<:ai_boom_vol_3:1200503361473089626>';
    const lowvolumeEmojiId = '<:ah_boom_vol_2:1200503331261513728>';
    const forwardEmojiId = '<:ae_boom_play_pause:1200503431111135415>';
    const stopEmojiId = '<:ad_boom_stop:1200503415101468763>';
    const loopEmojiId = '<:looper:1200503382062931998>';
    const rewindEmojiId = '<:aa_boom_rewind:1200503448777527506>';
    const shuffleEmojiId = '<:shuffle:1200470070955081929>';

    let pausebut = new ButtonBuilder()
        .setCustomId(`PAUSE_BUT`)
        .setEmoji(pauseEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let previousbut = new ButtonBuilder()
        .setCustomId(`PREV_BUT`)
        .setEmoji(previousEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let skipbut = new ButtonBuilder()
        .setCustomId(`SKIP_BUT`)
        .setEmoji(skipEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let highvolumebut = new ButtonBuilder()
        .setCustomId(`HIGH_VOL_BUT`)
        .setEmoji(highvolumeEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let lowvolumebut = new ButtonBuilder()
        .setCustomId(`LOW_VOL_BUT`)
        .setEmoji(lowvolumeEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let forwardbut = new ButtonBuilder()
        .setCustomId(`FORWARD_BUT`)
        .setEmoji(forwardEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let stopbut = new ButtonBuilder()
        .setCustomId(`STOP_BUT`)
        .setEmoji(stopEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let loopbut = new ButtonBuilder()
        .setCustomId(`LOOP_BUT`)
        .setEmoji(loopEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let shufflebut = new ButtonBuilder()
        .setCustomId(`SHUFFLE_BUT`)
        .setEmoji(shuffleEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let rewindbut = new ButtonBuilder()
        .setCustomId(`REWIND_BUT`)
        .setEmoji(rewindEmojiId)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        lowvolumebut,
        previousbut,
        pausebut,
        skipbut,
        highvolumebut
    );
    let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        rewindbut,
        loopbut,
        stopbut,
        shufflebut,
        forwardbut
    );
    return [row, row2];
}

export { getButtons };
