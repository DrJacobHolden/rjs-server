import { IHarvestable, itemIds, objectIds, soundIds } from '@engine/world/config';

export const WOODCUTTING_SOUNDS = {
    CHOP: soundIds.axeSwing, // Array of [88, 89, 90]
    TREE_DEPLETED: soundIds.oreDepeleted // 3600
};

interface AxeData {
    level: number;
    animationId: number;
    bonus: number;
}



export const AXES = new Map<number, AxeData>([
    [itemIds.axes.runite, { level: 41, animationId: 867, bonus: 8 }],
    [itemIds.axes.adamantite, { level: 31, animationId: 869, bonus: 7 }],
    [itemIds.axes.mithril, { level: 21, animationId: 871, bonus: 6 }],
    // [itemIds.axes.black, { level: 11, animationId: 873, bonus: 5 }],
    [itemIds.axes.steel, { level: 6, animationId: 875, bonus: 4 }],
    [itemIds.axes.iron, { level: 1, animationId: 877, bonus: 3 }],
    [itemIds.axes.bronze, { level: 1, animationId: 879, bonus: 2 }]
]);



const NORMAL_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.normal.map((tree) => [tree.default, tree.stump]),
    ...objectIds.tree.dead.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);

const ACHEY_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.archey.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);

const OAK_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.oak.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);


const WILLOW_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.willow.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);


const TEAK_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.teak.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);

const DRAMEN_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.dramen.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);


const MAPLE_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.maple.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);


const HOLLOW_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.hollow.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);

const MAHOGANY_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.mahogany.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);


const YEW_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.yew.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);

const MAGIC_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.tree.magic.map((tree) => [tree.default, tree.stump]),
] as [number, number][]);



const Trees: IHarvestable[] = [
    {
        objects: NORMAL_OBJECTS,
        itemId: itemIds.logs.normal,
        level: 1,
        experience: 25,
        respawnLow: 59,
        respawnHigh: 98,
        baseChance: 70,
        break: 100.0
    },
    {
        objects: ACHEY_OBJECTS,
        itemId: itemIds.logs.achey,
        level: 1,
        experience: 25,
        respawnLow: 59,
        respawnHigh: 98,
        baseChance: 70,
        break: 100.0
    },
    {
        objects: OAK_OBJECTS,
        itemId: itemIds.logs.oak,
        level: 15,
        experience: 37.5,
        respawnLow: 14,
        respawnHigh: 14,
        baseChance: 50,
        break: 100 / 8.0
    },
    {
        objects: WILLOW_OBJECTS,
        itemId: itemIds.logs.willow,
        level: 30,
        experience: 67.5,
        respawnLow: 14,
        respawnHigh: 14,
        baseChance: 30,
        break: 100 / 8.0
    },
    {
        objects: TEAK_OBJECTS,
        itemId: itemIds.logs.teak,
        level: 35,
        experience: 85,
        respawnLow: 15,
        respawnHigh: 15,
        baseChance: 0,
        break: 100 / 8.0
    },

    {
        objects: DRAMEN_OBJECTS,
        itemId: itemIds.logs.dramenbranch,
        level: 36,
        experience: 0,
        respawnLow: 0,
        respawnHigh: 0,
        baseChance: 100,
        break: 0
    },
    {
        objects: MAPLE_OBJECTS,
        itemId: itemIds.logs.maple,
        level: 45,
        experience: 100,
        respawnLow: 59,
        respawnHigh: 59,
        baseChance: 0,
        break: 100 / 8.0
    },
    {
        objects: HOLLOW_OBJECTS,
        itemId: itemIds.logs.bark,
        level: 45,
        experience: 82.5,
        respawnLow: 43,
        respawnHigh: 44,
        baseChance: 0,
        break: 100 / 8.0
    },
    {
        objects: MAHOGANY_OBJECTS,
        itemId: itemIds.logs.mahogany,
        level: 50,
        experience: 125,
        respawnLow: 14,
        respawnHigh: 14,
        baseChance: -5,
        break: 100 / 8.0
    },
    {
        objects: YEW_OBJECTS,
        itemId: itemIds.logs.yew,
        level: 60,
        experience: 175,
        respawnLow: 99,
        respawnHigh: 99,
        baseChance: -15,
        break: 100 / 8.0
    },
    {
        objects: MAGIC_OBJECTS,
        itemId: itemIds.logs.magic,
        level: 75,
        experience: 250,
        respawnLow: 199,
        respawnHigh: 199,
        baseChance: -25,
        break: 100 / 8.0
    },
];


export function getTreeIds(): number[] {
    const treeIds: number[] = [];
    for (const tree of Trees) {
        for (const [healthy, expired] of tree.objects) {
            treeIds.push(healthy);
        }
    }
    return treeIds;
}
export function getTreeFromHealthy(id: number): IHarvestable {
    return Trees.find(tree => tree.objects.has(id)) as IHarvestable;
}
