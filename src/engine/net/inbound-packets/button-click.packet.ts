import type { PacketData } from '@engine/net/inbound-packet-handler';
import type { Player } from '@engine/world/actor/player/player';

const buttonClickPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const widgetId = buffer.get('short');
    const buttonId = buffer.get('short');

    player.actionPipeline.call('button', player, widgetId, buttonId);
};

export default {
    opcode: 64,
    size: 4,
    handler: buttonClickPacket
};
