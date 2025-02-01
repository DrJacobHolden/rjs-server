import type { Player } from '@engine/world/actor/player/player';
import type { IHarvestable } from '@engine/world/config/harvestable-object';
import { soundIds } from '@engine/world/config/sound-ids';
import { Skill } from '@engine/world/actor/skills';
import type { HarvestTool } from '@engine/world/config/harvest-tool';
import { getBestAxe } from '@engine/world/config/harvest-tool';
import { findItem } from '@engine/config/config-handler';
import { logger } from '@runejs/common';

/**
 * Check if a player can harvest a given {@link IHarvestable}
 *
 * @returns a {@link HarvestTool} if the player can harvest the object, or undefined if they cannot.
 */
export function canInitiateHarvest(player: Player, target: IHarvestable, skill: Skill): undefined | HarvestTool {
    const itemConfigId = typeof target.items === 'string' ? target.items : target.items[0].itemConfigId;
    const item = findItem(itemConfigId);

    if (!item) {
        logger.error(`Could not find item with config id ${itemConfigId} for harvestable object.`);
        player.sendMessage('Sorry, there was an error. Please contact a developer.');
        return;
    }

    let targetName = item.name.toLowerCase();

    switch (skill) {
        case Skill.MINING:
            targetName = targetName.replace(' ore', '');
            break;
    }

    // Rest of the function remains the same...
    if (!player.skills.hasLevel(skill, target.level)) {
        switch (skill) {
            case Skill.WOODCUTTING:
                player.sendMessage(`You need a Woodcutting level of ${target.level} to chop down this tree.`, true);
                break;
        }
        return;
    }

    let tool;
    switch (skill) {
        case Skill.WOODCUTTING:
            tool = getBestAxe(player);
            break;
    }

    if (tool == null) {
        switch (skill) {
            case Skill.WOODCUTTING:
                player.sendMessage('You do not have an axe for which you have the level to use.');
                break;
        }
        return;
    }

    if (!player.inventory.hasSpace()) {
        player.sendMessage(`Your inventory is too full to hold any more ${targetName}.`, true);
        player.playSound(soundIds.inventoryFull);
        return;
    }

    return tool;
}
