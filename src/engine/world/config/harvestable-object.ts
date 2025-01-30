import { objectIds } from '@engine/world/config/object-ids';
import { itemIds } from './item-ids';

export interface IHarvestable {
    objects: Map<number, number>;
    itemId: number;
    level: number;
    experience: number;
    respawnLow: number;
    respawnHigh: number;
    baseChance: number;
    break: number;
}


// Object maps work with key is mineable object, value is empty ore
const CLAY_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.clay.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const COPPER_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.copper.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const TIN_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.tin.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const IRON_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.iron.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const COAL_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.coal.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const SILVER_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.silver.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const GOLD_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.gold.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const MITHRIL_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.mithril.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);


const ADAMANT_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.adamant.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

const RUNITE_OBJECTS: Map<number, number> = new Map<number, number>([
    ...objectIds.default.runite.map((tree) => [tree.default, tree.empty]),
] as [number, number][]);

export enum Ore {
    CLAY,
    COPPER,
    TIN,
    IRON,
    COAL,
    SILVER,
    GOLD,
    MITHIL,
    ADAMANT,
    RUNITE,
    RUNE_ESS,
    GEM
}


export enum Tree {
    NORMAL,
    ACHEY,
    OAK,
    WILLOW,
    TEAK,
    MAPLE,
    MAHOGANY,
    YEW,
    MAGIC,
}


const Ores: IHarvestable[] = [
    {
        objects: CLAY_OBJECTS,
        itemId: itemIds.ores.clay,
        level: 1,
        experience: 5.0,
        respawnLow: 5,
        respawnHigh: 10,
        baseChance: 70,
        break: 100
    },
    {
        objects: COPPER_OBJECTS,
        itemId: itemIds.ores.copper,
        level: 1,
        experience: 17.5,
        respawnLow: 10,
        respawnHigh: 20,
        baseChance: 70,
        break: 100
    },
    {
        objects: TIN_OBJECTS,
        itemId: itemIds.ores.tin,
        level: 1,
        experience: 17.5,
        respawnLow: 10,
        respawnHigh: 20,
        baseChance: 70,
        break: 100
    },
    {
        objects: IRON_OBJECTS,
        itemId: itemIds.ores.iron,
        level: 15,
        experience: 35.0,
        respawnLow: 9,
        respawnHigh: 9,
        baseChance: 0.0085,
        break: 100
    },
    {
        objects: COAL_OBJECTS,
        itemId: itemIds.ores.coal,
        level: 30,
        experience: 50.0,
        respawnLow: 20,
        respawnHigh: 30,
        baseChance: 50,
        break: 100
    },
    {
        objects: SILVER_OBJECTS,
        itemId: itemIds.ores.silver,
        level: 20,
        experience: 40.0,
        respawnLow: 30,
        respawnHigh: 40,
        baseChance: 40,
        break: 100
    },
    {
        objects: GOLD_OBJECTS,
        itemId: itemIds.ores.gold,
        level: 40,
        experience: 65.0,
        respawnLow: 50,
        respawnHigh: 70,
        baseChance: 30,
        break: 100
    },
    {
        objects: MITHRIL_OBJECTS,
        itemId: itemIds.ores.mithril,
        level: 55,
        experience: 65.0,
        respawnLow: 90,
        respawnHigh: 120,
        baseChance: 20,
        break: 100
    },
    {
        objects: ADAMANT_OBJECTS,
        itemId: itemIds.ores.adamantite,
        level: 70,
        experience: 95.0,
        respawnLow: 200,
        respawnHigh: 400,
        baseChance: 0,
        break: 100
    },
    {
        objects: RUNITE_OBJECTS,
        itemId: itemIds.ores.runite,
        level: 85,
        experience: 125.0,
        respawnLow: 1200,
        respawnHigh: 1200,
        baseChance: -10,
        break: 100
    },
    {
        objects: new Map<number, number>([[2111, 450]]), // Gem rocks
        itemId: 1625,
        level: 40,
        experience: 65.0,
        respawnLow: 200,
        respawnHigh: 400,
        baseChance: 30,
        break: 100
    }
];

export function getOre(ore: Ore): IHarvestable {
    return Ores[ore];
}

export function getOreFromRock(id: number): IHarvestable {
    return Ores.find(ore => ore.objects.has(id)) as IHarvestable;
}



export function getOreFromDepletedRock(id: number): IHarvestable {
    return Ores.find(ore => {
        for (const [rock, expired] of ore.objects) {
            if (expired === id) {
                return true;
            }
        }
        return false;
    }) as IHarvestable;
}

export function getAllOreIds(): number[] {
    const oreIds: number[] = [];
    for (const ore of Ores) {
        for (const [rock, expired] of ore.objects) {
            oreIds.push(rock);
            oreIds.push(expired);
        }
    }
    return oreIds;
}

