import { itemMap } from '@engine/config/config-handler';
import type { ItemDetails } from '@engine/config/item-config';
import { loadConfigurationFiles } from '@runejs/common/fs';

interface SkillGuideConfiguration {
    id: number;
    name: string;
    members: boolean;
    sub_guides: {
        name: string;
        lines: {
            item: string;
            text: string;
            level: number;
        }[];
    }[];
}

export interface SkillGuide {
    id: number;
    name: string;
    members: boolean;
    sub_guides: SkillSubGuide[];
}

export interface SkillSubGuide {
    name: string;
    lines: {
        item: ItemDetails | undefined;
        text: string;
        level: number;
    }[];
}

/**
 * Loads the skill guides from the new json format.
 * @param path
 * @return SkillGuideConfiguration[]
 */
export async function loadSkillGuideConfigurations(path: string): Promise<SkillGuide[]> {
    const skillGuides: SkillGuide[] = [];

    const files = await loadConfigurationFiles<SkillGuideConfiguration>(path);
    files.forEach(skillGuide => {
        if (!skillGuide?.sub_guides) {
            return;
        }

        const subGuides: SkillSubGuide[] = [];
        skillGuide.sub_guides.forEach(subGuide => {
            const subGuideLines: SkillSubGuide['lines'] = [];
            subGuide.lines.forEach(line => {
                subGuideLines.push({
                    item: itemMap[line.item],
                    text: line.text,
                    level: line.level,
                });
            });
            subGuides.push({
                name: subGuide.name,
                lines: subGuideLines,
            });
        });
        skillGuides.push({
            id: skillGuide.id,
            name: skillGuide.name,
            members: skillGuide.members,
            sub_guides: subGuides,
        });
    });

    return skillGuides;
}
