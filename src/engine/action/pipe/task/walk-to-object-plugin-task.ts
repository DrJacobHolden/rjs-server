import { LandscapeObject } from '@runejs/filestore';
import { ActorLandscapeObjectInteractionTask } from '@engine/task/impl';
import { Player } from '@engine/world/actor';
import { ObjectInteractionAction } from '../object-interaction.action';
import { ItemOnObjectAction } from '../item-on-object.action';
import { ActionHook } from '@engine/action/hook';

/**
 * All actions supported by this plugin task.
 */
type ObjectAction = ObjectInteractionAction | ItemOnObjectAction;

/**
 * An ActionHook for a supported ObjectAction.
 */
type ObjectActionHook<TAction extends ObjectAction> = ActionHook<TAction, (data: TAction) => void>;

/**
 * The data unique to the action being executed (i.e. excluding shared data)
 */
type ObjectActionData<TAction extends ObjectAction> = Omit<TAction, 'player' | 'object' | 'position'>;

/**
* This is a task to migrate old `walkTo` item interaction actions to the new task system.
*
* This is a first-pass implementation to allow for removal of the old action system.
* It will be refactored in future to be more well suited to our plugin system.
*/
export class WalkToObjectPluginTask<TAction extends ObjectAction> extends ActorLandscapeObjectInteractionTask<Player> {
    /**
     * The plugins to execute when the player arrives at the object.
     */
    private plugins: ObjectActionHook<TAction>[];

    private data: ObjectActionData<TAction>;

    constructor(plugins: ObjectActionHook<TAction>[], player: Player, landscapeObject: LandscapeObject, data: ObjectActionData<TAction>) {
        super(
            player,
            landscapeObject,
            // TODO (jkm) handle object size
            // TODO (jkm) pass orientation instead of size
            1,
            1,
        );

        this.plugins = plugins;
        this.data = data;
    }


    protected onObjectReached(): void {
        const landscapeObject = this.landscapeObject;
        const landscapeObjectPosition = this.landscapeObjectPosition;

        if (!landscapeObject || !landscapeObjectPosition) {
            this.stop();
            return;
        }

        this.plugins.forEach(plugin => {
            if (!plugin?.handler) return;

            const action = {
                player: this.actor,
                object: landscapeObject,
                position: landscapeObjectPosition,
                ...this.data
            } as TAction;

            plugin.handler(action);
        });

        this.stop();
    }
}
