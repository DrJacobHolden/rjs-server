import type { NpcInteractionActionHook } from '@engine/action/pipe/npc-interaction.action';
import { findShop } from '@engine/config/config-handler';
import type { ContentPlugin } from '@engine/plugins/content-plugin';


const bobHook: NpcInteractionActionHook = {
    type: 'npc_interaction',
    npcs: 'rs:lumbridge_bob',
    options: 'trade',
    walkTo: true,
    handler: ({ player }) => findShop('rs:lumbridge_bobs_axes')?.open(player)
};

const bobPlugin: ContentPlugin = {
    pluginId: 'rs:bob',
    hooks: [ bobHook ]
}

export default bobPlugin;
