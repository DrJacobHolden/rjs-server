import { logger } from '@runejs/common';
import { getFiles } from '@runejs/common/fs';
import { join } from 'path';
import { ContentPlugin } from '@engine/plugins/plugin.types';



/**
 * Searches for and parses all plugin files within the /plugins directory.
 */
export async function loadPluginFiles(): Promise<ContentPlugin[]> {
    const pluginDir = join('.', 'dist', 'plugins');
    const relativeDir = join('..', '..', 'plugins');
    const plugins: ContentPlugin[] = [];

    for await(const path of getFiles(pluginDir, { type: 'whitelist', list: ['.plugin.js', 'index.js'] })) {
        const location = join(relativeDir, path.substring(pluginDir.length).replace('.js', ''));

        try {
            let pluginFile = require(location);
            if(!pluginFile) {
                continue;
            }

            if(pluginFile.default) {
                pluginFile = pluginFile.default;
            }

            const plugin = pluginFile as ContentPlugin;
            if(!plugin.pluginId) {
                logger.error(`Error loading plugin: Plugin ID not provided for .plugin file at ${path}`);
                continue;
            }

            if(plugins.find(loadedPlugin => loadedPlugin.pluginId === plugin.pluginId)) {
                logger.error(`Error loading plugin: Duplicate plugin ID ${plugin.pluginId} at ${path}`);
                continue;
            }

            plugins.push(plugin);
        } catch(error) {
            logger.error(`Error loading plugin file at ${location}:`);
            logger.error(error);
        }
    }

    return plugins;
}
