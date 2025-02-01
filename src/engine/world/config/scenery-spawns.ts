import { readFileSync } from 'fs';
import { logger } from '@runejs/common';
import type { LandscapeObject } from '@runejs/filestore';
import { JSON_SCHEMA, load } from 'js-yaml';

export function parseScenerySpawns(): LandscapeObject[] {
    try {
        logger.info('Parsing scenery spawns...');

        const scenerySpawns = load(readFileSync('data/config/scenery-spawns.yaml', 'utf8'), { schema: JSON_SCHEMA }) as LandscapeObject[];

        if (!scenerySpawns || scenerySpawns.length === 0) {
            throw new Error('Unable to read scenery spawns.');
        }

        logger.info(`${scenerySpawns.length} scenery spawns found.`);

        return scenerySpawns;
    } catch (error) {
        logger.error('Error parsing scenery spawns: ' + error);
        return [];
    }
}
