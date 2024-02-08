/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Connectors, Shoukaku } from 'shoukaku';

import { heemusic } from './index.js';

export default class ShoukakuClient extends Shoukaku {
    public client: heemusic;
    constructor(client: heemusic) {
        super(new Connectors.DiscordJS(client), client.config.lavalink, {
            moveOnDisconnect: false,
            resume: false,
            reconnectInterval: 30,
            reconnectTries: 2,
            restTimeout: 10000,
            userAgent: `heemusic (@devblacky)`, // don't change this
            nodeResolver: (nodes) => 
                [...nodes.values()]
                    .filter(node => node.state === 2)
                    .sort((a, b) => a.penalties - b.penalties)
                    .shift()
        });
        this.client = client;
        this.on('ready', (name, reconnected) => {
            this.client.shoukaku.emit(reconnected ? 'nodeReconnect' : 'nodeConnect',name,)
        });

        this.on('error', (name, error) => this.client.shoukaku.emit('nodeError', name, error));

        this.on('close', (name, code, reason) =>
            this.client.shoukaku.emit('nodeDestroy', name, code, reason)
        );
        this.on('disconnect', (name, count) => {
            this.client.shoukaku.emit('nodeDisconnect', name, count);
        });

        this.on('debug', (name, reason) => this.client.shoukaku.emit('nodeRaw', name, reason));
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
