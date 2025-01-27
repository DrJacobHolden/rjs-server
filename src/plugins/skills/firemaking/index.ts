import { itemOnItemActionHandler, ItemOnItemActionHook, ItemOnWorldItemActionHook } from '@engine/action';
import { itemIds } from '@engine/world/config';
import { FIREMAKING_LOGS } from './data';
import { canLightFireAtCurrentPosition, lightFire } from './light-fire';
import { runFiremakingTask } from './firemaking-task';

/**
 * Action hook for lighting a log with a tinderbox in the player's inventory.
 */
const tinderboxOnLogHandler: itemOnItemActionHandler = (details) => {
    const { player, usedItem, usedWithItem, usedSlot, usedWithSlot } = details;

    // Prevent multiple fires being lit too quickly in succession.
    if (
        player.metadata.lastFire &&
        Date.now() - player.metadata.lastFire < 600
    ) {
        return;
    }

    // Handles either the tinderbox used on the log or visa-versa.
    const log = usedItem.itemId !== itemIds.tinderbox ? usedItem : usedWithItem;
    const removeFromSlot =
        usedItem.itemId !== itemIds.tinderbox ? usedSlot : usedWithSlot;

    const skillInfo = FIREMAKING_LOGS.find(
        (l) => l.logItem?.gameId === log.itemId,
    );
    if (!skillInfo) {
        player.sendMessage(
            `Unable to find info for log with ID: ${log.itemId}.`,
        );
        return;
    }

    if (player.skills.firemaking.level < skillInfo.requiredLevel) {
        player.sendMessage(`You need a Firemaking level of ${skillInfo.requiredLevel} to light this log.`);
        return;
    }

    if (!canLightFireAtCurrentPosition(player)) {
        player.sendMessage('You cannot light a fire here.');
        return;
    }

    player.removeItem(removeFromSlot);
    const worldItemLog = player.instance.spawnWorldItem(log, player.position, { owner: player, expires: 300 });

    // Enables for immediately lighting a new fire immediately after a player
    // finishes lighting the previous one. Ignores success chance because I'm
    // lazy and it's a game.
    if (
        player.metadata.lastFire &&
        Date.now() - player.metadata.lastFire < 1200
    ) {
        lightFire(
            player,
            player.position,
            worldItemLog,
            skillInfo.experienceGained,
        );
    } else {
        player.sendMessage('You attempt to light the logs.');

        runFiremakingTask(player, worldItemLog);
    }
};

/** Firemaking plugin */
export default {
    pluginId: 'rs:firemaking',
    hooks: [
        {
            type: 'item_on_item',
            items: FIREMAKING_LOGS.map((log) => ({
                item1: itemIds.tinderbox,
                item2: log.logItem?.gameId,
            })),
            handler: tinderboxOnLogHandler,
        } satisfies ItemOnItemActionHook,
        {
            type: 'item_on_world_item',
            items: FIREMAKING_LOGS.map((log) => ({
                item: itemIds.tinderbox,
                worldItem: log.logItem?.gameId,
            })),
            handler: ({ player, usedWithItem }) => {
                runFiremakingTask(player, usedWithItem);
            },
        } satisfies ItemOnWorldItemActionHook,
    ],
};
