import { logger } from '@runejs/common';
import { activeWorld } from '@engine/world';
import type { PacketData } from '@engine/net/inbound-packet-handler';
import type { Player } from '@engine/world/actor/player/player';
import { widgets } from '@engine/config/config-handler';
import { World } from '@engine/world/world';

const itemOnPlayerPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const playerIndex = buffer.get('short', 'u', 'le') - 1;
    const itemWidgetId = buffer.get('short', 's', 'le');
    const itemContainerId = buffer.get('short');
    const itemId = buffer.get('short', 'u');
    const itemSlot = buffer.get('short', 'u');


    let usedItem;
    if(itemWidgetId === widgets.inventory.widgetId && itemContainerId === widgets.inventory.containerId) {
        if(itemSlot < 0 || itemSlot > 27) {
            return;
        }

        usedItem = player.inventory.items[itemSlot];
        if(!usedItem) {
            return;
        }

        if(usedItem.itemId !== itemId) {
            return;
        }
    } else {
        logger.warn(`Unhandled item on object case using widget ${ itemWidgetId }:${ itemContainerId }`);
    }


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


    player.actionPipeline.call('item_on_player', player, otherPlayer, position, usedItem, itemWidgetId, itemContainerId)
};

export default {
    opcode: 110,
    size: 10,
    handler: itemOnPlayerPacket
};
