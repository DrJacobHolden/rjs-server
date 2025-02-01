import type { commandActionHandler } from '@engine/action/pipe/player-command.action';
import { questMap } from '@engine/plugins/loader';

const action: commandActionHandler = (details) => {
    for (const quest of Object.values(questMap)) {
        details.player.sendLogMessage(quest.id, details.isConsole);
    }
};

export default {
    pluginId: 'promises:quest-list-command',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'quest-list', 'quests' ],
            handler: action
        }
    ]
};
