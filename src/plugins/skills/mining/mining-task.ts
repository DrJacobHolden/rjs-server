import { LandscapeObject } from '@runejs/filestore';
import { equipmentIndices, findItem, ItemDetails } from '@engine/config';
import { colors, colorText, randomBetween } from '@engine/util';
import { Player, Skill } from '@engine/world/actor';
import { HarvestTool, soundIds } from '@engine/world/config';
import { checkForGemBoost } from '@engine/world/skill-util/glory-boost';
import { rollGemType } from '@engine/world/skill-util/harvest-roll';
import { canMine } from './chance';
import { Task } from '@engine/task';
import { Ore, selectWeightedItem } from './ores';
import { Position } from '@engine/world';

export class MiningTask extends Task {
    /** The number of ticks that `execute` has been called inside this task. */
    private elapsedTicks = 0;

    private readonly orePosition: Position;

    /** The human-readable name of the item that we are mining. */
    private oreName: string;
    private oreItem: ItemDetails;

    constructor(
        /** The player this is attempting to mine this ore node. */
        private readonly player: Player,
        /** The object that represents the ore node. */
        private readonly landscapeObject: LandscapeObject,
        private readonly ore: Ore,
        private readonly tool: HarvestTool,
    ) {
        super();

        const itemConfigId =
            typeof ore.oreItemName === 'string'
                ? ore.oreItemName
                : selectWeightedItem(ore.oreItemName);

        const item = findItem(itemConfigId);
        if (!item) {
            throw new Error(`Could not find item with ID ${itemConfigId}`);
        }

        this.orePosition = new Position(
            landscapeObject.x,
            landscapeObject.y,
            landscapeObject.level,
        );

        this.oreItem = item;
        this.oreName = item.name.toLowerCase().replace(' ore', '');
    }

    private isGemRock(): boolean {
        return this.landscapeObject?.objectId === 2111;
    }

    private hasChargedGlory(): boolean {
        const neckSlotIndex = equipmentIndices.neck; // This is 2
        const neckItem = this.player.equipment.items[neckSlotIndex];
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
        if (this.player.position.distanceBetween(this.orePosition) > 1) {
            // The player needs to be in range to mine the rock.
            return;
        }

        if (this.player.skills.mining.level < this.ore.levelToMine) {
            this.player.sendMessage(
                `You need a Mining level of ${this.ore.levelToMine} to mine this rock.`,
                true,
            );
            this.stop();
            return;
        }

        if (!this.player.hasItemOnPerson(this.tool.itemId)) {
            this.player.sendMessage(
                'You do not have a pickaxe for which you have the level to use.',
            );
            this.stop();
            return;
        }

        // Check if the players inventory is full, and notify them if its full.
        if (!this.player.inventory.hasSpace()) {
            this.player.sendMessage(
                `Your inventory is too full to hold any more ${this.oreName}.`,
                true,
            );
            this.player.playSound(soundIds.inventoryFull);
            this.stop();
            return;
        }

        // Start counting ticks as all checks have passed.
        this.elapsedTicks++;
        if (this.elapsedTicks === 1) {
            this.player.sendMessage('You swing your pick at the rock.');
            this.player.face(this.orePosition);
            this.player.playAnimation(this.tool.animation);
            // Prevent succeeding on the first tick to avoid spam-clicking as a
            // viable mining strategy.
            return;
        }

        if (this.elapsedTicks % 3 === 0) {
            this.player.playSound(soundIds.pickaxeSwing, 7, 0);
            this.player.playAnimation(this.tool.animation);
        }

        // roll for success
        const succeeds = canMine(
            { ...this.ore, baseMineChance: this.getGemMiningChance() },
            this.tool.level,
            this.player.skills.mining.level,
        );

        if (!succeeds) {
            // Keep mining
            return;
        }

        const findsRareGem =
            randomBetween(1, checkForGemBoost(this.player)) === 1;
        if (findsRareGem) {
            this.player.sendMessage(
                colorText('You found a rare gem.', colors.red),
            );
            this.player.giveItem(rollGemType());
        } else {
            this.player.sendMessage(`You manage to mine some ${this.oreName}.`);
            this.player.giveItem(this.oreItem.gameId);
        }

        this.player.skills.addExp(Skill.MINING, this.ore.exp);

        // check if the rock is depleted
        if (randomBetween(0, 100) <= this.ore.emptyChance) {
            this.player.playSound(soundIds.oreDepeleted);
            this.player.stopAnimation();

            const replacementObject =
                this.ore.emptyRockIdByOreId[this.landscapeObject.objectId];

            if (replacementObject) {
                const respawnTime = randomBetween(
                    this.ore.minRespawnTicks,
                    this.ore.maxRespawnTicks,
                );
                this.player.instance.replaceGameObject(
                    replacementObject,
                    this.landscapeObject,
                    respawnTime,
                );
            }

            this.stop();
            return;
        }
    }

    /**
     * Returns the chance of successfully mining an ore from a rock,
     * accomodating the special case of gem rocks.
     */
    private getGemMiningChance(): number {
        if (!this.isGemRock()) {
            return this.ore.baseMineChance;
        }

        // Base chance scaling from 28 to 70 based on level
        let chance =
            this.ore.baseMineChance +
            ((this.player.skills.mining.level - this.ore.levelToMine) *
                (70 - 28)) /
                (99 - 40);

        // Glory multiplies chance by 3 (from 28-70 to 84-210)
        if (this.hasChargedGlory()) {
            chance *= 3;
        }

        return chance;
    }
}
