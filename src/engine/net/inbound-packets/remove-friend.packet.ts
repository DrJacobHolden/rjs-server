import type { PacketData } from '@engine/net/inbound-packet-handler';
import { longToString } from '@engine/util/strings';
import type { Player } from '@engine/world/actor/player/player';
import { PrivateMessaging } from '@engine/world/actor/player/private-messaging';

export default {
    opcode: 255,
    size: 8,
    handler: (player: Player, packet: PacketData) => {
        const friendName = longToString(BigInt(packet.buffer.get('long')));
        if(!friendName) {
            return;
        }

        player.removeFriend(friendName);
        PrivateMessaging.friendRemoved(player, friendName);
    }
};
