import { randomBetween } from '@engine/util/num';
import { colorText } from '@engine/util/strings';
import { colors } from '@engine/util/colors';
import { rollBirdsNestType } from '@engine/world/skill-util/harvest-roll';
import { soundIds } from '@engine/world/config/sound-ids';
import { findItem, findObject } from '@engine/config/config-handler';
import { activeWorld, Position } from '@engine/world';
import { canCut } from './chance';
import { Player } from '@engine/world/actor';
import { LandscapeObject } from '@runejs/filestore';
import { logger } from '@runejs/common';
import { Task } from '@engine/task';
import { ObjectInteractionAction } from '@engine/action';
import { getBestAxe } from '@engine/world/config';
import { getTreeFromHealthy, Tree } from '@plugins/skills/woodcutting/trees';

class WoodcuttingTask extends Task {
    /** The number of ticks that `execute` has been called inside this task. */
    private elapsedTicks = 0;

    constructor(
        /** The player this is attempting to cut down the tree. */
        private readonly player: Player,
        /** The object that represents the tree. */
        private readonly landscapeObject: LandscapeObject,
        /** The information for the type of tree being chopped */
        private readonly treeInfo: Tree,
        /** The width of the tree */
        private readonly sizeX: number,
        /** The height of the tree */
        private readonly sizeY: number,
    ) {
        super();
    }

    /**
     * Execute the main woodcutting task loop. This method is called every game tick until the task is completed.
     */
    public execute(): void {
        if (
            !isInChoppingRange(
                this.player.position,
                this.landscapeObject,
                this.sizeX,
                this.sizeY,
            )
        ) {
            // Wait until we arrive at the tree.
            return;
        }

        if (this.player.skills.woodcutting.level < this.treeInfo.levelToChop) {
            this.player.sendMessage(
                `You need a Woodcutting level of ${this.treeInfo.levelToChop} to chop down this tree.`,
                true,
            );
            this.stop();
            return;
        }

        const tool = getBestAxe(this.player);
        if (!tool) {
            this.player.sendMessage(
                'You do not have an axe for which you have the level to use.',
            );
            this.stop();
            return;
        }

        if (!this.player.inventory.hasSpace()) {
            this.player.sendMessage(
                'Your inventory is too full to hold any more logs.',
                true,
            );
            this.stop();
            return;
        }

        // store the tick count before incrementing so we don't need to keep track of it in all the separate branches
        const taskIteration = this.elapsedTicks++;

        if (taskIteration === 0) {
            this.player.sendMessage('You swing your axe at the tree.');
            this.player.face(
                new Position(
                    this.landscapeObject.x,
                    this.landscapeObject.y,
                    this.landscapeObject.level,
                ),
            );
            this.player.playAnimation(tool.animation);
            // First tick / iteration should never proceed beyond this point.
            return;
        }

        // play a random axe sound at the correct time
        if (taskIteration % 3 !== 0) {
            const randomSoundIdx = Math.floor(
                Math.random() * soundIds.axeSwing.length,
            );
            this.player.playSound(soundIds.axeSwing[randomSoundIdx], 7, 0);
        }

        // roll for success
        const succeeds = canCut(
            this.treeInfo,
            tool.level,
            this.player.skills.woodcutting.level,
        );

        if (!succeeds) {
            this.player.playAnimation(tool.animation);

            // Keep chopping.
            return;
        }

        const logItem = findItem(this.treeInfo.logItemName);
        if (!logItem) {
            logger.error(
                `Could not find a log matching ${this.treeInfo.logItemName}`,
            );
            this.player.sendMessage(
                'Sorry, an error occurred. Please report this to a developer.',
            );
            this.stop();
            return;
        }

        const targetName = (logItem.name || '').toLowerCase();

        // if player doesn't have space in inventory, stop the task
        if (!this.player.inventory.hasSpace()) {
            this.player.sendMessage(
                `Your inventory is too full to hold any more ${targetName}.`,
                true,
            );
            this.player.playSound(soundIds.inventoryFull);
            this.stop();
            return;
        }

        const roll = randomBetween(1, 256);
        // roll for bird nest chance
        if (roll === 1) {
            this.player.sendMessage(
                colorText(`A bird's nest falls out of the tree.`, colors.red),
            );
            activeWorld.globalInstance.spawnWorldItem(
                rollBirdsNestType(),
                this.player.position,
                { owner: this.player, expires: 300 },
            );
        } else {
            // Standard log chopper
            this.player.sendMessage(`You manage to chop some ${targetName}.`);
            this.player.giveItem(this.treeInfo.logItemName);
        }

        this.player.skills.woodcutting.addExp(this.treeInfo.expPerChop);

        // check if the tree should be broken
        if (randomBetween(0, 100) <= this.treeInfo.breakChance) {
            this.player.playSound(soundIds.treeChoppedDown);

            const brokenTreeId =
                this.treeInfo.stumpIdByTreeId[this.landscapeObject.objectId];

            if (brokenTreeId !== undefined) {
                this.player.instance.replaceGameObject(
                    brokenTreeId,
                    this.landscapeObject,
                    randomBetween(
                        this.treeInfo.minRespawnTicks,
                        this.treeInfo.maxRespawnTicks,
                    ),
                );
            } else {
                logger.error(
                    `Could not find broken tree id for tree id ${this.landscapeObject.objectId}`,
                );
            }

            this.stop();
        }
    }

    /** This method is called when the task stops. */
    public onStop(): void {
        this.player.stopAnimation();
    }
}

const isInChoppingRange = (
    playerPosition: Position,
    object: LandscapeObject,
    sizeX: number,
    sizeY: number,
) => {
    return (
        playerPosition.x >= object.x - 1 &&
        playerPosition.x <= object.x + sizeX &&
        playerPosition.y >= object.y - 1 &&
        playerPosition.y <= object.y + sizeY
    );
};

export const runWoodcuttingTask = ({
    player,
    object,
}: ObjectInteractionAction) => {
    const objectConfig = findObject(object.objectId);
    if (!objectConfig) {
        logger.warn(
            `Player ${player.username} attempted to run a woodcutting task on an invalid object (id: ${object.objectId})`,
        );
        return;
    }

    const treeInfo = getTreeFromHealthy(object.objectId);
    if (!treeInfo) {
        logger.warn(
            `Player ${player.username} attempted to run a woodcutting task on an invalid tree (id: ${object.objectId})`,
        );
        return;
    }

    const sizeX = objectConfig.rendering.sizeX;
    const sizeY = objectConfig.rendering.sizeY;

    player.enqueueTask(WoodcuttingTask, [object, treeInfo, sizeX, sizeY]);
};
