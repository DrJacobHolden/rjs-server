import type { PacketData } from '@engine/net/inbound-packet-handler';
import type { Player } from '@engine/world/actor/player/player';

export default {
    opcode: 238,
    size: 4,
    handler: (player: Player, packet: PacketData) => player.numericInputEvent.next(packet.buffer.get('int', 'u')),
};
