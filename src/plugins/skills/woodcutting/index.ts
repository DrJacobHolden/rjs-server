import { ObjectInteractionActionHook } from '@engine/action';
import { runWoodcuttingTask } from './woodcutting-task';
import { getTreeIds } from './trees';

export default {
    pluginId: 'rs:woodcutting',
    hooks: {
        type: 'object_interaction',
        options: ['chop down', 'chop'],
        objectIds: getTreeIds(),
        handler: runWoodcuttingTask,
        walkTo: false, // This option does not work correctly.
    } satisfies ObjectInteractionActionHook,
};
