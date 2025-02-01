import { findItem } from '@engine/config/config-handler';
import { equipmentIndices } from '@engine/config/item-config';
import type { Player } from '@engine/world/actor/player/player';

export function checkForGemBoost(player: Player): number {
    // Check if any charged glory is equipped
    const neckSlotIndex = equipmentIndices['neck'];
    const neckItem = player.equipment.items[neckSlotIndex];

    if (!neckItem) {
        return 256;
    }

    const itemConfig = findItem(neckItem.itemId);
    if (!itemConfig || !itemConfig.key.startsWith('rs:amulet_of_glory:charged_')) {
        return 256;
    }

    return 86;
}
