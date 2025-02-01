import { World } from '@engine/world/world';

/**
 * The singleton instance of this game world.
 */
export let activeWorld: World;


/**
 * Creates a new instance of the game world and assigns it to the singleton world variable.
 */
export const activateGameWorld = async (): Promise<World> => {
    activeWorld = new World();
    await activeWorld.startup();
    return activeWorld;
};
