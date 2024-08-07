import { Event, type heemusic } from "../../structures/index.js";
import BotLog from "../../utils/BotLog.js";
let destroyCount = 0;

export default class NodeDestroy extends Event {
    constructor(client: heemusic, file: string) {
        super(client, file, {
            name: "nodeDestroy",
        });
    }

    // biome-ignore lint/suspicious/useAwait: <explanation>
    public async run(node: string, code: number, reason: string): Promise<void> {
        const message = `Node ${node} destroyed with code ${code} and reason ${reason}.`;
        this.client.logger.error(message);
        BotLog.send(this.client, message, "error");

        destroyCount++;

        if (destroyCount >= 5) {
            this.client.shoukaku.removeNode(node);
            destroyCount = 0;
            const warnMessage = `Node ${node} removed from nodes list due to excessive disconnects.`;
            this.client.logger.warn(warnMessage);
            BotLog.send(this.client, warnMessage, "warn");
        }
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
