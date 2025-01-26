import { LandscapeObject } from '@runejs/filestore';
import { equipmentIndices, findItem, ItemDetails } from '@engine/config';
import { ActorLandscapeObjectInteractionTask } from '@engine/task/impl';
import { colors, colorText, randomBetween } from '@engine/util';
import { Player, Skill } from '@engine/world/actor';
import {
    HarvestTool,
    IHarvestable,
    selectWeightedItem,
    soundIds,
} from '@engine/world/config';
import { checkForGemBoost } from '@engine/world/skill-util/glory-boost';
import { rollGemType } from '@engine/world/skill-util/harvest-roll';
import { canMine } from './chance';

/**
 * A task that handles mining. It is a subclass of ActorLandscapeObjectInteractionTask, which means that it will
 * walk to the object, and then execute the task when it is in range.
 *
 * The mining task will repeat until the player's inventory is full, or the rock is depleted, or the task is otherwise
 * stopped.
 *
 * @author jameskmonger
 */
export class MiningTask extends ActorLandscapeObjectInteractionTask<Player> {
    /**
     * The number of ticks that have elapsed since this task was started.
     *
     * We use this to determine when to mine the next ore, or play the next animation.
     */
    private elapsedTicks = 0;

    /** The human-readable name of the item that we are mining. */
    private oreName: string;
    private oreItem: ItemDetails;
    /**
     * Something is broke in the task inheritence tree and landscapeObject is
     * never available to us :(
     */
    private landscapeObjectProxy: LandscapeObject;

    constructor(
        player: Player,
        landscapeObject: LandscapeObject,
        private readonly ore: IHarvestable,
        private readonly tool: HarvestTool,
    ) {
        super(player, landscapeObject);

        const itemConfigId =
            typeof ore.items === 'string'
                ? ore.items
                : selectWeightedItem(ore.items);

        const item = findItem(itemConfigId);
        if (!item) {
            throw new Error(`Could not find item with ID ${itemConfigId}`);
        }

        this.landscapeObjectProxy = landscapeObject;
        this.oreItem = item;
        this.oreName = item.name.toLowerCase().replace(' ore', '');
    }

    private isGemRock(): boolean {
        return this.landscapeObject?.objectId === 2111;
    }

    private hasChargedGlory(): boolean {
        const neckSlotIndex = equipmentIndices.neck; // This is 2
        const neckItem = this.actor.equipment.items[neckSlotIndex];
        if (!neckItem) {
            return false;
        }
        const itemConfig = findItem(neckItem.itemId);
        if (!itemConfig) {
            return false;
        }
        return itemConfig.key.startsWith('rs:amulet_of_glory:charged_');
    }

    public execute(): void {
        const taskIteration = this.elapsedTicks++;

        // This will be null if the player is not in range of the object.
        if (!this.landscapeObjectProxy) {
            return;
        }

        if (!this.hasLevel()) {
            this.actor.sendMessage(
                `You need a Mining level of ${this.ore.level} to mine this rock.`,
                true,
            );
            this.stop();
            return;
        }

        if (!this.hasMaterials()) {
            this.actor.sendMessage(
                'You do not have a pickaxe for which you have the level to use.',
            );
            this.stop();
            return;
        }

        // Check if the players inventory is full, and notify them if its full.
        if (!this.actor.inventory.hasSpace()) {
            this.actor.sendMessage(
                `Your inventory is too full to hold any more ${this.oreName}.`,
                true,
            );
            this.actor.playSound(soundIds.inventoryFull);
            this.stop();
            return;
        }

        // mining in original plugin took 3 ticks to mine a rock, so we'll do the same for now
        if (taskIteration % 3 !== 0) {
            return;
        }

        // roll for success
        const succeeds = canMine(
            { ...this.ore, baseChance: this.getGemMiningChance() },
            this.tool.level,
            this.actor.skills.mining.level,
        );

        if (!succeeds) {
            // Play the sound, restart the animation and try again in a few ticks.
            this.actor.playSound(soundIds.pickaxeSwing, 7, 0);
            this.actor.playAnimation(this.tool.animation);
            return;
        }

        const findsRareGem =
            randomBetween(1, checkForGemBoost(this.actor)) === 1;
        if (findsRareGem) {
            this.actor.sendMessage(
                colorText('You found a rare gem.', colors.red),
            );
            this.actor.giveItem(rollGemType());
        } else {
            this.actor.sendMessage(`You manage to mine some ${this.oreName}.`);
            this.actor.giveItem(this.oreItem.gameId);
        }

        this.actor.skills.addExp(Skill.MINING, this.ore.experience);

        // check if the rock is depleted
        if (randomBetween(0, 100) <= this.ore.break) {
            this.actor.playSound(soundIds.oreDepeleted);
            this.actor.stopAnimation();

            const replacementObject = this.ore.objects.get(
                this.landscapeObjectProxy.objectId,
            );

            if (replacementObject) {
                const respawnTime = randomBetween(
                    this.ore.respawnLow,
                    this.ore.respawnHigh,
                );
                this.actor.instance.replaceGameObject(
                    replacementObject,
                    this.landscapeObjectProxy,
                    respawnTime,
                );
            }

            this.stop();
            return;
        }
    }

    /**
     * Checks if the player has the pickaxe they started with.
     *
     * @returns true if the player has the pickaxe, false otherwise
     */
    private hasMaterials() {
        return this.actor.inventory.has(this.tool.itemId);
    }

    /**
     * Returns the chance of successfully mining an ore from a rock,
     * accomodating the special case of gem rocks.
     */
    private getGemMiningChance(): number {
        if (!this.isGemRock()) {
            return this.ore.baseChance;
        }

        // Base chance scaling from 28 to 70 based on level
        let chance =
            this.ore.baseChance +
            ((this.actor.skills.mining.level - this.ore.level) * (70 - 28)) /
                (99 - 40);

        // Glory multiplies chance by 3 (from 28-70 to 84-210)
        if (this.hasChargedGlory()) {
            chance *= 3;
        }

        return chance;
    }

    /**
     * Check that the player still has the level to mine the ore.
     *
     * @returns true if the player has the level, false otherwise
     */
    private hasLevel() {
        return this.actor.skills.hasLevel(Skill.MINING, this.ore.level);
    }
}
