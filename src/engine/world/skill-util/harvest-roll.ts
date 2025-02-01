// Note if adding hunter, Strung rabbit foot makes this out of 94 instead of 99
import { findItem } from '@engine/config/config-handler';
import { randomBetween } from '@engine/util/num';
import type { Item } from '@engine/world/items/item';

export function rollBirdsNestType(): Item {
    const roll = randomBetween(0, 99);
    let itemConfigId;

    if (roll > 3) {
        // Bird egg
        if (roll === 0) {
            itemConfigId = 'rs:birds_egg_red';
        } else if (roll === 1) {
            itemConfigId = 'rs:birds_egg_green';
        } else {
            itemConfigId = 'rs:birds_egg_blue';
        }
    } else if (roll > 34) {
        itemConfigId = 'rs:birds_nest_ring';
    } else {
        itemConfigId = 'rs:birds_nest_seed';
    }

    const item = findItem(itemConfigId);
    if (!item) {
        throw new Error(`Could not find item config for ${itemConfigId}`);
    }

    return { itemId: item.gameId, amount: 1 };
}


export function rollGemType(): Item {
    const roll = randomBetween(0, 3);
    let itemConfigId;

    if (roll === 0) {
        itemConfigId = 'rs:uncut_diamond';
    } else if (roll === 1) {
        itemConfigId = 'rs:uncut_ruby';
    } else if (roll === 2) {
        itemConfigId = 'rs:uncut_emerald';
    } else {
        itemConfigId = 'rs:uncut_sapphire';
    }

    const item = findItem(itemConfigId);
    if (!item) {
        throw new Error(`Could not find item config for ${itemConfigId}`);
    }

    return { itemId: item.gameId, amount: 1 };
}
