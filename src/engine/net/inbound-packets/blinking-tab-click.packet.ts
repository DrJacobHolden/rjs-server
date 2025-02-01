import type { PacketData } from '@engine/net/inbound-packet-handler';
import type { Player } from '@engine/world/actor/player/player';

const blinkingTabClickPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const tabIndex = buffer.get('byte');

    const tabClickEventIndex = player.metadata?.tabClickEvent?.tabIndex || -1;

    if (tabClickEventIndex === tabIndex) {
        if (player.metadata.tabClickEvent) {
            player.metadata.tabClickEvent.event.next(true);
        }
    }
};

export default {
    opcode: 44,
    size: 1,
    handler: blinkingTabClickPacket,
};
