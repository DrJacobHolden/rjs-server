import { logger } from '@runejs/common';
import type { PacketData } from '@engine/net/inbound-packet-handler';
import { playerOptions, type Player } from '@engine/world/actor/player/player';
import { activeWorld } from '@engine/world';
import { World } from '@engine/world/world';

const playerInteractionPacket = (player: Player, packet: PacketData) => {
    const { buffer, packetId } = packet;

    const packetReaders: Record<number, () => number> = {
        68: () => buffer.get('short', 'u', 'le'),
        211: () => buffer.get('short', 'u', 'le'),
    };

    const playerIndex = packetReaders[packetId]() - 1;

    if(playerIndex < 0 || playerIndex > World.MAX_PLAYERS - 1) {
        return;
    }

    const otherPlayer = activeWorld.playerList[playerIndex];
    if(!otherPlayer) {
        return;
    }

    const position = otherPlayer.position;
    const distance = Math.floor(position.distanceBetween(player.position));

    // Too far away
    if(distance > 16) {
        return;
    }

    const actions = {
        68: 0,
        211: 1
    };

    const playerOption = playerOptions.find(playerOption => playerOption.index === actions[packetId]);

    if(!playerOption) {
        logger.error(`Invalid player option ${actions[packetId]}!`);
        return;
    }

    player.actionPipeline.call('player_interaction', player, otherPlayer, position, playerOption.option.toLowerCase());
};

export default [{
    opcode: 68,
    size: 2,
    handler: playerInteractionPacket
}, {
    opcode: 211,
    size: 2,
    handler: playerInteractionPacket
}];
