import { objectInteractionActionHandler } from '@engine/action';
import {
    getAllOreIds,
    getOreFromRock,
} from '@engine/world/config/harvestable-object';
import { getBestPickaxe, soundIds } from '@engine/world/config';
import { MiningTask } from '@plugins/skills/mining/mining-task';
import { Skill } from '@engine/world/actor';

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

    if (!player.skills.hasLevel(Skill.MINING, ore.level)) {
        player.sendMessage(
            `You need a Mining level of ${ore.level} to mine this rock.`,
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

    player.sendMessage('You swing your pick at the rock.');
    player.face(position);
    player.playAnimation(tool.animation);

    player.enqueueTask(MiningTask, [object, ore, tool]);
};


export default {
    pluginId: 'rs:mining',
    hooks: [ {
        type: 'object_interaction',
        options: [ 'mine' ],
        objectIds: getAllOreIds(),
        walkTo: true,
        handler: action
    } ]
};
