import type { PacketData } from '@engine/net/inbound-packet-handler';
import { longToString } from '@engine/util/strings';
import { activeWorld } from '@engine/world';
import type { Player } from '@engine/world/actor/player/player';

export default {
    opcode: 207,
    size: -3,
    handler: (player: Player, packet: PacketData) => {
        const { buffer } = packet;

        buffer.get('byte'); // junk
        const nameLong = BigInt(buffer.get('long'));
        const username = longToString(nameLong).toLowerCase();
        const messageLength = buffer.length - 9;
        const messageBytes = new Array(messageLength);
        for (let i = 0; i < messageLength; i++) {
            messageBytes[i] = buffer[buffer.readerIndex + i];
        }

        const otherPlayer = activeWorld.findActivePlayerByUsername(username);
        if (otherPlayer) {
            otherPlayer.privateMessageReceived(player, messageBytes);
        }
    },
};
