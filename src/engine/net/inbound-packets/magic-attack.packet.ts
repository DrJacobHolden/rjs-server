import type { PacketData } from '@engine/net/inbound-packet-handler';
import { activeWorld } from '@engine/world';
import type { Player } from '@engine/world/actor/player/player';

const magicAttackPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const npcWorldIndex = buffer.get('short', 'u'); // unsigned short BE
    const widgetId = buffer.get('short', 'u', 'le'); // unsigned short LE
    const widgetChildId = buffer.get('byte'); // unsigned short LE

    const npc = activeWorld.npcList[npcWorldIndex];

    player.actionPipeline.call('magic_on_npc', npc, player, widgetId, widgetChildId);
};

export default [
    {
        opcode: 253,
        size: 6,
        handler: magicAttackPacket,
    },
];
