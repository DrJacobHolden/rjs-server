import { randomBetween } from '@engine/util';
import { Tree } from './trees';

/**
 * Roll a random number between 0 and 255 and compare it to the percent needed to cut the tree.
 *
 * @param tree The tree to cut
 * @param toolLevel The level of the axe being used
 * @param woodcuttingLevel The player's woodcutting level
 *
 * @returns True if the tree was successfully cut, false otherwise
 */
export const canCut = (
    tree: Tree,
    toolLevel: number,
    woodcuttingLevel: number,
): boolean => {
    const successChance = randomBetween(0, 255);

    const percentNeeded = tree.baseChopChance + toolLevel + woodcuttingLevel;
    return successChance <= percentNeeded;
};
