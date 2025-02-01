import type { Player } from '@engine/world/actor/player/player';
import type { WorldInstance } from '@engine/world/instances';
import type { Position } from '@engine/world/position';

export type WorldItem = {
    itemId: number;
    amount: number;
    position: Position;
    owner?: Player;
    expires?: number;
    respawns?: number;
    removed?: boolean;
    instance: WorldInstance;
};
