import { Player } from 'shoukaku';

import { Song } from '../../structures/Dispatcher.js';
import { Dispatcher, Event, heemusic } from '../../structures/index.js';

export default class TrackEnd extends Event {
    constructor(client: heemusic, file: string) {
        super(client, file, {
            name: 'trackEnd',
        });
    }
    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        const m = await dispatcher.nowPlayingMessage?.fetch().catch(() => {});
        if (dispatcher.loop === 'repeat') dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue') dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) {
            await dispatcher.Autoplay(track);
        }
        if (m && m.deletable) await m.delete().catch(() => {});
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
