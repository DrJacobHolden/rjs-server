export type CombatSpell = {
    name: string;
    level: number;
    baseExperience: number;
    runes: { id: number, amount: number }[];
    startGfx: number;
    projectileGfx: number;
    endGfx: number;
    maxHit: number;
};


export const SPELLS_BY_ID: Record<number, CombatSpell> = {
    0: {
        name: 'Wind Strike',
        level: 1,
        baseExperience: 5.5,
        runes: [
            { id: 556, amount: 1 },
            { id: 558, amount: 1 },
        ],
        startGfx: 90,
        projectileGfx: 91,
        endGfx: 92,
        maxHit: 2,
    },
    2: {
        name: 'Water Strike',
        level: 5,
        baseExperience: 7.5,
        runes: [
            { id: 556, amount: 1 },
            { id: 558, amount: 1 },
            { id: 555, amount: 1 },
        ],
        startGfx: 93,
        projectileGfx: 94,
        endGfx: 95,
        maxHit: 4,
    },
    4: {
        name: 'Earth Strike',
        level: 9,
        baseExperience: 9.5,
        runes: [
            { id: 556, amount: 1 },
            { id: 558, amount: 1 },
            { id: 557, amount: 2 },
        ],
        startGfx: 96,
        projectileGfx: 97,
        endGfx: 98,
        maxHit: 6,
    },
    6: {
        name: 'Fire Strike',
        level: 13,
        baseExperience: 11.5,
        runes: [
            { id: 556, amount: 1 },
            { id: 558, amount: 1 },
            { id: 554, amount: 3 },
        ],
        startGfx: 99,
        projectileGfx: 100,
        endGfx: 101,
        maxHit: 8,
    },
    8: {
        name: 'Wind Bolt',
        level: 17,
        baseExperience: 13.5,
        runes: [
            { id: 556, amount: 2 },
            { id: 558, amount: 1 },
        ],
        startGfx: 117,
        projectileGfx: 118,
        endGfx: 119,
        maxHit: 9,
    },
    11: {
        name: 'Water Bolt',
        level: 23,
        baseExperience: 16.5,
        runes: [
            { id: 556, amount: 2 },
            { id: 558, amount: 1 },
            { id: 555, amount: 2 },
        ],
        startGfx: 120,
        projectileGfx: 121,
        endGfx: 122,
        maxHit: 10,
    },
    14: {
        name: 'Earth Bolt',
        level: 29,
        baseExperience: 19.5,
        runes: [
            { id: 556, amount: 2 },
            { id: 558, amount: 1 },
            { id: 557, amount: 3 },
        ],
        startGfx: 123,
        projectileGfx: 124,
        endGfx: 125,
        maxHit: 11,
    },
    17: {
        name: 'Fire Bolt',
        level: 35,
        baseExperience: 22.5,
        runes: [
            { id: 556, amount: 2 },
            { id: 558, amount: 1 },
            { id: 554, amount: 4 },
        ],
        startGfx: 126,
        projectileGfx: 127,
        endGfx: 128,
        maxHit: 12,
    },
    20: {
        name: 'Wind Blast',
        level: 41,
        baseExperience: 25.5,
        runes: [
            { id: 556, amount: 3 },
            { id: 558, amount: 1 },
        ],
        startGfx: 132,
        projectileGfx: 133,
        endGfx: 134,
        maxHit: 13,
    },
    23: {
        name: 'Water Blast',
        level: 47,
        baseExperience: 28.5,
        runes: [
            { id: 556, amount: 3 },
            { id: 558, amount: 1 },
            { id: 555, amount: 3 },
        ],
        startGfx: 135,
        projectileGfx: 136,
        endGfx: 137,
        maxHit: 14,
    },
    25: {
        name: 'Earth Blast',
        level: 53,
        baseExperience: 31.5,
        runes: [
            { id: 556, amount: 3 },
            { id: 558, amount: 1 },
            { id: 557, amount: 4 },
        ],
        startGfx: 138,
        projectileGfx: 139,
        endGfx: 140,
        maxHit: 15,
    },
    29: {
        name: 'Fire Blast',
        level: 59,
        baseExperience: 34.5,
        runes: [
            { id: 556, amount: 3 },
            { id: 558, amount: 1 },
            { id: 554, amount: 5 },
        ],
        startGfx: 129,
        projectileGfx: 130,
        endGfx: 131,
        maxHit: 16,
    },
    37: {
        name: 'Wind Wave',
        level: 62,
        baseExperience: 36,
        runes: [
            { id: 556, amount: 5 },
            { id: 558, amount: 1 },
        ],
        startGfx: 155,
        projectileGfx: 156,
        endGfx: 157,
        maxHit: 17,
    },
    31: {
        name: 'Water Wave',
        level: 65,
        baseExperience: 37.5,
        runes: [
            { id: 556, amount: 5 },
            { id: 558, amount: 1 },
            { id: 555, amount: 7 },
        ],
        startGfx: 158,
        projectileGfx: 159,
        endGfx: 160,
        maxHit: 18,
    },
    33: {
        name: 'Earth Wave',
        level: 70,
        baseExperience: 40,
        runes: [
            { id: 556, amount: 5 },
            { id: 558, amount: 1 },
            { id: 557, amount: 7 },
        ],
        startGfx: 161,
        projectileGfx: 162,
        endGfx: 163,
        maxHit: 19,
    },
    36: {
        name: 'Fire Wave',
        level: 75,
        baseExperience: 42.5,
        runes: [
            { id: 556, amount: 5 },
            { id: 558, amount: 1 },
            { id: 554, amount: 7 },
        ],
        startGfx: 164,
        projectileGfx: 165,
        endGfx: 166,
        maxHit: 20,
    },
};
