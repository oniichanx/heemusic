import { Event, type heemusic } from "../../structures/index.js";
import BotLog from "../../utils/BotLog.js";

export default class NodeDisconnect extends Event {
    constructor(client: heemusic, file: string) {
        super(client, file, {
            name: "nodeDisconnect",
        });
    }

    // biome-ignore lint/suspicious/useAwait: <explanation>
    public async run(node: string, count: number): Promise<void> {
        const message = `Node ${node} disconnected ${count} times`;
        this.client.logger.warn(message);
        BotLog.send(this.client, message, "warn");
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
