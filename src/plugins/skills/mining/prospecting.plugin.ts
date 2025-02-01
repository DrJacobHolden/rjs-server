import type { objectInteractionActionHandler } from '@engine/action/pipe/object-interaction.action';
import { findItem } from '@engine/config/config-handler';
import { getAllOreIds, getOreFromRock } from '@engine/world/config/harvestable-object';
import { soundIds } from '@engine/world/config/sound-ids';

const action: objectInteractionActionHandler = details => {
    details.player.sendMessage('You examine the rock for ores.');
    details.player.face(details.position);
    const ore = getOreFromRock(details.object.objectId);
    details.player.playSound(soundIds.oreEmpty, 7, 0);

    const itemConfigId = typeof ore.items === 'string' ? ore.items : ore.items[0].itemConfigId;
    const oreItem = findItem(itemConfigId);

    if (!oreItem) {
        details.player.sendMessage('Sorry, something went wrong. Please report this to a developer.');
        return;
    }

    // this used to use `setInterval` but will need rewriting to be synced with ticks
    // see https://github.com/runejs/server/issues/417
    details.player.sendMessage('[debug] see issue #417');
    // setTimeout(() => {
    //     if (!ore) {
    //         details.player.sendMessage('There is current no ore available in this rock.');
    //         return;
    //     }
    //     const oreName = oreItem.name.toLowerCase().replace(' ore', '');

    //     details.player.sendMessage(`This rock contains ${oreName}.`);
    // }, World.TICK_LENGTH * 3);
};

export default {
    pluginId: 'rs:prospecting',
    hooks: [
        {
            type: 'object_interaction',
            options: ['prospect'],
            objectIds: getAllOreIds(),
            walkTo: true,
            handler: action,
        },
    ],
};
