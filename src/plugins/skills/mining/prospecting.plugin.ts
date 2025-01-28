import { objectInteractionActionHandler } from '@engine/action';
import { soundIds } from '@engine/world/config/sound-ids';
import { World } from '@engine/world';
import { findItem } from '@engine/config/config-handler';
import { getOreFromRock, getOreIds } from './ores';

const action: objectInteractionActionHandler = ({
    player,
    position,
    object,
}) => {
    player.sendMessage('You examine the rock for ores.');
    player.face(position);

    const ore = getOreFromRock(object.objectId);
    if (!ore) {
        player.sendMessage('There is current no ore available in this rock.');
        player.playSound(soundIds.oreEmpty, 7, 0);
        return;
    }

    const itemConfigId =
        typeof ore.oreItemName === 'string'
            ? ore.oreItemName
            : ore.oreItemName[0].itemConfigId;

    const oreItem = findItem(itemConfigId);
    if (!oreItem) {
        player.sendMessage(
            'Sorry, something went wrong. Please report this to a developer.',
        );
        return;
    }

    setTimeout(() => {
        if (!ore) {
            player.sendMessage(
                'There is currently no ore available in this rock.',
            );
            return;
        }
        const oreName = oreItem.name.toLowerCase().replace(' ore', '');

        player.sendMessage(`This rock contains ${oreName}.`);
    }, World.TICK_LENGTH * 3);
};

export default {
    pluginId: 'rs:prospecting',
    hooks: [
        {
            type: 'object_interaction',
            options: ['prospect'],
            objectIds: getOreIds(),
            walkTo: true,
            handler: action,
        },
    ],
};
