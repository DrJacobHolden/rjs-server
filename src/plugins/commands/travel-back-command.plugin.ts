import type { commandActionHandler } from '@engine/action/pipe/player-command.action';

const action: commandActionHandler = (details) => {
    const { player } = details;

    if (player.metadata.lastPosition) {
        player.teleport(player.metadata.lastPosition);
    }
};

export default {
    pluginId: 'rs:travel_back_command',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'back' ],
            handler: action
        }
    ]
};
