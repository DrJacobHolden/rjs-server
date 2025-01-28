import { randomBetween } from '@engine/util';
import { objectIds } from '@engine/world/config/object-ids';

// Some mining nodes can yield different oreItemName.
type WeightedItem = {
    itemConfigId: string;
    weight: number;
};

type OreID = number;
type EmptyRockID = number;
export type Ore = {
    emptyRockIdByOreId: Record<OreID, EmptyRockID>;
    oreItemName: string | WeightedItem[];
    levelToMine: number;
    exp: number;
    baseMineChance: number;
    minRespawnTicks: number;
    maxRespawnTicks: number;
    emptyChance: number;
};

const getEmptyRockByOre = (
    ore: keyof (typeof objectIds)['default'],
): Ore['emptyRockIdByOreId'] => {
    const oreObjectIds = objectIds.default[ore];
    if (!oreObjectIds) {
        throw new Error(`No object ids found for ore: ${ore}`);
    }

    return oreObjectIds.reduce<Ore['emptyRockIdByOreId']>((acc, ore) => {
        acc[ore.default] = ore.empty;
        return acc;
    }, {});
};

const ores: Ore[] = [
    {
        emptyRockIdByOreId: getEmptyRockByOre('clay'),
        oreItemName: 'rs:clay',
        levelToMine: 1,
        exp: 5.0,
        minRespawnTicks: 5,
        maxRespawnTicks: 10,
        baseMineChance: 70,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('copper'),
        oreItemName: 'rs:copper_ore',
        levelToMine: 1,
        exp: 17.5,
        minRespawnTicks: 10,
        maxRespawnTicks: 20,
        baseMineChance: 70,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('tin'),
        oreItemName: 'rs:tin_ore',
        levelToMine: 1,
        exp: 17.5,
        minRespawnTicks: 10,
        maxRespawnTicks: 20,
        baseMineChance: 70,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('iron'),
        oreItemName: 'rs:iron_ore',
        levelToMine: 15,
        exp: 35.0,
        minRespawnTicks: 9,
        maxRespawnTicks: 9,
        baseMineChance: 0.0085,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('coal'),
        oreItemName: 'rs:coal',
        levelToMine: 30,
        exp: 50.0,
        minRespawnTicks: 20,
        maxRespawnTicks: 30,
        baseMineChance: 50,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('silver'),
        oreItemName: 'rs:silver_ore',
        levelToMine: 20,
        exp: 40.0,
        minRespawnTicks: 30,
        maxRespawnTicks: 40,
        baseMineChance: 40,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('gold'),
        oreItemName: 'rs:gold_ore',
        levelToMine: 40,
        exp: 65.0,
        minRespawnTicks: 50,
        maxRespawnTicks: 70,
        baseMineChance: 30,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('mithril'),
        oreItemName: 'rs:mithril_ore',
        levelToMine: 55,
        exp: 65.0,
        minRespawnTicks: 90,
        maxRespawnTicks: 120,
        baseMineChance: 20,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('adamant'),
        oreItemName: 'rs:adamantite_ore',
        levelToMine: 70,
        exp: 95.0,
        minRespawnTicks: 200,
        maxRespawnTicks: 400,
        baseMineChance: 0,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: getEmptyRockByOre('runite'),
        oreItemName: 'rs:runite_ore',
        levelToMine: 85,
        exp: 125.0,
        minRespawnTicks: 1200,
        maxRespawnTicks: 1200,
        baseMineChance: -10,
        emptyChance: 100,
    },
    {
        emptyRockIdByOreId: { 2111: 450 },
        oreItemName: [
            { itemConfigId: 'rs:uncut_opal', weight: 60 }, // 60/128
            { itemConfigId: 'rs:uncut_jade', weight: 30 }, // 30/128
            { itemConfigId: 'rs:uncut_red_topaz', weight: 15 }, // 15/128
            { itemConfigId: 'rs:uncut_sapphire', weight: 9 }, // 9/128
            { itemConfigId: 'rs:uncut_emerald', weight: 5 }, // 5/128
            { itemConfigId: 'rs:uncut_ruby', weight: 5 }, // 5/128
            { itemConfigId: 'rs:uncut_diamond', weight: 4 }, // 4/128
        ],
        levelToMine: 40,
        exp: 65.0,
        minRespawnTicks: 200,
        maxRespawnTicks: 400,
        baseMineChance: 28, // Base success chance at levelToMine 40
        emptyChance: 100, // Always depletes after successful mining
    },
];

export function selectWeightedItem(items: WeightedItem[]): string {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = randomBetween(1, totalWeight);

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) {
            return item.itemConfigId;
        }
    }

    return items[0].itemConfigId; // Fallback to first item
}

export const getOreFromRock = (objectId: number): Ore | undefined => {
    return ores.find((ore) => ore.emptyRockIdByOreId[objectId] !== undefined);
};

export const getOreIds = (): number[] => {
    return ores.flatMap((ore) =>
        Object.keys(ore.emptyRockIdByOreId).map(Number),
    );
};
