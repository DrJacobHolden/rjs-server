import type { PacketData } from '@engine/net/inbound-packet-handler';
import { longToString } from '@engine/util/strings';
import type { Player } from '@engine/world/actor/player/player';


export default {
    opcode: 114,
    size: 8,
    handler: (player: Player, packet: PacketData) =>
        player.addFriend(longToString(BigInt(packet.buffer.get('LONG'))))
};
