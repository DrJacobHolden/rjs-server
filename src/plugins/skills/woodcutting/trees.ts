import { objectIds } from '@engine/world/config/object-ids';

type HealthyID = number;
type StumpID = number;
export type Tree = {
    stumpIdByTreeId: Record<HealthyID, StumpID>;
    logItemName: string;
    levelToChop: number;
    expPerChop: number;
    baseChopChance: number;
    minRespawnTicks: number;
    maxRespawnTicks: number;
    breakChance: number;
};

const getStumpsByTree = (
    tree: keyof (typeof objectIds)['tree'],
): Tree['stumpIdByTreeId'] => {
    // Trees are stored as an array of stumpIdByTreeId containing the tree ID
    // (`default`) and the stump ID `stump`.
    const treeObjectIds = objectIds.tree[tree];
    if (!treeObjectIds) {
        throw new Error(`No object ids found for tree: ${tree}`);
    }

    return treeObjectIds.reduce<Tree['stumpIdByTreeId']>((acc, tree) => {
        acc[tree.default] = tree.stump;
        return acc;
    }, {});
};

const trees: Tree[] = [
    {
        stumpIdByTreeId: getStumpsByTree('normal'),
        logItemName: 'rs:logs',
        levelToChop: 1,
        expPerChop: 25,
        minRespawnTicks: 59,
        maxRespawnTicks: 98,
        baseChopChance: 70,
        breakChance: 100,
    },
    {
        stumpIdByTreeId: getStumpsByTree('achey'),
        logItemName: 'rs:achey_logs',
        levelToChop: 1,
        expPerChop: 25,
        minRespawnTicks: 59,
        maxRespawnTicks: 98,
        baseChopChance: 70,
        breakChance: 100,
    },
    {
        stumpIdByTreeId: getStumpsByTree('oak'),
        logItemName: 'rs:oak_logs',
        levelToChop: 15,
        expPerChop: 37.5,
        minRespawnTicks: 14,
        maxRespawnTicks: 14,
        baseChopChance: 50,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('willow'),
        logItemName: 'rs:willow_logs',
        levelToChop: 30,
        expPerChop: 67.5,
        minRespawnTicks: 14,
        maxRespawnTicks: 14,
        baseChopChance: 30,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('teak'),
        logItemName: 'rs:teak_logs',
        levelToChop: 35,
        expPerChop: 85,
        minRespawnTicks: 15,
        maxRespawnTicks: 15,
        baseChopChance: 0,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('maple'),
        logItemName: 'rs:maple_logs',
        levelToChop: 45,
        expPerChop: 100,
        minRespawnTicks: 59,
        maxRespawnTicks: 59,
        baseChopChance: 0,
        breakChance: 100 / 8,
    },
    // TODO: Arctic Pine
    {
        stumpIdByTreeId: getStumpsByTree('hollow'),
        logItemName: 'rs:bark',
        levelToChop: 45,
        expPerChop: 82.5,
        minRespawnTicks: 43,
        maxRespawnTicks: 44,
        baseChopChance: 0,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('mahogany'),
        logItemName: 'rs:mahogany_logs',
        levelToChop: 50,
        expPerChop: 125,
        minRespawnTicks: 14,
        maxRespawnTicks: 14,
        baseChopChance: -5,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('yew'),
        logItemName: 'rs:yew_logs',
        levelToChop: 60,
        expPerChop: 175,
        minRespawnTicks: 99,
        maxRespawnTicks: 99,
        baseChopChance: -15,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('magic'),
        logItemName: 'rs:magic_logs',
        levelToChop: 75,
        expPerChop: 250,
        minRespawnTicks: 199,
        maxRespawnTicks: 199,
        baseChopChance: -25,
        breakChance: 100 / 8,
    },
    {
        stumpIdByTreeId: getStumpsByTree('dramen'),
        logItemName: 'rs:dramen_branch',
        levelToChop: 36,
        expPerChop: 0,
        minRespawnTicks: 0,
        maxRespawnTicks: 0,
        baseChopChance: 100,
        breakChance: 0,
    },
];

export const getTreeFromHealthy = (objectId: number): Tree | undefined => {
    return trees.find((tree) => tree.stumpIdByTreeId[objectId] !== undefined);
};

export const getTreeIds = (): number[] => {
    return trees.flatMap((tree) =>
        Object.keys(tree.stumpIdByTreeId).map(Number),
    );
};
