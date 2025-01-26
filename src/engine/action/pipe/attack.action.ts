import { Player, Npc } from '@engine/world/actor';
import {
    ActionHook,
    getActionHooks,
    ActionPipe,
    RunnableHooks,
} from '@engine/action';

export interface AttackActionHook
    extends ActionHook<AttackAction, attackActionHandler> {}

export type attackActionHandler = (attackAction: AttackAction) => void;

export interface AttackAction {
    // The player performing the action.
    player: Player;
    // The NPC the action is being performed on.
    npc: Npc;
}

const attackActionPipe = (
    player: Player,
    npc: Npc,
): RunnableHooks<AttackAction> => {
    const matchingHooks = getActionHooks<AttackActionHook>('attack');

    return {
        hooks: matchingHooks,
        action: {
            player,
            npc,
        },
    };
};

export default ['attack', attackActionPipe] as ActionPipe;
