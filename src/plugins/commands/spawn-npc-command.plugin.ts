import type { commandActionHandler } from '@engine/action/pipe/player-command.action';
import { Npc } from '@engine/world/actor/npc';
import { findNpc } from '@engine/config/config-handler';
import type { NpcDetails } from '@engine/config/npc-config';
import { NpcSpawn } from '@engine/config/npc-spawn-config';
import { activeWorld } from '@engine/world';

const action: commandActionHandler = ({ player, args }) => {
    let npcKey: string | number = args.npcKey;
    let npcDetails: NpcDetails | null = null;

    if(typeof npcKey === 'string' && npcKey.match(/^[0-9]+$/)) {
        npcKey = parseInt(npcKey, 10);
    }

    if(typeof npcKey === 'string') {
        npcDetails = findNpc(npcKey);
        npcKey = npcDetails.gameId;
    }

    const movementRadius: number = args.movementRadius as number;

    const npc = new Npc(npcDetails ? npcDetails : npcKey,
        new NpcSpawn(npcDetails?.key ? npcDetails.key : `unknown-${npcKey}`,
            player.position.clone(), movementRadius, 'WEST'), player.instance);

    activeWorld.registerNpc(npc);
};

export default {
    pluginId: 'rs:spawn_npc_command',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'npc', 'spawnnpc', 'spawn_npc' ],
            args: [
                {
                    name: 'npcKey',
                    type: 'either'
                },
                {
                    name: 'movementRadius',
                    type: 'number',
                    defaultValue: 0
                }
            ],
            handler: action
        }
    ]
};
