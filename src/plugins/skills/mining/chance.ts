import { randomBetween } from '@engine/util';
import { Ore } from './ores';

/**
 * Roll a random number between 0 and 255 and compare it to the percent needed to mine the ore.
 *
 * @param ore The ore to mine
 * @param toolLevel The level of the pickaxe being used
 * @param miningLevel The player's mining level
 *
 * @returns True if the ore was successfully extracted, false otherwise
 */
export const canMine = (
    ore: Ore,
    toolLevel: number,
    miningLevel: number
): boolean => {
    const successChance = randomBetween(0, 255);

    const percentNeeded = ore.baseMineChance + toolLevel + miningLevel;
    return successChance <= percentNeeded;
};
