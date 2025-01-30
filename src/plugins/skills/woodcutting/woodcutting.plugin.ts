import { Player, Skill } from '@engine/world/actor';
import { LandscapeObject } from '@runejs/filestore';
import { findItem } from '@engine/config';
import { QueueType } from '@engine/world/actor/tick-queue';
import {
    AXES,
    getTreeFromHealthy,
    getTreeIds,
    WOODCUTTING_SOUNDS
} from '@plugins/skills/woodcutting/woodcutting.constants';
import { randomBetween } from '@engine/util';
import { ContentPlugin } from '@engine/plugins/plugin.types';
import { ObjectInteractionAction } from '@engine/action';


const getBestAxe = (player: Player): number | null => {
    const availableAxes = [...AXES.entries()]
        .filter(([axeId, data]) =>
            player.hasItemInInventory(axeId) ||
            player.isItemEquipped(axeId)).filter(([axeId, data]) => player.skills.hasLevel(Skill.WOODCUTTING, data.level))
        .sort(([, a], [, b]) => b.bonus - a.bonus);

    if (availableAxes.length === 0) {
        player.sendMessage('You do not have an axe which you have the woodcutting level to use.');
        return null;
    }

    return availableAxes[0][0];
};

const handleSoundCycle = (player: Player, startTick: number): void => {
    const currentTick = player.tickQueue.currentTick;
    const relativeTick = (currentTick - startTick) % 3;
    const chopSound = WOODCUTTING_SOUNDS.CHOP[
        Math.floor(Math.random() * WOODCUTTING_SOUNDS.CHOP.length)
    ];
    const volumes = [8, 0, 18]; // third, second, first chop
    player.playSound(chopSound, volumes[relativeTick]);
};

const checkTreeDepletion = (player: Player, tree: LandscapeObject): boolean => {
    const treeData = getTreeFromHealthy(tree.objectId);
    if (!treeData) return true;

    const depletionChance = treeData.break / 100;

    if (Math.random() < depletionChance) {
        const respawnTicks = randomBetween(treeData.respawnLow, treeData.respawnHigh)
        // Scale by player count in area
        // const scaledTicks = Math.ceil(respawnTicks * (1 + player.region.playerCount * 0.1));
        const scaledTicks = respawnTicks;

        player.playSound(WOODCUTTING_SOUNDS.TREE_DEPLETED, 10);

        const brokenId = treeData.objects.get(tree.objectId);

        if(brokenId) {
            // await tree.transform(tree.nextStage, scaledTicks);
            player.instance.replaceGameObject(brokenId,
                tree, scaledTicks);
        }

        return true;
    }
    return false;
};

const calculateSuccess = (player: Player, tree: LandscapeObject, axe: number): boolean => {
    const treeData = getTreeFromHealthy(tree.objectId);
    const axeData = AXES.get(axe);
    if (!treeData || !axeData) return false;

    const playerLevel = player.skills.getLevel('woodcutting');
    // const low = treeData.baseChance + axeData.bonus;
    const high = treeData.baseChance + axeData.bonus;

    return Math.random() * high < (playerLevel + axeData.bonus);
};

const startWoodcutting = async (details: ObjectInteractionAction): Promise<void> => {
    const { player, object: tree } = details;

    const treeData = getTreeFromHealthy(tree.objectId);
    if (!treeData) return;

    // Initial requirements check
    if (player.skills.getLevel('woodcutting') < treeData.level) {
        player.sendMessage(`You need a Woodcutting level of ${treeData.level} to chop this tree.`);
        return;
    }

    const axe = getBestAxe(player);
    if (!axe) return;

    // Initial setup
    const startTick = player.tickQueue.currentTick;
    player.sendMessage('You swing your axe at the tree.');

    const chopTree = async (): Promise<void> => {
        // Check if we can still chop
        if (player.inventory.isFull()) {
            player.sendMessage(`Your inventory is too full to hold any more ${findItem(treeData.itemId)?.name.toLowerCase()}.`);
            return;
        }

        // Play animation every 4 ticks
        if ((player.tickQueue.currentTick - startTick) % 2 === 0) {
            const axeData = AXES.get(axe);
            if (axeData) player.playAnimation(axeData.animationId);
        }

        // Handle sound cycle every 3 ticks
        handleSoundCycle(player, startTick);

        try {
            // Wait for woodcutting timer (3 ticks normally, can be manipulated)
            await player.tickQueue.requestTicks({
                ticks: 3,
                type: QueueType.WEAK,
                useGlobalTimer: true
            });

            // Check for success
            if (calculateSuccess(player, tree, axe)) {
                // Give logs and xp
                if (player.giveItem(treeData.itemId)) {
                    player.skills.addExp('woodcutting', treeData.experience);
                    player.sendMessage(`You get some ${findItem(treeData.itemId)?.name.toLowerCase()}.`);
                }

                // Check for depletion
                if (checkTreeDepletion(player, tree)) {
                    player.playAnimation(null);
                    return;
                }
            }

            // Recursively continue chopping
            await chopTree();

        } catch (error) {
            // Handle interruption
            player.playAnimation(null);
        }
    };

    // Start the chopping cycle
    await chopTree();
};

export default<ContentPlugin> {
    pluginId: 'rs:woodcutting',
    hooks: [
        {
            type: 'object_interaction',
            objectIds: getTreeIds(),
            options: ['chop down'],
            handler: async (details) => startWoodcutting(details),
            walkTo: true
        },
        // {
        //     type: 'item_on_object',
        //     objectIds: [...getTreeIds()],
        //     itemIds: [...AXES.keys()],
        //     handler: async ({ player, object }) => startWoodcutting(player, object)
        // }
    ]
};
