import { objectInteractionActionHandler } from '@engine/action';
import { getBestPickaxe, soundIds } from '@engine/world/config';
import { MiningTask } from './mining-task';
import { Skill } from '@engine/world/actor';
import { getOreFromRock, getOreIds } from './ores';

const action: objectInteractionActionHandler = ({
    object,
    player,
    position,
}) => {
    // Get the mining details for the target rock
    const ore = getOreFromRock(object.objectId);
    if (!ore) {
        player.sendMessage('There is current no ore available in this rock.');
        player.playSound(soundIds.oreEmpty, 7, 0);
        return;
    }

    if (!player.skills.hasLevel(Skill.MINING, ore.levelToMine)) {
        player.sendMessage(
            `You need a Mining level of ${ore.levelToMine} to mine this rock.`,
            true,
        );
        return;
    }

    const tool = getBestPickaxe(player);
    if (!tool) {
        player.sendMessage(
            'You do not have a pickaxe for which you have the level to use.',
        );
        return;
    }

    if (!player.inventory.hasSpace()) {
        player.sendMessage('Your inventory is too full.', true);
        player.playSound(soundIds.inventoryFull);
        return;
    }

    player.enqueueTask(MiningTask, [object, ore, tool]);
};


export default {
    pluginId: 'rs:mining',
    hooks: [
        {
            type: 'object_interaction',
            options: ['mine'],
            objectIds: getOreIds(),
            walkTo: false,
            handler: action,
        },
    ],
};
